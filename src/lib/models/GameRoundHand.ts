/* eslint-disable no-constant-condition */
/* eslint-disable no-case-declarations */
import { CommandTextCreator, CommandType, FourMembers, WindNames, logger, selectCommand, toEmojiMoji, 牌 } from "../";
import { Game, Table, DrawTile, Turn } from "./";
import * as Commands from "./Command";
import { CustomError } from "../CustomError";
import { TurnResult } from "./TurnResult";
import { TsumoCommand, RonCommand } from "./Command";
import { PlayerIndex } from "../Types";
import { RoundHandMembers } from "./RoundHandMembers";
import { RoundHandPlayer } from "./RoundHandPlayer";

// 局
export class GameRoundHand {
  protected _table: Table = new Table();
  protected _members: RoundHandMembers;
  private _playerIndex: PlayerIndex = 0;
  private _isDraw = false; // 流局

  constructor(players: FourMembers<RoundHandPlayer>) {
    logger.debug("gameRoundHand create");

    this._members = new RoundHandMembers(players);
  }

  get isDraw(): boolean {
    return this._isDraw;
  }

  get table(): Table {
    return this._table;
  }

  get menbers(): RoundHandMembers {
    return this._members;
  }

  get players(): FourMembers<RoundHandPlayer> {
    return this._members.players;
  }

  get currentPlayer(): RoundHandPlayer {
    return this._members.getPlayer(this._playerIndex);
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

  // ポン、チー、カン(大明槓)を実行
  executeMeldCommand = async (command: Commands.BaseCommand, player: RoundHandPlayer): Promise<牌> => {
    this.executeCommand(command);

    // どの牌を捨てるか
    const commandText = new CommandTextCreator([CommandType.Discard]).createPlayerCommandText(player);
    const discardTileNumber = await selectCommand(commandText, player.hand, [CommandType.Discard]);

    // 牌を捨てる
    const discardCommand = new Commands.DiscardCommand(player, player.hand.tiles[Number(discardTileNumber)]);
    this.executeCommand(discardCommand);

    return discardCommand.tile;
  };

  pickWallTile(): DrawTile {
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
      const turnResult = await new Turn(this).run();

      if (turnResult.playerWin) {
        this.playerWinEnd(turnResult);
        return;
      }

      if (!this.hasRestTiles()) {
        this.drawEnd();
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
      throw new CustomError(index);
    }

    this._playerIndex = (index % this._members.players.length) as PlayerIndex;
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

  playerWinEnd(turnResult: TurnResult) {
    if (turnResult.command instanceof TsumoCommand) {
      this.tsumoEnd(turnResult.command as TsumoCommand);
    }

    if (turnResult.command instanceof RonCommand) {
      this.ronEnd(turnResult.command as RonCommand);
    }

    throw new CustomError(turnResult);
  }

  tsumoEnd(command: Commands.TsumoCommand): void {
    logger.info(`${command.who.name}がツモ和了しました`);
  }

  ronEnd(command: Commands.RonCommand): void {
    logger.info(`${command.who.name}が${command.whomPlayer(this).name}に${toEmojiMoji(command.tile)}で振り込みました`);
  }

  drawEnd(): void {
    logger.info("流局しました");

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
