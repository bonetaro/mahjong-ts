/* eslsnt-disable no-constant-condition */
import { List } from "linqts";
import { Dice, GameOption, GameRound, GameRoundHand, Player, GameRoundHandPlayer, GameTable, Tile } from ".";
import { CheatTableBuilder, askAnyKey, logger } from "../lib";
import { FourMembers } from "../types";
import { WindNameList } from "../constants";

export class Game {
  private _dices = [new Dice(), new Dice()];
  private _rounds: GameRound[] = [];

  constructor(public readonly gameOption: GameOption) {
    logger.debug(`game create`);
  }

  get players(): FourMembers<Player> {
    return this.gameOption.players;
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

    logger.debug(`サイコロを振りました: ${this._dices.map((dice) => dice.toEmoji()).join(" ")}`);

    return this._dices.reduce((sum: number, dice: Dice) => (sum += dice.num), 0);
  }

  // 起家決め
  decideFirstDealer(): void {
    logger.debug("decideFirstDealer");

    let players = [...this.players];

    const randomNumber = (): number => this.rollDices() % this.players.length;

    // 仮親決めは、この実装だと意味がないが・・
    logger.debug(`仮親：${players[randomNumber()].name}`);

    const firstDealerNumber = randomNumber();
    players = players.splice(firstDealerNumber).concat(players);
    this.players.forEach((_, index) => (this.players[index] = players[index]));

    logger.debug(`起家：${this.players[0].name}`);
  }

  roundHandLoop = async (): Promise<void> => {
    await this.currentRoundHand.mainLoop();
  };

  startRoundHand = (): void => {
    logger.debug("startRoundHand");

    logger.info(this.currentRoundHand.name(this));

    // プレイヤーの状態を初期化
    this.currentRoundHand.players.forEach((player) => player.init());

    // テーブルに牌の山を積む
    this.currentRoundHand.table.buildWalls();

    // サイコロを振る
    this.rollDices();

    // 王牌作成
    // todo サイコロを振っているが王牌と無関係
    this.currentRoundHand.table.makeKingsWall();

    // 配牌
    this.currentRoundHand.dealStartingTilesToPlayers();

    // 牌を整列
    this.currentRoundHand.players.forEach((player) => player.sortHandTiles());
  };

  nextRoundHand = async (): Promise<boolean> => {
    if (this.isLastRoundHand()) {
      return false;
    }

    await askAnyKey("次の局に進みます...");

    // todo 連荘未実装
    this.createRoundHand();

    return true;
  };

  // 局生成
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
      const cheatTable = new CheatTableBuilder();

      this.gameOption.cheatOption.playerDrawTilesList.forEach((playerDealedTiles, index) => {
        cheatTable.setPlayerDrawTiles(playerDealedTiles, index);
      });

      return new GameTable(cheatTable.build().washedTiles);
    } else {
      return new GameTable();
    }
  }

  // 場生成
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
      label.push(`ドラ: ${doras.map((dora) => Tile.toEmojiMoji(dora)).join(" ")}`);
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
