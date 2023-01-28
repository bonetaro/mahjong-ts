/* eslint-disable no-case-declarations */
/* eslint-disable no-constant-condition */
import { askOtherPlayersWhatCommand, askOtherPlayersWhetherDoChankanIfPossible, askPlayerWhatCommand } from "../AskPlayer";
import { CommandType } from "../Constants";
import { CustomError } from "../CustomError";
import { 牌 } from "../Types";
import * as Commands from "./Command";
import { GameRoundHand } from "./GameRoundHand";
import { OtherPlayersTurnResult, PlayerTurnResult, TurnResult } from "./TurnResult";

/**
 * プレイヤーが牌を積もって、捨てる => ほかのプレイヤーがアクションするまでの一連の流れ
 */
export class Turn {
  constructor(private roundHand: GameRoundHand) {}

  run = async (): Promise<TurnResult> => {
    this.roundHand.currentPlayer.drawTile(this.roundHand.pickWallTile());

    // 牌をツモったプレイヤーのターン（ツモか牌を捨てるか）
    const turnResult = await this.playerTurn();

    // ツモもしくは槍槓
    if (turnResult.playerWin) {
      return turnResult;
    }

    if (turnResult.command instanceof Commands.DiscardCommand) {
      // 牌をツモったプレイヤー以外のプレイヤーのターン(プレイヤーが捨てた牌へのアクション。鳴いた後に捨てた牌をさらに鳴く処理も含まれる)
      return await this.otherPlayersTurn((turnResult.command as Commands.DiscardCommand).tile);
    }

    throw new CustomError(turnResult);
  };

  // 牌をツモったプレイヤーのターン（槍槓も含まれる）
  playerTurn = async (): Promise<TurnResult> => {
    while (true) {
      const command = await askPlayerWhatCommand(this.roundHand.currentPlayer);

      switch (command.type) {
        case CommandType.Tsumo:
          this.roundHand.executeCommand(command);
          return new PlayerTurnResult(command as Commands.TsumoCommand);

        case CommandType.Discard:
          this.roundHand.executeCommand(command);
          return new PlayerTurnResult(command as Commands.DiscardCommand);

        case CommandType.Kan:
          // todo 槍槓の場合は、カン自体は成立しないらしいので、このタイミングで実行
          const chankanCommand = askOtherPlayersWhetherDoChankanIfPossible(command);
          if (chankanCommand) {
            return new OtherPlayersTurnResult(chankanCommand);
          }

          // カン（暗槓 or 加槓）を実行
          this.roundHand.executeCommand(command);
          // カンした場合は、もう一度捨て牌選択
          continue;

        default:
          throw new CustomError(command.type);
      }
    }
  };

  // 牌をツモって捨てたプレイヤーの捨てた牌に対するアクション（その牌を鳴いて捨てた牌をさらに鳴くアクションも含まれる）
  otherPlayersTurn = async (playerDiscardTile: 牌): Promise<OtherPlayersTurnResult> => {
    let currentPlayer = this.roundHand.currentPlayer;
    let discardTile = playerDiscardTile;

    while (true) {
      const command = await askOtherPlayersWhatCommand(this.roundHand.players, discardTile, currentPlayer);

      // 誰も反応しなかったら、次のプレイヤーのツモ番（ターンが終わる）
      if (command instanceof Commands.NothingCommand) {
        return new OtherPlayersTurnResult(command as Commands.NothingCommand);
      }

      // 鳴きよりもロンが最優先で処理される
      if (command instanceof Commands.RonCommand) {
        return new OtherPlayersTurnResult(command as Commands.RonCommand);
      }

      // ここに来るときは、鳴いた場合（ポン、チー、カン（大明槓））
      if (command instanceof Commands.PonCommand || command instanceof Commands.ChiCommand || command instanceof Commands.DaiMinKanCommand) {
        // 鳴いた人に手番を変更する
        currentPlayer = this.roundHand.setCurrentPlayer(command.who);
        discardTile = await this.roundHand.executeMeldCommand(command, currentPlayer);

        // 捨てた牌に対し、ほかのプレイヤーにアクションをさせるために、whileループを繰り返す
        continue;
      }

      throw new CustomError(command);
    }
  };
}
