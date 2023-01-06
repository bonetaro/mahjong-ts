import { LogEvent, logger } from "../logging";
import { 牌 } from "./Types";
import { CheatTable, Table } from "./Table";
import { toMoji } from "./Functions";
import { RonCommand, TsumoCommand } from "./Command";

// 局
export class GameRoundHand {
  private _isDraw: boolean = false; // 流局
  protected _table: Table = new Table();

  constructor() {
    logger.debug("gameRoundHand create");
  }

  get table(): Table {
    return this._table;
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
    logger.info(command.who.handStatus);
  }

  ronEnd(command: RonCommand) {
    logger.info(
      `${command.who.name}が${command.whom.name}に${toMoji(
        command.tile
      )}で振り込みました`
    );
    logger.info(`${command.who.name}の手配 ${command.who.handStatus}`);
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
