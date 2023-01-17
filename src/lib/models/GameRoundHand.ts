/* eslint-disable no-constant-condition */
/* eslint-disable no-case-declarations */
import {
  CommandCreator,
  CommandType,
  FourMembers,
  LogEvent,
  WindsLabel,
  askOtherPlayers as askOtherPlayersWhatCommand,
  askPlayer as askPlayerWhatCommand,
  logger,
  readChoices,
  toMoji,
  牌,
} from "../";
import { Game, Player, RoundHandPlayer, Table, Tile } from "./";
import * as Command from "./Command";

// 局
export class GameRoundHand {
  protected _table: Table = new Table();
  protected _players: FourMembers<RoundHandPlayer>;
  private _playerIndex = 0;
  private _isDraw = false; // 流局

  constructor(players: FourMembers<Player>) {
    logger.debug("gameRoundHand create");

    this._players = players.map((player, index) => new RoundHandPlayer(player, index)) as FourMembers<RoundHandPlayer>;
  }

  get isDraw(): boolean {
    return this._isDraw;
  }

  get table(): Table {
    return this._table;
  }

  get players(): FourMembers<RoundHandPlayer> {
    return this._players;
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

  askOtherPlayersChankanIfPossible = (command: Command.PlayerCommand): Command.ChankanRonCommand => {
    // todo
    return null;
  };

  // 牌をツモったプレイヤーのターン
  playerTurn = async (currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    while (true) {
      const command = await askPlayerWhatCommand(currentPlayer);
      switch (command.type) {
        case CommandType.Kan:
          // todo
          // 槍槓の場合は、カン自体は成立しないらしいので、このタイミングで実行
          const chankanCommand = this.askOtherPlayersChankanIfPossible(command);
          if (chankanCommand) {
            return this.ronEnd(chankanCommand);
          }

          // 暗槓 or 加槓
          this.executeCommand(command);

          // カンした場合は、もう一度捨て牌選択
          continue;
        case CommandType.Tsumo:
          return this.tsumoEnd(command as Command.TsumoCommand);
        default:
          this.executeCommand(command);
          return new TurnResult(command, false);
      }
    }
  };

  // 牌をツモって捨てたプレイヤーの捨てた牌に対するアクション
  // その牌を鳴いて捨てた牌をさらに鳴くアクションも含まれる
  otherPlayersTurn = async (discardTile: 牌, currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const command = await askOtherPlayersWhatCommand(this.players, discardTile, currentPlayer);

      // 鳴きよりもロンが最優先で処理される
      if (command.type === CommandType.Ron) {
        return this.ronEnd(command as Command.RonCommand);
      }

      if (command.isMeldCommand()) {
        // 鳴いた人に手番を変更する
        currentPlayer = this.setCurrentPlayer(command.who);
        // ポン、チー、カンを実行
        this.executeCommand(command);

        // 鳴いた後に牌を捨てる
        const commandText = new CommandCreator().createPlayerCommandText([CommandType.Discard], currentPlayer);
        const discardTileNumber = await readChoices(commandText, currentPlayer.hand, [CommandType.Discard]);
        const discardCommand = new Command.DiscardCommand(currentPlayer, currentPlayer.hand.tiles[Number(discardTileNumber)]);
        this.executeCommand(discardCommand);

        // 捨てた牌に対し、ほかのプレイヤーのアクションをさせるために、whileループを繰り返す
        discardTile = discardCommand.tile;
        continue;
      }

      return new TurnResult(new Command.NothingCommand(), false);
    }
  };

  turn = async (currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    // 牌を山からツモる
    currentPlayer.drawTile(this.pickTile());

    // 牌をツモったプレイヤーのターン
    const turnResult = await this.playerTurn(currentPlayer);
    if (turnResult.roundHandEnd) {
      return turnResult;
    }

    // 牌をツモったプレイヤー以外のプレイヤーのターン(プレイヤーが捨てた牌へのアクション)
    // 鳴いた後に捨てた牌をさらに鳴く処理も含まれる
    return await this.otherPlayersTurn((turnResult.command as Command.DiscardCommand).tile, currentPlayer);
  };

  pickTile(): Tile {
    return new Tile(this.table.pickTile());
  }

  pickKingsTile(): Tile {
    // 山の最終牌を王牌に足して、嶺上牌をツモる
    const lastTile = this._table.popTile();
    const tile = this._table.kingsWall.pickTile(lastTile);

    return new Tile(tile, true);
  }

  mainLoop = async () => {
    let currentPlayer = this.currentPlayer;

    // 局のループ
    do {
      const turnResult = await this.turn(currentPlayer);
      if (turnResult.roundHandEnd) {
        return;
      }

      if (!this.hasRestTiles()) {
        this.drawEnd(); // 流局
        return;
      }

      currentPlayer = this.nextPlayer;
    } while (true);
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

  executeCommand(command: Command.BaseCommand): void {
    switch (command.type) {
      case CommandType.Kan:
        if (command instanceof Command.AnKanCommand) {
          (command as Command.AnKanCommand).execute();
          command.who.drawTile(this.pickKingsTile());
          break;
        }

        if (command instanceof Command.DaiMinKanCommand) {
          // todo
        }

        if (command instanceof Command.KaKanCommand) {
          // todo
        }
        break;
      case CommandType.Pon:
        command.execute(this);

        break;
      case CommandType.Discard:
        command.execute(this);
        break;
    }
  }

  hasRestTiles(): boolean {
    logger.info(`残りの山の牌：${this.table.restTilesCount}枚`);

    return this.table.restTilesCount > 0;
  }

  tsumoEnd(command: Command.TsumoCommand): TurnResult {
    logger.info(`${command.who.name} ツモ和了`);
    logger.info(command.who.hand.status);

    return new TurnResult(command, true);
  }

  ronEnd(command: Command.RonCommand): TurnResult {
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

  // イカサマ牌を設定するためsetterを用意
  set table(table: Table) {
    this._table = table;
  }
}

class TurnResult {
  constructor(public command: Command.BaseCommand, public roundHandEnd: boolean) {}
}
