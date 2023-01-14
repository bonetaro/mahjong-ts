/* eslint-disable no-constant-condition */
import { List } from "linqts";
import { LogEvent, logger } from "./logging";
import { WindsLabel } from "./Constants";
import { toMoji } from "./Functions";
import { Player } from "./Player";
import { GameRound } from "./GameRound";
import { GameRoundHand } from "./GameRoundHand";
import { anyKeyAsk } from "./AskPlayer";
import { Dice } from "./Dice";

export class Game {
  private _dices: [Dice, Dice] = [new Dice(), new Dice()];
  private _players: Array<Player> = [];
  private _firstDealer: Player;
  private _rounds: GameRound[] = [];

  constructor(players: Player[]) {
    logger.debug(`game create`);

    this.setPlayers(players);
  }

  get players(): Array<Player> {
    return this._players;
  }

  // 起家
  get firstDealer(): Player {
    return this._firstDealer;
  }

  get currentRound(): GameRound {
    return new List(this._rounds).Last();
  }

  get currentRoundHand(): GameRoundHand {
    return new List(this.currentRound.hands).Last();
  }

  get roundCount(): number {
    return this._rounds.length;
  }

  endRoundHand = (roundHand: GameRoundHand): void => {
    logger.debug("gameRoundHand end");
  };

  startRoundHand = (roundHand: GameRoundHand): void => {
    logger.debug("gameRoundHand start");

    roundHand.table.buildWalls(); // 牌の山を積む

    this.rollDices(); // サイコロを振る

    // todo サイコロを振っているが王牌と無関係
    roundHand.table.makeDeadWall();

    roundHand.players.forEach((player) => player.init());
    roundHand.dealStartTilesToPlayers(); // 配牌
    roundHand.players.forEach((player) => player.sortHandTiles()); // 牌を整列

    LogEvent(this.status());
  };

  nextRoundHand = async (): Promise<GameRoundHand> => {
    if (this.isLastRoundHand()) {
      return null;
    }

    await anyKeyAsk("次の局に進みます...");

    this.createGameRoundHand(this.nextRoundHandPlayers());
    this.startRoundHand(this.currentRoundHand);

    return this.currentRoundHand;
  };

  nextRoundHandPlayers(): Player[] {
    const num = this.currentRound.hands.length % 4;
    const players = [...Array(this.players.length)].map((i) => this.players[(num + i) % 4]);
    return players;
  }

  isLastRoundHand(): boolean {
    return this._rounds.length == 2 && this.currentRound.hands.length == 4;
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

  pickUpPlayerAtRandom(): Player {
    return new List(this._players).OrderBy(() => Math.random()).First();
  }

  rollDices(): number {
    this._dices.forEach((dice) => dice.roll());

    logger.debug(`サイコロを振りました: ${this._dices[0].toEmoji()} ${this._dices[1].toEmoji()} `);

    return this._dices.reduce((sum: number, dice: Dice) => (sum += dice.num), 0);
  }

  // 起家決め
  decideFirstDealer(): void {
    logger.debug("decideFirstDealer");

    const randomNumber = (): number => this.rollDices() % this.players.length;

    logger.debug(`仮親：${this.players[randomNumber()]}`);

    const firstDealerNumber = randomNumber();
    logger.debug(`親：${this.players[firstDealerNumber]}`);

    this._players = this._players.splice(firstDealerNumber).concat(this._players);
  }

  createGameRound(): void {
    this._rounds.push(new GameRound());
  }

  createGameRoundHand(players: Player[]): void {
    this.currentRound.hands.push(new GameRoundHand(players));
  }

  status(option: { round: boolean; player: boolean; dora: boolean } | null = null): string {
    const label: string[] = [];

    option ??= { round: true, player: true, dora: true };

    if (option.round) {
      label.push(this.currentRoundHand.name(this));
    }

    if (option.dora) {
      const doras = this.currentRoundHand.table.deadWall.doras;
      label.push(`ドラ:${doras.map((dora) => toMoji(dora)).join(" ")}`);
    }

    if (label.length > 0) {
      label.push("|");
    }

    if (option.player) {
      const playerLabelList: string[] = [];
      new List(WindsLabel).Zip(new List(this.players), (wind, player) => {
        playerLabelList.push(`${wind}家: ${player.name}`);
      });

      label.push(playerLabelList.join(" "));
    }

    return label.join(" ");
  }

  // 半荘開始
  start(): void {
    logger.info("半荘開始");

    if (!this.validateForStart()) {
      return;
    }

    // 起家決め
    this.decideFirstDealer();

    // 東場生成
    this.createGameRound();

    // 局生成
    this.createGameRoundHand(this.players);
  }

  // 半荘終了
  end(): void {
    logger.info("半荘終了");
  }

  setPlayers(players: Array<Player>): void {
    if (this._players.length > 4) {
      throw new Error("プレイヤーは4人");
    }

    players.forEach((player) => {
      this._players.push(player);

      logger.debug(`${player.name}が参加しました`);
    });
  }
}

export class CheatGame extends Game {
  constructor(players: Player[]) {
    logger.debug("cheatGame create");

    super(players);
  }

  start(): void {
    logger.debug("cheatGame start");

    // do nothing
  }
}
