/* eslint-disable no-constant-condition */
/* eslint-disable no-case-declarations */
import {
  CommandTextCreator,
  CommandType,
  FourMembers,
  WindNames,
  askOtherPlayersWhatCommand,
  askPlayerWhatCommand,
  logger,
  selectCommand,
  toEmojiMoji,
  牌,
} from "../";
import { Game, RoundHandPlayer, Table, DrawTile } from "./";
import * as Commands from "./Command";
import { throwErrorAndLogging } from "../error";

// 局
export class GameRoundHand {
  protected _table: Table = new Table();
  protected _players: FourMembers<RoundHandPlayer>;
  private _playerIndex = 0;
  private _isDraw = false; // 流局

  constructor(players: FourMembers<RoundHandPlayer>) {
    logger.debug("gameRoundHand create");

    this._players = players;
  }

  get isDraw(): boolean {
    return this._isDraw;
  }

  get table(): Table {
    return this._table;
  }

  get players(): FourMembers<RoundHandPlayer> {
    return this._players;
  }

  get currentPlayer(): RoundHandPlayer {
    return this._players[this._playerIndex];
  }

  name(game: Game): string {
    return `${WindNames[game.roundCount - 1]}${game.currentRound.hands.length}局`;
  }

  dealTiles(num: number): Array<牌> {
    const tiles = [...Array(num)].map(() => this.table.pickTile());
    return tiles;
  }

  dealStartingTilesToPlayers(): void {
    logger.debug("game dealStartTilesToPlayers");

    // 各プレイヤー4枚ずつ3回牌をつもる
    [...Array(3)].forEach(() => this.players.forEach((player) => player.drawTiles(this.dealTiles(4))));

    // 各プレイヤー1枚牌をつもる
    this.players.forEach((player) => player.drawTiles(this.dealTiles(1)));
  }

  askOtherPlayersWhetherDoChankanIfPossible = (command: Commands.PlayerCommand): Commands.ChankanRonCommand => {
    // todo
    return null;
  };

  // 牌をツモったプレイヤーのターン
  playerTurn = async (): Promise<TurnResult> => {
    while (true) {
      const command = await askPlayerWhatCommand(this.currentPlayer);
      switch (command.type) {
        case CommandType.Kan:
          // todo 槍槓の場合は、カン自体は成立しないらしいので、このタイミングで実行
          const chankanCommand = this.askOtherPlayersWhetherDoChankanIfPossible(command);
          if (chankanCommand) {
            return this.ronEnd(chankanCommand);
          }

          // カン(暗槓 or 加槓)を実行
          this.executeCommand(command);

          // カンした場合は、もう一度捨て牌選択
          continue;
        case CommandType.Tsumo:
          return this.tsumoEnd(command as Commands.TsumoCommand);
        case CommandType.Discard:
          this.executeCommand(command);

          return new TurnResult(command, false);
        default:
          throwErrorAndLogging(command.type);
      }
    }
  };

  // 牌をツモって捨てたプレイヤーの捨てた牌に対するアクション
  // その牌を鳴いて捨てた牌をさらに鳴くアクションも含まれる
  otherPlayersTurn = async (playerDiscardTile: 牌): Promise<TurnResult> => {
    let currentPlayer = this.currentPlayer;
    let discardTile = playerDiscardTile;

    while (true) {
      const command = await askOtherPlayersWhatCommand(this.players, discardTile, currentPlayer);

      if (command.type == CommandType.Nothing) {
        // 誰も反応しなかったら、次のプレイヤーのツモ番（ターンが終わる）
        return new TurnResult(command, false);
      }

      // 鳴きよりもロンが最優先で処理される
      if (command.type === CommandType.Ron) {
        return this.ronEnd(command as Commands.RonCommand);
      }

      // ここに来るときは、鳴いた場合（ポン、チー、カン（大明槓））
      // 鳴いた人に手番を変更する
      currentPlayer = this.setCurrentPlayer(command.who);
      discardTile = await this.executeMeldCommand(command, currentPlayer);

      // 捨てた牌に対し、ほかのプレイヤーにアクションをさせるために、whileループを繰り返す
    }
  };

  // ポン、チー、カン(大明槓)を実行
  executeMeldCommand = async (command: Commands.BaseCommand, player: RoundHandPlayer): Promise<牌> => {
    this.executeCommand(command);

    // どの牌を捨てるか
    const commandText = new CommandTextCreator().createPlayerCommandText([CommandType.Discard], player);
    const discardTileNumber = await selectCommand(commandText, player.hand, [CommandType.Discard]);

    // 牌を捨てる
    const discardCommand = new Commands.DiscardCommand(player, player.hand.tiles[Number(discardTileNumber)]);
    this.executeCommand(discardCommand);

    return discardCommand.tile;
  };

  turn = async (): Promise<TurnResult> => {
    this.currentPlayer.drawTile(this.pickTile());

    // 牌をツモったプレイヤーのターン（ツモか牌を捨てるか）
    const turnResult = await this.playerTurn();
    if (turnResult.roundHandEnd) {
      return turnResult;
    }

    // 牌をツモったプレイヤー以外のプレイヤーのターン(プレイヤーが捨てた牌へのアクション)
    // 鳴いた後に捨てた牌をさらに鳴く処理も含まれる
    return await this.otherPlayersTurn((turnResult.command as Commands.DiscardCommand).tile);
  };

  pickTile(): DrawTile {
    return new DrawTile(this.table.pickTile());
  }

  pickKingsTile(): DrawTile {
    // 山の最終牌を王牌に足して、嶺上牌をツモる
    const lastTile = this._table.popTile();
    const tile = this._table.kingsWall.pickTile(lastTile);

    return new DrawTile(tile, true);
  }

  // 局のループ
  mainLoop = async () => {
    do {
      const turnResult = await this.turn();
      if (turnResult.roundHandEnd) {
        return;
      }

      if (!this.hasRestTiles()) {
        this.drawEnd(); // 流局
        return;
      }

      this.setNextPlayer();
    } while (true);
  };

  setCurrentPlayer(player: RoundHandPlayer): RoundHandPlayer {
    const index = this.players.findIndex((p) => p.id == player.id);
    this.setPlayerIndex(index);

    return this.currentPlayer;
  }

  setPlayerIndex(index: number): void {
    if (index < 0) {
      throwErrorAndLogging(index);
    }

    this._playerIndex = index % this._players.length;
  }

  setNextPlayer(): void {
    this.setPlayerIndex(this._playerIndex + 1);

    logger.info(`${this.currentPlayer.fullName}の手番です`);
  }

  executeCommand(command: Commands.BaseCommand): void {
    command.execute(this);
  }

  hasRestTiles(): boolean {
    logger.info(`残りの山の牌：${this.table.restTilesCount}枚`);

    return this.table.restTilesCount > 0;
  }

  tsumoEnd(command: Commands.TsumoCommand): TurnResult {
    logger.info(`${command.who.name} ツモ和了`);

    return new TurnResult(command, true);
  }

  ronEnd(command: Commands.RonCommand): TurnResult {
    logger.info(`${command.who.name}が${command.whomPlayer(this).name}に${toEmojiMoji(command.tile)}で振り込みました`);

    return new TurnResult(command, true);
  }

  drawEnd(): void {
    logger.info("draw end");

    this._isDraw = true;
  }
}

export class CheatGameRoundHand extends GameRoundHand {
  get table() {
    return this._table;
  }

  // イカサマ牌を設定するためsetterを用意
  set table(table: Table) {
    this._table = table;
  }
}

class TurnResult {
  constructor(public command: Commands.BaseCommand, public roundHandEnd: boolean) {}
}
