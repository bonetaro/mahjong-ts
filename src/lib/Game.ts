import { List } from "linqts";
import { logger, LogEvent } from "../logging";
import { readCommand } from "../readline";
import { WindsLabel, PlayerCommandType } from "./Constants";
import { 牌 } from "./Types";
import { toMoji } from "./Functions";
import { Player } from "./Player";
import { Dice } from "./Dice";
import { GameRound } from "./GameRound";
import { GameRoundHand } from "./GameRoundHand";
import {
  PlayerCommand,
  OtherPlayersCommand,
  AnKanCommand,
  KaKanCommand,
  TsumoCommand,
  RonCommand,
  DiscardCommand,
} from "./Command";
import { anyKeyAsk, askPlayer, askOtherPlayers } from "./AskPlayer";

export class Game {
  private _dices: [Dice, Dice] = [new Dice(), new Dice()];
  private _players: Array<Player> = [];
  private _dealer: Player;
  private _rounds: GameRound[] = [];
  private _playerIndex: number = 0;

  constructor(players: Player[]) {
    this.setPlayers(players);

    logger.debug(`半荘が作成されました`);
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

  get currentPlayer(): Player {
    return this._players[this._playerIndex];
  }

  get otherPlayers(): Player[] {
    return new List(this.players)
      .Where((_, index) => index != this._playerIndex)
      .ToArray();
  }

  get nextPlayer(): Player {
    this.incrementPlayerIndex();
    return this.currentPlayer;
  }

  nextRoundHand = async () => {
    await anyKeyAsk("次の局に進みます...");

    this.createGameRoundHand();
    this.startHand();
  };

  isLastRoundHand(): boolean {
    return this._rounds.length == 2 && this.currentRound.hands.length == 4;
  }

  incrementPlayerIndex(): void {
    let index = this._playerIndex;
    this._playerIndex = index + 1 > 3 ? 0 : index + 1;
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
    this.currentRoundHand.table.washTiles();
    this.currentRoundHand.table.buildWalls();
  }

  // 起家決め
  pickUpDealer(): void {
    this._dealer = this.pickUpPlayerAtRandom();
    logger.debug(`仮親：${this.dealer.name}`);

    this._dealer = this.pickUpPlayerAtRandom();
    logger.debug(`親：${this.dealer.name}`);
  }

  createGameRound(): void {
    this._rounds.push(new GameRound());
  }

  createGameRoundHand(): void {
    this.currentRound.hands.push(new GameRoundHand());
  }

  roundHandName(): string {
    return `${WindsLabel[this._rounds.length - 1]}${
      this.currentRound.hands.length
    }局`;
  }

  status(
    option: { round: boolean; player: boolean; dora: boolean } | null = null
  ): string {
    const label: string[] = [];

    option ??= { round: true, player: true, dora: true };

    if (option.round) {
      label.push(this.roundHandName());
    }

    if (option.dora) {
      const dora = this.currentRoundHand.table.deadWall.dora;
      label.push(`ドラ:${toMoji(dora)}`);
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

  // 半荘開始
  start(): GameRoundHand {
    logger.info("半荘開始");

    if (!this.validateForStart()) {
      return;
    }

    // 起家決め
    this.pickUpDealer();

    // 東場生成
    this.createGameRound();

    // 東場第1局
    this.startHand();
  }

  // 半荘終了
  end(): void {
    logger.info("半荘終了");
  }

  startHand(): void {
    this.players.map((player) => player.init());

    this.buildWalls(); // 牌の山を積む

    this.rollDices(); // サイコロを振る

    // todo サイコロを振っているが王牌と無関係
    this.currentRoundHand.table.makeDeadWall();

    LogEvent(this.status());

    this.dealTilesToPlayers(); // 配牌
  }

  endRoundHand(): void {
    LogEvent(`${this.roundHandName()} 終了`);
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
    const tile = this.currentRoundHand.table.pickTile();
    return tile;
  }

  dealTilesToPlayers(): void {
    // 各プレイヤー4枚ずつ3回牌をつもる
    for (let i = 0; i < 3; i++) {
      this._players.forEach((player) => player.drawTiles(this.dealTiles(4)));
    }

    // 各プレイヤー1枚牌をつもる
    this.players.forEach((player) => player.drawTiles(this.dealTiles(1)));

    // 牌を整列
    this.players.forEach((player) => player.sortHandTiles());
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

  roundHandLoop = async () => {
    const roundHand = this.currentRoundHand;

    let player = this.currentPlayer;

    // 親の第1ツモ
    player.drawTile(roundHand.pickTile());

    let playerCommand: PlayerCommand;
    let otherPlayersCommand: OtherPlayersCommand;

    while (true) {
      // 牌をツモったプレイヤーのターン
      while (true) {
        playerCommand = await askPlayer(player);

        switch (playerCommand.type) {
          case PlayerCommandType.Kan:
            if (playerCommand instanceof AnKanCommand) {
            }

            if (playerCommand instanceof KaKanCommand) {
              // todo 槍槓できる場合
              otherPlayersCommand = await askOtherPlayers(
                this.otherPlayers,
                (playerCommand as KaKanCommand).tile,
                player
              );

              if (otherPlayersCommand.type === PlayerCommandType.Ron) {
                roundHand.ronEnd(otherPlayersCommand as RonCommand);
                return;
              }
            }

            // player.drawTile() // 王牌からのツモ
            continue;
          case PlayerCommandType.Tsumo:
            roundHand.tsumoEnd(playerCommand as TsumoCommand);
            return;
        }

        // 牌をすてた(DiscardCommand)
        break;
      }

      // 牌をツモったプレイヤー以外のプレイヤーのターン
      while (true) {
        otherPlayersCommand = await askOtherPlayers(
          this.otherPlayers,
          (playerCommand as DiscardCommand).tile,
          player
        );

        switch (otherPlayersCommand.type) {
          case PlayerCommandType.Chi:
          case PlayerCommandType.Pon:
          case PlayerCommandType.Kan:
            player = otherPlayersCommand.who;

            let num = await readCommand(
              `${player.name} 捨て牌選択[0-${player.hand.tiles.length}]`
            );

            continue;
        }

        break;
      }

      if (otherPlayersCommand.type === PlayerCommandType.Ron) {
        roundHand.ronEnd(otherPlayersCommand as RonCommand);
        return;
      }

      if (!roundHand.hasRestTiles()) {
        roundHand.drawEnd();
        return;
      }

      player = this.nextPlayer;
      player.drawTile(roundHand.pickTile());
    }
  };
}
