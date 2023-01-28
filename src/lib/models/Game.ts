/* eslint-disable no-constant-condition */
import { List } from "linqts";
import { CheatGameRoundHand, Dice, GameOption, GameRound, GameRoundHand, Player, Table } from "./";
import { CheatTableBuilder, FourMembers, PlayerIndex, WindNames, askAnyKey, logger, toEmojiMoji } from "..";
import { RoundHandPlayer } from "./RoundHandPlayer";

export class Game {
  private _dices = [new Dice(), new Dice()];
  private _rounds: GameRound[] = [];
  private _firstDealer: Player;
  protected _players: FourMembers<Player>;

  constructor(public readonly gameOption: GameOption) {
    logger.debug(`game create`);

    this.players = gameOption.players;
  }

  get players(): FourMembers<Player> {
    return this._players;
  }

  set players(players: FourMembers<Player>) {
    this._players = players;
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

  startRoundHand = (): void => {
    logger.debug("gameRoundHand start");

    // プレイヤーの状態をリセット
    this.currentRoundHand.players.forEach((player) => player.init());

    // 牌の山を積む
    this.currentRoundHand.table.buildWalls();

    // サイコロを振る
    this.rollDices();

    // todo サイコロを振っているが王牌と無関係
    this.currentRoundHand.table.makeKingsWall();

    // 配牌
    this.currentRoundHand.dealStartingTilesToPlayers();

    // 牌を整列
    this.currentRoundHand.players.forEach((player) => player.sortHandTiles());
  };

  roundHandLoop = async (): Promise<void> => {
    await this.currentRoundHand.mainLoop();
  };

  nextRoundHand = async (): Promise<boolean> => {
    if (this.isLastRoundHand()) {
      return false;
    }

    await askAnyKey("次の局に進みます...");

    if (this.currentRound.hands.length == 4) {
      this.createRound();
    }

    this.createRoundHand(
      this.currentRoundHand.players.map((player) => {
        player.index = (player.index + 1) % 4;
        return player;
      }) as FourMembers<RoundHandPlayer>
    );

    return true;
  };

  isLastRoundHand(): boolean {
    // 南4局で終わり
    return this._rounds.length == 2 && this.currentRound.hands.length == 4;
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

    this.players = this.players.splice(firstDealerNumber, 1).concat(this.players) as FourMembers<Player>;
  }

  createRound(): void {
    this._rounds.push(new GameRound());
  }

  createRoundHand(players: FourMembers<RoundHandPlayer>): void {
    this.currentRound.hands.push(new GameRoundHand(players));
  }

  status(option: { round: boolean; player: boolean; dora: boolean } | null = null): string {
    const label: string[] = [];

    option ??= { round: true, player: true, dora: true };

    if (option.round) {
      label.push(this.currentRoundHand.name(this));
    }

    if (option.dora) {
      const doras = this.currentRoundHand.table.kingsWall.doras;
      label.push(`ドラ:${doras.map((dora) => toEmojiMoji(dora)).join(" ")}`);
    }

    if (label.length > 0) {
      label.push("|");
    }

    if (option.player) {
      const playerLabelList: string[] = [];
      new List(WindNames.concat()).Zip(new List(this.players), (wind, player) => {
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

    // 東場生成
    this.createRound();

    // 東1局作成
    const players = this.players.map((player, index) => new RoundHandPlayer(index, player)) as FourMembers<RoundHandPlayer>;
    this.createRoundHand(players);
  }

  // 半荘終了
  end(): void {
    logger.info("半荘終了");
  }
}

export class CheatGame extends Game {
  constructor(gameOption: GameOption) {
    logger.debug("cheatGame create");

    super(gameOption);
  }

  createRoundHand(players: FourMembers<Player>): void {
    const builder = new CheatTableBuilder();
    this.gameOption.cheatOption?.playerDrawTilesList.forEach((playerDealedTiles, index) => {
      builder.setPlayerDrawTiles(playerDealedTiles, index as PlayerIndex);
    });

    const roundHand = new CheatGameRoundHand(players.map((player, index) => new RoundHandPlayer(index, player)) as FourMembers<RoundHandPlayer>);
    roundHand.table = new Table(builder.build().washedTiles);

    this.currentRound.hands.push(roundHand);
  }
}
