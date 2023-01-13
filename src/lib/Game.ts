/* eslint-disable no-constant-condition */
import { List } from "linqts";
import { logger, LogEvent } from "../logging";
import { readCommand } from "../readline";
import { isRangeNumber } from "./Functions";
import { WindsLabel, PlayerCommandType } from "./Constants";
import { 牌 } from "./Types";
import { toMoji } from "./Functions";
import { Player } from "./Player";
import { Tile } from "./Tile";
import { Dice } from "./Dice";
import { GameRound } from "./GameRound";
import { GameRoundHand } from "./GameRoundHand";
import { KaKanCommand, TsumoCommand, RonCommand, DiscardCommand } from "./Command";
import { anyKeyAsk, askPlayer, askOtherPlayers } from "./AskPlayer";
import { BaseCommand, PlayerCommand } from "./Command";

export class Game {
  private _dices: [Dice, Dice] = [new Dice(), new Dice()];
  private _players: Array<Player> = [];
  private _dealer: Player;
  private _rounds: GameRound[] = [];

  constructor(players: Player[]) {
    logger.debug(`game create`);

    this.setPlayers(players);
  }

  get players(): Array<Player> {
    return this._players;
  }

  get dealer(): Player {
    return this._dealer;
  }

  get restTilesCount(): number {
    return this.currentRoundHand.table.restTilesCount;
  }

  get currentRound(): GameRound {
    return new List(this._rounds).Last();
  }

  get currentRoundHand(): GameRoundHand {
    return new List(this.currentRound.hands).Last();
  }

