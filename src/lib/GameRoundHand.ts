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

  tsumoEnd(player: Player) {
    logger.info(`${player.name} ツモ和了`);
    logger.info(player.handStatus);
  }

  ronEnd(winner: Player, looser: Player, tile: 牌) {
    logger.info(
      `${looser.name}が${winner.name}に${toMoji(tile)}で振り込みました`
    );
    logger.info(`${winner.name}の手配 ${winner.handStatus}`);
  }

  // 局の終了
  end(): void {
    LogEvent("局終了");
  }

  drawEnd(): void {
    this._isDraw = true;

    LogEvent("流局");
  }
}
