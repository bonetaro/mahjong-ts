/* eslint-disable no-constant-condition */
import { List } from "linqts";
import { Dice, GameOption, GameRound, GameRoundHand, Player, GameRoundHandPlayer, GameTable, Tile } from ".";
import { CheatTableBuilder, askAnyKey, logger } from "../lib";
import { FourMembers } from "../types";
import { WindNameList } from "../constants";

export class Game {
  private _dices = [new Dice(), new Dice()];
  private _rounds: GameRound[] = [];
  private _firstDealer: Player;

  constructor(public readonly gameOption: GameOption) {
    logger.debug(`game create`);
  }

  get players(): FourMembers<Player> {
    return this.gameOption.players;
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

  rollDices(): number {
    this._dices.forEach((dice) => dice.roll());

    logger.debug(`サイコロを振りました: ${this._dices[0].toEmoji()} ${this._dices[1].toEmoji()} `);

    return this._dices.reduce((sum: number, dice: Dice) => (sum += dice.num), 0);
  }

  // 起家決め
  decideFirstDealer(): void {
    logger.debug("decideFirstDealer");

    const randomNumber = (): number => this.rollDices() % this.players.length;
    logger.debug(`仮親：${this.players[randomNumber()].name}`);

    const firstDealerNumber = randomNumber();
    logger.debug(`起家：${this.players[firstDealerNumber].name}`);

    let players = [...this.players];
    players = players.splice(firstDealerNumber, 1).concat(players);

    this.players.forEach((_, index) => (this.players[index] = players[index]));
  }

  roundHandLoop = async (): Promise<void> => {
    await this.currentRoundHand.mainLoop();
  };

  startRoundHand = (): void => {
    logger.debug("startRoundHand");
    logger.info(`${WindNameList[this._rounds.length - 1]}${this.currentRound.hands.length}局`);

    // プレイヤーの状態をリセット
    this.currentRoundHand.members.players.forEach((player) => player.init());

    // 牌の山を積む
    this.currentRoundHand.table.buildWalls();

    // サイコロを振る
    this.rollDices();

    // todo サイコロを振っているが王牌と無関係
    this.currentRoundHand.table.makeKingsWall();

    // 配牌
    this.currentRoundHand.dealStartingTilesToPlayers();

    // 牌を整列
    this.currentRoundHand.members.players.forEach((player) => player.sortHandTiles());
  };

  nextRoundHand = async (): Promise<boolean> => {
    if (this.isLastRoundHand()) {
      return false;
    }

    await askAnyKey("次の局に進みます...");

    this.createRoundHand();

    return true;
  };

  createRoundHand() {
    if (this.roundCount == 0 || this.currentRound.hands.length % 4 == 0) {
      this.createRound();
    }

    const players = this.createRoundHandPlayers(this.currentRound.hands.length + 1);
    this.currentRound.hands.push(new GameRoundHand(players, this.createGameTable()));
  }

  isLastRoundHand(): boolean {
    // 南4局で終わり
    return this._rounds.length == 2 && this.currentRound.hands.length == 4;
  }

  createGameTable(): GameTable {
    if (this.gameOption.cheatOption) {
      const builder = new CheatTableBuilder();

      this.gameOption.cheatOption.playerDrawTilesList.forEach((playerDealedTiles, index) => {
        builder.setPlayerDrawTiles(playerDealedTiles, index);
      });

      return new GameTable(builder.build().washedTiles);
    } else {
      return new GameTable();
    }
  }

  createRound(): void {
    this._rounds.push(new GameRound());
  }

  createRoundHandPlayers(roundHandNumber: number): FourMembers<GameRoundHandPlayer> {
    const players = this.players.map((_, index) => new GameRoundHandPlayer(this.players[(index + roundHandNumber - 1) % this.players.length], index));
    return players as FourMembers<GameRoundHandPlayer>;
  }

  status(option: { round: boolean; player: boolean; dora: boolean }): string {
    const label: string[] = [];

    option ??= { round: true, player: true, dora: true };

    if (option.round) {
      label.push(this.currentRoundHand.name(this));
    }

    if (option.dora) {
      const doras = this.currentRoundHand.table.kingsWall.doras;
      label.push(`ドラ:${doras.map((dora) => Tile.toEmojiMoji(dora)).join(" ")}`);
    }

    if (label.length > 0) {
      label.push("|");
    }

    if (option.player) {
      const playerLabelList: string[] = [];
      new List(WindNameList.concat()).Zip(new List(this.players), (wind, player) => {
        playerLabelList.push(`${wind}家: ${player.name}`);
      });

      label.push(playerLabelList.join(" "));
    }

    return label.join(" ");
  }

  // 半荘開始
  init(): void {
    logger.info("半荘開始");

    // 起家決め
    this.decideFirstDealer();

    // 東1局生成
    this.createRoundHand();
  }

  // 半荘終了
  end(): void {
    logger.info("半荘終了");
  }
}