  nextRoundHand = async () => {
    await anyKeyAsk("次の局に進みます...");

    this.createGameRoundHand(this.nextRoundHandPlayers());
    this.startRoundHand();
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

  rollDices(): number {
    const dice = this._dices[0];
    const dice2 = this._dices[1];

    dice.roll();
    dice2.roll();

    logger.debug(`サイコロを振りました: ${dice.toEmoji()} ${dice2.toEmoji()} `);

    return dice.num + dice2.num;
  }

  pickUpPlayerAtRandom(): Player {
    return new List(this._players).OrderBy(() => Math.random()).First();
  }

  buildWalls(): void {
    logger.debug("game buidwalls");

    this.currentRoundHand.table.buildWalls();
  }

  // 起家決め
  pickUpDealer(): void {
    logger.debug("picupDealer");

    this._dealer = this.pickUpPlayerAtRandom();
    logger.debug(`仮親：${this.dealer.name}`);

    this._dealer = this.pickUpPlayerAtRandom();
    logger.debug(`親：${this.dealer.name}`);
  }

  createGameRound(): void {
    this._rounds.push(new GameRound());
  }

  createGameRoundHand(players: Player[]): void {
    this.currentRound.hands.push(new GameRoundHand(players));
  }

  roundHandName(): string {
    return `${WindsLabel[this._rounds.length - 1]}${this.currentRound.hands.length}局`;
  }

  status(option: { round: boolean; player: boolean; dora: boolean } | null = null): string {
    const label: string[] = [];

    option ??= { round: true, player: true, dora: true };

    if (option.round) {
      label.push(this.roundHandName());
    }

    if (option.dora) {
      const doras = this.currentRoundHand.table.deadWall.doras;
      label.push(`ドラ:${doras.map((dora) => toMoji(dora)).join(" ")}`);
    }

    if (option.player) {
      const playerLabelList: string[] = [];
      new List(WindsLabel).Zip(new List(this.players), (wind, player) => {
        playerLabelList.push(`${wind}家: ${player.name}`);
      });

      label.push(playerLabelList.join(", "));
    }

    return label.join(", ");
  }

  init(): void {
    logger.debug("game init");

    // 起家決め
    this.pickUpDealer();
  }

  // 半荘開始
  start(): void {
    logger.debug("game start");

    if (!this.validateForStart()) {
      return;
    }

    // 東場生成
    this.createGameRound();

    // 局生成
    this.createGameRoundHand(this.players);

    logger.info("半荘開始");
  }

  // 半荘終了
  end(): void {
    logger.info("半荘終了");
  }

  startRoundHand(): void {
    logger.debug("gameRoundHand start");

    this.buildWalls(); // 牌の山を積む

    this.rollDices(); // サイコロを振る

    // todo サイコロを振っているが王牌と無関係
    this.currentRoundHand.table.makeDeadWall();

    this.players.map((player) => player.init());
    this.dealStartTilesToPlayers(this.players); // 配牌
    this.players.forEach((player) => player.sortHandTiles()); // 牌を整列
  }

  endRoundHand(): void {
    LogEvent(`${this.roundHandName()} 終了`);
  }

  //牌を配る
  dealTiles(num: number): Array<牌> {
    const tiles: Array<牌> = [];

    for (let i = 0; i < num; i++) {
      tiles.push(this.dealTile());
    }

    return tiles;
  }

  dealTile(): 牌 {
    const tile = this.currentRoundHand.table.drawTile();
    return tile;
  }

  dealStartTilesToPlayers(players: Player[]): void {
    logger.debug("game dealStartTilesToPlayers");

    // 各プレイヤー4枚ずつ3回牌をつもる
    [...Array(3)].forEach(() => {
      players.forEach((player) => player.drawTiles(this.dealTiles(4)));
    });

    // 各プレイヤー1枚牌をつもる
    players.forEach((player) => player.drawTiles(this.dealTiles(1)));
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

    logger.debug(`${player.name}が参加しました`);
  }

  async doKanProcess(player: Player, playerCommand: PlayerCommand): Promise<BaseCommand> {
    if (playerCommand instanceof KaKanCommand) {
      // 槍槓できる場合
      return await askOtherPlayers(this.currentRoundHand.players, (playerCommand as KaKanCommand).tile, player);
    }

    this.currentRoundHand.executeCommand(playerCommand);
    return null;
  }

  pickTile(): Tile {
    return new Tile(this.currentRoundHand.pickTile());
  }

  playerTurn = async (currentPlayer: Player): Promise<TurnResult> => {
    let playerCommand: PlayerCommand;
    let otherPlayersCommand: BaseCommand;

    while (true) {
      playerCommand = await askPlayer(currentPlayer);

      switch (playerCommand.type) {
        case PlayerCommandType.Kan:
          otherPlayersCommand = await this.doKanProcess(currentPlayer, playerCommand);

          if (otherPlayersCommand?.type === PlayerCommandType.Ron) {
            // 槍槓
            this.currentRoundHand.ronEnd(otherPlayersCommand as RonCommand);
            return new TurnResult(otherPlayersCommand, true);
          }
          continue;
        case PlayerCommandType.Tsumo:
          this.currentRoundHand.tsumoEnd(playerCommand as TsumoCommand);
          return new TurnResult(playerCommand, true);
      }

      this.currentRoundHand.executeCommand(playerCommand);
      break;
    }

    return new TurnResult(playerCommand, false);
  };

  otherPlayersTurn = async (playerCommand: PlayerCommand, currentPlayer: Player): Promise<TurnResult> => {
    while (true) {
      const otherPlayersCommand = await askOtherPlayers(this.currentRoundHand.players, (playerCommand as DiscardCommand).tile, currentPlayer);

      // 鳴きの中では、ロンが最優先で処理される
      if (otherPlayersCommand.type === PlayerCommandType.Ron) {
        this.currentRoundHand.ronEnd(otherPlayersCommand as RonCommand);
        return new TurnResult(otherPlayersCommand, true);
      }

      this.currentRoundHand.executeCommand(otherPlayersCommand);

      switch (otherPlayersCommand.type) {
        case PlayerCommandType.Chi:
        case PlayerCommandType.Pon:
        case PlayerCommandType.Kan:
          // 鳴いた人の手番にする
          currentPlayer = this.currentRoundHand.setCurrentPlayer(otherPlayersCommand.who);

          // eslint-disable-next-line no-case-declarations
          const discardTileNumber = await readCommand(
            `${currentPlayer.name}の手牌：${currentPlayer.hand.status} 捨牌：${currentPlayer.discardStatus}\n` +
              `${currentPlayer.name} 捨て牌選択[0-${currentPlayer.hand.tiles.length - 1}] > `,
            (input: string) => isRangeNumber(input, currentPlayer.hand.tiles.length - 1)
          );

          playerCommand = new DiscardCommand(currentPlayer, currentPlayer.hand.tiles[Number(discardTileNumber)]);
          this.currentRoundHand.executeCommand(playerCommand);
          continue;
      }

      break;
    }

    return new TurnResult(null, false);
  };

  roundHandLoop = async (currentPlayer: Player) => {
    // 親の第1ツモ
    currentPlayer.drawTile(this.pickTile());

    let turnResult: TurnResult;

    // 局のループ
    while (true) {
      // 牌をツモったプレイヤーのターン
      turnResult = await this.playerTurn(currentPlayer);
      if (turnResult.roundHandEnd) {
        // todo
        return;
      }

      // 牌をツモったプレイヤー以外のプレイヤーのターン(プレイヤーが捨てた牌へのアクション)
      turnResult = await this.otherPlayersTurn(turnResult.command, currentPlayer);
      if (turnResult.roundHandEnd) {
        // todo
        return;
      }

      if (!this.currentRoundHand.hasRestTiles()) {
        this.currentRoundHand.drawEnd();
        return;
      }

      currentPlayer = this.currentRoundHand.nextPlayer;
      currentPlayer.drawTile(this.pickTile());
    }
  };
}

export class CheatGame extends Game {
  constructor(players: Player[]) {
    logger.debug("cheatGame create");

    super(players);
  }

  start(): void {
    // do nothing
    logger.debug("cheatGame start");
  }

  startRoundHand(): void {
    // do nothing
    logger.debug("cheatGame startRoundHand");
  }
}

class TurnResult {
  constructor(public command: BaseCommand, public roundHandEnd: boolean) {}
}
