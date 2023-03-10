/* eslint-disable no-constant-condition */
import { FourMembers, PlayerDirection, PlayerIndex, isPlayerIndex, 牌 } from "../types";
import { DrawTile, Game, GameRoundHandPlayer, GameTable, Tile, Turn, TurnResult } from ".";
import { CommandTextCreator, CustomError, logger } from "../lib";
import * as Commands from "./Command";
import { WindNameList } from "../constants";
import { selectDicardTile } from "../lib/readline";

// 局
export class GameRoundHand {
  private _isDraw = false; // 流局
  private _playerIndex: PlayerIndex = 0;

  constructor(public players: FourMembers<GameRoundHandPlayer>, public readonly table = new GameTable()) {
    logger.debug("gameRoundHand create");
  }

  get isDraw(): boolean {
    return this._isDraw;
  }

  get currentPlayer(): GameRoundHandPlayer {
    return this.players[this._playerIndex];
  }

  name(game: Game): string {
    return `${WindNameList[game.roundCount - 1]}${game.currentRound.hands.length}局`;
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
  executeMeldCommand = async (command: Commands.BaseCommand, player: GameRoundHandPlayer): Promise<牌> => {
    if ([Commands.PonCommand, Commands.ChiCommand, Commands.DaiMinKanCommand].every((c) => !(command instanceof c))) {
      throw new Error(command.type);
    }

    this.executeCommand(command);

    // どの牌を捨てるか
    const commandText = new CommandTextCreator(["discard"]).createPlayerCommandText(player);
    const num = await selectDicardTile(commandText, player.hand);

    // 牌を捨てる
    const discardCommand = new Commands.DiscardCommand(player, player.hand.tiles[Number(num)]);
    this.executeCommand(discardCommand);

    return discardCommand.tile;
  };

  pickWallTile(): DrawTile {
    return new DrawTile(this.table.pickTile());
  }

  pickKingsTile(): DrawTile {
    // 山の最終牌を王牌に足して、嶺上牌をツモる
    const lastTile = this.table.popTile();
    const tile = this.table.kingsWall.pickTile(lastTile);

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

  setCurrentPlayer(player: GameRoundHandPlayer): void {
    const index = this.players.findIndex((p) => p.id == player.id);
    this.setPlayerIndex(index);
  }

  setPlayerIndex(index: number): void {
    const newIndex = index % this.players.length;
    if (isPlayerIndex(newIndex)) {
      this._playerIndex = newIndex;

      logger.info(`${this.currentPlayer.fullName}の手番です`);
    } else {
      throw new CustomError(index);
    }
  }

  setNextPlayer(): void {
    this.setPlayerIndex(this._playerIndex + 1);
  }

  getPlayerByDirection(player: GameRoundHandPlayer, direction: PlayerDirection): GameRoundHandPlayer {
    const index = player.calculateIndex(direction);
    return this.players[index];
  }

  executeCommand(command: Commands.BaseCommand): void {
    command.execute(this);
  }

  hasRestTiles(): boolean {
    logger.info(`残りの山の牌：${this.table.restTilesCount}枚`);

    return this.table.restTilesCount > 0;
  }

  playerWinEnd(turnResult: TurnResult) {
    if (turnResult.command instanceof Commands.TsumoCommand) {
      this.tsumoEnd(turnResult.command as Commands.TsumoCommand);
    }

    if (turnResult.command instanceof Commands.RonCommand) {
      this.ronEnd(turnResult.command as Commands.RonCommand);
    }

    throw new CustomError(turnResult);
  }

  tsumoEnd(command: Commands.TsumoCommand): void {
    logger.info(`${command.who.name}がツモ和了しました`);
  }

  ronEnd(command: Commands.RonCommand): void {
    logger.info(`${command.who.name}が${command.whomPlayer(this).name}に${Tile.toEmojiMoji(command.tile)}で振り込みました`);
  }

  drawEnd(): void {
    logger.info("流局しました");

    this._isDraw = true;
  }
}
