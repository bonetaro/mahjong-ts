import { List } from "linqts";
import { logger } from "../logging";
import { 牌 } from "./Types";
import { toMoji } from "./Functions";
import { Player } from "./Player";
import { Dice } from "./Dice";
import { Table } from "./Table";
import { GameRound } from "./GameRound";
import { WindsLabel } from "./Constants";
import { GameHand } from "./GameHand";

export class Game {
  private _dices: [Dice, Dice] = [new Dice(), new Dice()];
  private _table: Table = new Table();
  private _players: Array<Player> = [];
  private _dealer: Player;
  private _rounds: GameRound[] = [];

  constructor() {
    logger.info(`半荘が作成されました`);
  }

  get table(): Table {
    return this._table;
  }

  get players(): Array<Player> {
    return this._players;
  }

  get dealer(): Player {
    return this._dealer;
  }

  get restTilesCount(): number {
    return this._table.restTilesCount;
  }

  get currentRound(): GameRound {
    return new List(this._rounds).Last();
  }

  validateForStart(): boolean {
    if (!this.validatePlayers()) {
      return false;
    }

    return true;
  }

  validatePlayers(): boolean {
    if (this._players.length != 4) {
      logger.error(`players is ${this._players.length} people.`);
      return false;
    }

    return true;
  }

  rollDices(): number {
    const dice = this._dices[0];
    const dice2 = this._dices[1];

    dice.roll();
    dice2.roll();

    logger.info(`サイコロ: ${dice.toEmoji()} ${dice2.toEmoji()} `);

    return dice.num + dice2.num;
  }

  pickUpPlayerAtRandom(): Player {
    return new List(this._players).OrderBy(() => Math.random()).First();
  }

  buildWalls(): void {
    this._table.washTiles();
    this._table.buildWalls();
  }

  pickUpDealer(): void {
    this._dealer = this.pickUpPlayerAtRandom();
    logger.info(`仮親：${this.dealer.name}`);

    this._dealer = this.pickUpPlayerAtRandom();
    logger.info(`親：${this.dealer.name}`);
  }

  showPlayerList(): void {
    const playerLabelList: string[] = [];
    new List(WindsLabel).Zip(new List(this.players), (wind, player) => {
      playerLabelList.push(`${wind}家: ${player.name}`);
    });

    logger.info(playerLabelList.join(" "));
  }

  createGameRound(): void {
    this._rounds.push(new GameRound());
  }

  createGameHand(): void {
    this.currentRound.hands.push(new GameHand());
  }

  showGame(): void {
    logger.info(
      `${WindsLabel[this._rounds.length - 1]}${
        this.currentRound.hands.length
      }局`
    );
  }

  start(): void {
    this.pickUpDealer();

    this.showPlayerList();

    if (!this.validateForStart()) {
      return;
    }

    logger.info("半荘開始");

    this.createGameRound(); // 場生成
    this.createGameHand(); // 局生成

    this.showGame();

    this.rollDices();

    // todo サイコロを振っているが王牌と無関係
    this._table.makeDeadWall();

    const dora = this.table.deadWall.dora;
    logger.info(`ドラ: ${toMoji(dora)}`);
  }

  //牌を配る
  dealTiles(num: number): Array<牌> {
    let tiles: Array<牌> = [];

    for (let i = 0; i < num; i++) {
      tiles.push(this.dealTile());
    }

    return tiles;
  }

  dealTile(): 牌 {
    const tile = this._table.pickTile();
    return tile;
  }

  dealTilesToPlayers(): void {
    for (let i = 0; i < 3; i++) {
      this._players.forEach((player) => {
        player.drawTiles(this.dealTiles(4));
      });
    }

    this._players.forEach((player) => {
      player.drawTiles(this.dealTiles(1));
    });
  }

  setPlayers(players: Array<Player>): void {
    players.forEach((player) => {
      this.setPlayer(player);
    });
  }

  setPlayer(player: Player): void {
    if (this._players.length > 4) {
      throw new Error("プレイヤーは4人");
    }

    this._players.push(player);

    logger.info(`${player.name}が参加しました`);
  }
}
