import { LogEvent, logger } from "../logging";
import { 牌 } from "./Types";
import { Player } from "./Player";
import { Table } from "./Table";
import { toMoji } from "./Functions";

// 局
export class GameRoundHand {
  private _isDraw: boolean = false; // 流局
  private _table: Table = new Table();

  get table(): Table {
    return this._table;
  }

  TsumoEnd(player: Player) {
    logger.info(`${player.name} ツモ和了`);
    logger.info(player.handStatus);
  }

  RonEnd(winner: Player, looser: Player, tile: 牌) {
    logger.info(
      `${looser.name}が${winner.name}に${toMoji(tile)}で振り込みました`
    );
    logger.info(`${winner.name}の手配 ${winner.handStatus}`);
  }

  drawEnd(): void {
    this._isDraw = true;

    LogEvent("流局");
  }
}
