/* eslint-disable no-case-declarations */
/* eslint-disable no-constant-condition */
import { CustomError, askOtherPlayersWhatCommand, askOtherPlayersWhetherDoChankanIfPossible, askPlayerWhatCommand } from "../lib";
import { GameRoundHand, OtherPlayersTurnResult, PlayerTurnResult, TurnResult } from ".";
import * as Commands from "./Command";
import { 牌 } from "../types";

/**
 * プレイヤーが牌を積もって、捨てる => ほかのプレイヤーがアクションするまでの一連の流れ
 */
export class Turn {
  constructor(private roundHand: GameRoundHand) {}

  run = async (): Promise<TurnResult> => {
    this.roundHand.currentPlayer.drawTile(this.roundHand.pickWallTile());

    // 牌をツモったプレイヤーのターン（ツモか牌を捨てるか）
    const playerTurnResult = await this.playerTurn();

    // ツモもしくは槍槓
    if (playerTurnResult.playerWin) {
      return playerTurnResult;
    }

    if (playerTurnResult.command instanceof Commands.DiscardCommand) {
      // 牌をツモったプレイヤー以外のプレイヤーのターン(プレイヤーが捨てた牌へのアクション。鳴いた後に捨てた牌をさらに鳴く処理も含まれる)
      return await this.otherPlayersTurn(playerTurnResult.command.tile);
    }

    throw new CustomError(playerTurnResult);
  };

  // 牌をツモったプレイヤーのターン（槍槓も含まれる）
  playerTurn = async (): Promise<TurnResult> => {
    while (true) {
      const playerCommand = await askPlayerWhatCommand(this.roundHand.currentPlayer);

      if ([Commands.TsumoCommand, Commands.DiscardCommand].some((command) => playerCommand instanceof command)) {
        this.roundHand.executeCommand(playerCommand);
        return new PlayerTurnResult(playerCommand);
      }

      if (playerCommand.type == "kan") {
        // todo 槍槓の場合は、カン自体は成立しないらしいので、このタイミング(kanCommandの実行前に)で実行
        const chankanCommand = askOtherPlayersWhetherDoChankanIfPossible(playerCommand);
        if (chankanCommand) {
          return new OtherPlayersTurnResult(chankanCommand);
        }

        // カン（暗槓 or 加槓）を実行
        this.roundHand.executeCommand(playerCommand);

        // カンした場合は、PlayerTurnを繰り返す
        continue;
      }

      throw new CustomError(playerCommand);
    }
  };

  // 牌を捨てたプレイヤーに対するアクション（その牌を鳴いて捨てた牌をさらに鳴くアクションも含まれる）
  otherPlayersTurn = async (playerDiscardTile: 牌): Promise<OtherPlayersTurnResult> => {
    let discardTile = playerDiscardTile;

    while (true) {
      const otherPlayerCommand = await askOtherPlayersWhatCommand(this.roundHand.players, discardTile, this.roundHand.currentPlayer);

      // 鳴きよりもロンが最優先で処理される
      // 誰も反応しなかったら、次のプレイヤーのツモ番（ターンが終わる）
      if ([Commands.NothingCommand, Commands.RonCommand].some((command) => otherPlayerCommand instanceof command)) {
        return new OtherPlayersTurnResult(otherPlayerCommand);
      }

      if ([Commands.PonCommand, Commands.ChiCommand, Commands.DaiMinKanCommand].some((command) => otherPlayerCommand instanceof command)) {
        // 鳴いた人に手番を変更する
        this.roundHand.setCurrentPlayer(otherPlayerCommand.who);
        // 鳴きを実行
        discardTile = await this.roundHand.executeMeldCommand(otherPlayerCommand, otherPlayerCommand.who);

        // 捨てた牌に対し、ほかのプレイヤーにアクションをさせるために、whileループを繰り返す
        continue;
      }

      throw new CustomError(otherPlayerCommand);
    }
  };
}
