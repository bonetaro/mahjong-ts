/ eslint-disable no-case-declarations */;
import { LogEvent, logger } from "../logging";
import { 牌 } from "../Types";
import { Tile } from "./Tile";
import { Table } from "./Table";
import { toMoji } from "../Functions";
import { AnKanCommand, BaseCommand, RonCommand, TsumoCommand, DaiMinKanCommand, KaKanCommand, PlayerCommand, DiscardCommand } from "./Command";
import { PlayerCommandType, WindsLabel } from "../Constants";
import { Player, RoundHandPlayer } from "./Player";
import { askOtherPlayers, askPlayer } from "../AskPlayer";
import { Game } from "./Game";
import { CommandCreator } from "../CommandCreator";
import { readChoices } from "../readline";

// 局
export class GameRoundHand {
  protected _table: Table = new Table();
  protected _players: RoundHandPlayer[];
  private _playerIndex = 0;
  private _isDraw: boolean = false; // 流局

  constructor(players: Player[]) {
    logger.debug("gameRoundHand create");

    this._players = players.map((player, index) => new RoundHandPlayer(player, index));
  }

  get table(): Table {
    return this._table;
  }

  get players(): RoundHandPlayer[] {
    return this._players;
  }

  get otherPlayers(): RoundHandPlayer[] {
    return this._players.filter((_, index) => index != this._playerIndex);
  }

  get currentPlayer(): RoundHandPlayer {
    return this._players[this._playerIndex];
  }

  get nextPlayer(): RoundHandPlayer {
    const index = this._playerIndex;
    this.setPlayerIndex(index + 1);

    logger.info(`${this.currentPlayer.fullName}の手番です`);

    return this.currentPlayer;
  }

  name(game: Game): string {
    return `${WindsLabel[game.roundCount - 1]}${game.currentRound.hands.length}局`;
  }

  dealTiles(num: number): Array<牌> {
    const tiles = [...Array(num)].map(() => this.table.pickTile());
    return tiles;
  }

  dealStartTilesToPlayers(): void {
    logger.debug("game dealStartTilesToPlayers");

    // 各プレイヤー4枚ずつ3回牌をつもる
    [...Array(3)].forEach(() => {
      this.players.forEach((player) => player.drawTiles(this.dealTiles(4)));
    });

    // 各プレイヤー1枚牌をつもる
    this.players.forEach((player) => player.drawTiles(this.dealTiles(1)));
  }

  async doKanProcess(player: RoundHandPlayer, playerCommand: PlayerCommand): Promise<BaseCommand> {
    if (playerCommand instanceof KaKanCommand) {
      // 槍槓できる場合
      return await askOtherPlayers(this.players, (playerCommand as KaKanCommand).tile, player);
    }

    this.executeCommand(playerCommand);
    return playerCommand;
  }

  playerTurn = async (currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    let playerCommand: PlayerCommand;
    let otherPlayersCommand: BaseCommand;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      playerCommand = await askPlayer(currentPlayer);

      switch (playerCommand.type) {
        case PlayerCommandType.Kan:
          otherPlayersCommand = await this.doKanProcess(currentPlayer, playerCommand);

          if (otherPlayersCommand?.type === PlayerCommandType.Ron) {
            // 槍槓
            return this.ronEnd(otherPlayersCommand as RonCommand);
          }
          continue;
        case PlayerCommandType.Tsumo:
          return this.tsumoEnd(playerCommand as TsumoCommand);
      }

      this.executeCommand(playerCommand);
      break;
    }

