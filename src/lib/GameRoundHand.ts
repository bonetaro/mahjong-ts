import { LogEvent, logger } from "../logging";
import { List } from "linqts";
import { 牌 } from "./Types";
import { Tile } from "./Tile";
import { CheatTable, Table } from "./Table";
import { toMoji } from "./Functions";
import {
  AnKanCommand,
  BaseCommand,
  RonCommand,
  TsumoCommand,
  DaiMinKanCommand,
  KaKanCommand,
} from "./Command";
import { PlayerCommandType } from "./Constants";
import { Player } from "./Player";

// 局
export class GameRoundHand {
  private _isDraw: boolean = false; // 流局
  protected _table: Table = new Table();

  protected _players: Player[];
  private _playerIndex = 0;

  constructor(players: Player[]) {
    logger.debug("gameRoundHand create");

    this._players = players;
  }

  get currentPlayer(): Player {
    return this._players[this._playerIndex];
  }

  get players(): Player[] {
    return this._players;
  }

  get table(): Table {
    return this._table;
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

  set playerIndex(index: number) {
    this._playerIndex = index + 1 > this.players.length - 1 ? 0 : index + 1;
  }

  incrementPlayerIndex(): void {
    const index = this._playerIndex;
    this._playerIndex = index + 1 > 3 ? 0 : index + 1;
  }

  changePlayerIndexNext(player: Player) {
    const index = this.players.indexOf(player);
    this.playerIndex = index + 1;
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
        this.changePlayerIndexNext(command.who);

        break;
      case PlayerCommandType.Discard:
        command.execute(this);
        break;
    }
  }

  pickTile(): 牌 {
    return this.table.pickTile();
  }

  hasRestTiles(): boolean {
    logger.info(`残りの山の牌：${this.table.restTilesCount}枚`);

    return this.table.restTilesCount > 0;
  }

  tsumoEnd(command: TsumoCommand) {
    logger.info(`${command.who.name} ツモ和了`);
    logger.info(command.who.hand.status);
  }

  ronEnd(command: RonCommand) {
    logger.info(
      `${command.who.name}が${command.whomPlayer(this).name}に${toMoji(
        command.tile
      )}で振り込みました`
    );
    logger.info(`${command.who.name}の手配 ${command.who.hand.status}`);
  }

  drawEnd(): void {
    this._isDraw = true;

    LogEvent("流局");
  }
}

export class CheatGameRoundHand extends GameRoundHand {
  set table(table: CheatTable) {
    this._table = table;
  }

  get table(): Table {
    return this._table;
  }
}
