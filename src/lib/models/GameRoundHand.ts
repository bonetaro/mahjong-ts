/* eslint-disable no-constant-condition */
/* eslint-disable no-case-declarations */
import * as Command from "./Command";
import { Game, Player, RoundHandPlayer, Table, Tile } from "./";
import { CommandCreator, LogEvent, FourMembers, PlayerCommandType, WindsLabel, askOtherPlayers, askPlayerCommand, logger, readChoices, toMoji, 牌 } from "../";

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

  get otherPlayers(): FourMembers<RoundHandPlayer> {
    return this._players.filter((_, index) => index != this._playerIndex) as FourMembers<RoundHandPlayer>;
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

  doKanProcess = async (player: RoundHandPlayer, playerCommand: Command.PlayerCommand): Promise<Command.BaseCommand> => {
    if (playerCommand instanceof Command.KaKanCommand) {
      // todo 槍槓できる場合
      throw new Error("not implementation");
    }

    this.executeCommand(playerCommand);

    return playerCommand;
  };

  playerTurn = async (currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    let playerCommand: Command.PlayerCommand;

    while (true) {
      playerCommand = await askPlayerCommand(currentPlayer);

      switch (playerCommand.type) {
        case PlayerCommandType.Kan:
          const otherPlayersCommand = await this.doKanProcess(currentPlayer, playerCommand);
          if (otherPlayersCommand.type === PlayerCommandType.Ron) {
            // 槍槓
            return this.ronEnd(otherPlayersCommand as Command.RonCommand);
          }

          // カンした場合は、もう一度捨て牌選択
          continue;
        case PlayerCommandType.Tsumo:
          return this.tsumoEnd(playerCommand as Command.TsumoCommand);
      }

      this.executeCommand(playerCommand);
      break;
    }

    return new TurnResult(playerCommand, false);
  };

  otherPlayersAction = async (playerCommand: Command.PlayerCommand, currentPlayer: RoundHandPlayer): Promise<Command.BaseCommand> => {
    const otherPlayersCommand = await askOtherPlayers(this.players, (playerCommand as Command.DiscardCommand).tile, currentPlayer);
    this.executeCommand(otherPlayersCommand);

    return otherPlayersCommand;
  };

  otherPlayersTurn = async (playerCommand: Command.PlayerCommand, currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const otherPlayersCommand = await this.otherPlayersAction(playerCommand, currentPlayer);

      // 鳴きよりもロンが最優先で処理される
      if (otherPlayersCommand.type === PlayerCommandType.Ron) {
        return this.ronEnd(otherPlayersCommand as Command.RonCommand);
      }

      // ポン、チー、カン
      if (otherPlayersCommand.isMeldCommand()) {
        // 鳴いた人に手番を変更する
        currentPlayer = this.setCurrentPlayer(otherPlayersCommand.who);

        const commandTypeList = [PlayerCommandType.Discard];
        const commandText = new CommandCreator().createPlayerCommandText(commandTypeList, currentPlayer.hand, currentPlayer);
        const discardTileNumber = await readChoices(commandText, currentPlayer.hand, commandTypeList);

        playerCommand = new Command.DiscardCommand(currentPlayer, currentPlayer.hand.tiles[Number(discardTileNumber)]);
        this.executeCommand(playerCommand);

        // 鳴いた場合は、捨てた牌へのほかのプレイヤーのアクションをさせるために、whileループを繰り返す
        continue;
      }

      break;
    }

    return new TurnResult(null, false);
  };

  turn = async (currentPlayer: RoundHandPlayer): Promise<TurnResult> => {
    // 牌をツモったプレイヤーのターン
    const turnResult = await this.playerTurn(currentPlayer);

    // 牌をツモったプレイヤー以外のプレイヤーのターン(プレイヤーが捨てた牌へのアクション)
    // 鳴いた後に捨てた牌をさらに鳴く処理も含まれる
    return await this.otherPlayersTurn(turnResult.command, currentPlayer);
  };

  mainLoop = async () => {
    let currentPlayer = this.currentPlayer;

    let turnCount = 1;

    // 局のループ
    do {
      currentPlayer.drawTile(new Tile(this.table.pickTile()));

      logger.debug(`${turnCount}回目のツモ`);

      const turnResult = await this.turn(currentPlayer);
      if (turnResult.roundHandEnd) {
        return;
      }

      if (!this.hasRestTiles()) {
        this.drawEnd(); // 流局
        return;
      }

      currentPlayer = this.nextPlayer;

      turnCount++;
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
      case PlayerCommandType.Kan:
        if (command instanceof Command.AnKanCommand) {
          (command as Command.AnKanCommand).execute();

          // 王牌に1枚足して、嶺上牌をツモる
          const lastTile = this._table.popTile();
          const tile = this._table.kingsWall.pickupTileByKan(lastTile);
          command.who.drawTile(new Tile(tile, true));
        }

        if (command instanceof Command.DaiMinKanCommand) {
          // todo
        }

        if (command instanceof Command.KaKanCommand) {
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

  set table(table: Table) {
    this._table = table;
  }
}

class TurnResult {
  constructor(public command: Command.BaseCommand, public roundHandEnd: boolean) {}
}