    return new TurnResult(playerCommand, false);
  };

  otherPlayersAction = async (playerCommand: PlayerCommand, currentPlayer: RoundHandPlayer): Promise<BaseCommand> => {
    const otherPlayersCommand = await askOtherPlayers(this.players, (playerCommand as DiscardCommand).tile, currentPlayer);
    this.executeCommand(otherPlayersCommand);

    return otherPlayersCommand;
  };

  otherPlayersTurn = async (playerCommand: PlayerCommand, currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const otherPlayersCommand = await this.otherPlayersAction(playerCommand, currentPlayer);

      // 鳴きの中では、ロンが最優先で処理される
      if (otherPlayersCommand.type === PlayerCommandType.Ron) {
        return this.ronEnd(otherPlayersCommand as RonCommand);
      }

      switch (otherPlayersCommand.type) {
        case PlayerCommandType.Chi:
        case PlayerCommandType.Pon:
        case PlayerCommandType.Kan:
          // 鳴いた人に手番を変更する
          currentPlayer = this.setCurrentPlayer(otherPlayersCommand.who);

          const commandTypeList = [PlayerCommandType.Discard];
          const commandText = new CommandCreator().createPlayerCommandText(commandTypeList, currentPlayer.hand, currentPlayer);
          const discardTileNumber = await readChoices(commandText, currentPlayer.hand, commandTypeList);

          playerCommand = new DiscardCommand(currentPlayer, currentPlayer.hand.tiles[Number(discardTileNumber)]);
          this.executeCommand(playerCommand);

          // 鳴いた場合は、捨てた牌へのアクションをさせるために、whileループを繰り返す
          continue;
      }

      break;
    }

    return new TurnResult(null, false);
  };

  mainLoop = async () => {
    let currentPlayer = this.currentPlayer;

    // 親の第1ツモ
    currentPlayer.drawTile(new Tile(this.table.pickTile()));

    // 局のループ
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // 牌をツモったプレイヤーのターン
      let turnResult = await this.playerTurn(currentPlayer);
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

      if (!this.hasRestTiles()) {
        this.drawEnd(); // 流局
        return;
      }

      currentPlayer = this.nextPlayer;
      currentPlayer.drawTile(new Tile(this.table.pickTile()));
    }
  };

  nextPlayerOf(player: RoundHandPlayer): RoundHandPlayer {
    const index = this.players.findIndex((p) => p.id == player.id);
    this.setPlayerIndex(index + 1);
    return this.currentPlayer;
  }

  setCurrentPlayer(player: RoundHandPlayer): RoundHandPlayer {
    const index = this.players.findIndex((p) => p.id == player.id);
    if (index < 0) {
      throw new Error();
    }

    this.setPlayerIndex(index);
    return this.currentPlayer;
  }

  setPlayerIndex(index: number): void {
    this._playerIndex = index % this._players.length;
  }

  executeCommand(command: BaseCommand): void {
    switch (command.type) {
      case PlayerCommandType.Kan:
        if (command instanceof AnKanCommand) {
          (command as AnKanCommand).execute();

          // 王牌に1枚足して、嶺上牌をツモる
          const lastTile = this._table.popTile();
          const tile = this._table.deadWall.pickupTileByKan(lastTile);
          command.who.drawTile(new Tile(tile, true));
        }

        if (command instanceof DaiMinKanCommand) {
          // todo
        }

        if (command instanceof KaKanCommand) {
          // todo
        }
        break;
      case PlayerCommandType.Pon:
        command.execute(this);

        break;
      case PlayerCommandType.Discard:
        command.execute(this);
        break;
    }
  }

  hasRestTiles(): boolean {
    logger.info(`残りの山の牌：${this.table.restTilesCount}枚`);

    return this.table.restTilesCount > 0;
  }

  tsumoEnd(command: TsumoCommand): TurnResult {
    logger.info(`${command.who.name} ツモ和了`);
    logger.info(command.who.hand.status);

    return new TurnResult(command, true);
  }

  ronEnd(command: RonCommand): TurnResult {
    logger.info(`${command.who.name}が${command.whomPlayer(this).name}に${toMoji(command.tile)}で振り込みました`);
    logger.info(`${command.who.name}の手配 ${command.who.hand.status}`);

    return new TurnResult(command, true);
  }

  drawEnd(): void {
    this._isDraw = true;

    LogEvent("流局");
  }
}

export class CheatGameRoundHand extends GameRoundHand {
  get table() {
    return this._table;
  }

  set table(table: Table) {
    this._table = table;
  }
}

class TurnResult {
  constructor(public command: BaseCommand, public roundHandEnd: boolean) {}
}
