import { List } from "linqts";
import { CheatTable } from "./Table";
import { Hand } from "./Hand";
import { Table } from "./Table";
import { Validator } from "./Validator";
import { 牌 } from "./Types";
import { toTile, sortTiles } from "./Functions";
import { logger } from "./logging";

export class CheatTableBuilder {
  private _baseCheatTable: CheatTable;
  private _dealedTilesList: PlayerDealedTiles[];

  constructor() {
    this._baseCheatTable = new CheatTable(new Table().washedTiles);
    this._dealedTilesList = [...Array(4)].map(() => new PlayerDealedTiles());
  }

  createCheatTable(): CheatTable {
    const dealedTilesList = new List(this._dealedTilesList)
      .Select((item: PlayerDealedTiles, index: number) => {
        return this.fillDealedTiles(item, index > 1);
      })
      .ToArray();

    if (!Validator.isValidPlayerDealedTiles(dealedTilesList)) {
      logger.error(dealedTilesList);
      throw new Error();
    }

    const tiles: 牌[] = [];

    // 配牌時の4つずつ取ってくるツモ
    for (let i = 0; i < 3; i++) {
      for (let index = 0; index < dealedTilesList.length; index++) {
        for (let j = 0; j < 4; j++) {
          tiles.push(dealedTilesList[index].hand.tiles[i * 4 + j]);
        }
      }
    }

    // 配牌時の最後のツモ
    for (let i = 0; i < dealedTilesList.length; i++) {
      tiles.push(dealedTilesList[i].hand.tiles[12]);
    }

    // 配牌が終わった後の順番にツモってくる牌
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < dealedTilesList.length; j++) {
        if (dealedTilesList[j].dealedTiles[i]) {
          tiles.push(dealedTilesList[j].dealedTiles[i]);
        }
      }
    }

    // ここでthis._baseCheatTableが残り14枚（王牌分）になっているはず
    const kingsTiles = this._baseCheatTable.drawTiles(14); // 王牌

    const newTiles = kingsTiles.concat(tiles);

    if (!Validator.isValidAllTiles(newTiles)) {
      logger.error(newTiles.length.toString(), sortTiles(newTiles));
      throw new Error();
    }

    const table = new CheatTable(newTiles);
    return table;
  }

  set(dealedTiles: PlayerDealedTiles, playerIndex: 0 | 1 | 2 | 3) {
    // イカサマ配牌をテーブルの山から除く
    dealedTiles.hand.tiles.forEach((tile) => this._baseCheatTable.pickTile(toTile(tile)));

    dealedTiles.dealedTiles.forEach((tile) => this._baseCheatTable.pickTile(toTile(tile)));

    this._dealedTilesList[playerIndex] = this.fillDealedTiles(dealedTiles, playerIndex >= 2);
  }

  // PlayerDealedTilesの不十分な牌を補う
  fillDealedTiles(tiles: PlayerDealedTiles, less: boolean): PlayerDealedTiles {
    if (tiles.hand.tiles.length == 0) {
      tiles.hand = new Hand(this._baseCheatTable.drawTiles(13));
    }

    const dealedTilesCount = less ? 17 : 18;
    if (tiles.dealedTiles.length != dealedTilesCount) {
      if (tiles.dealedTiles.length < dealedTilesCount) {
        tiles.dealedTiles = tiles.dealedTiles.concat(this._baseCheatTable.drawTiles(dealedTilesCount - tiles.dealedTiles.length));
      } else {
        throw new Error("too match dealedTiles");
      }
    }

    return tiles;
  }

  // 引数の牌を加えることで、全ての牌(1種の牌が4枚ずつ136枚)がそろうように残りの牌を生成する
  createRestTiles = (handTiles: 牌[]): 牌[] => {
    const suffleTiles = Table.shuffleTiles(Table.initializeTiles());

    // イカサマ牌を先頭に足して、逆順にする(末尾にイカサマ牌を末尾にもってくる)
    const reversedTiles = new List(handTiles.concat(suffleTiles)).Reverse();

    // todo パフォーマンス改善
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const group = reversedTiles.GroupBy((tile) => tile);

      // 4つより多い牌を先頭から消していく
      new List(Object.keys(group)).Where((key) => group[key].length !== 4).ForEach((key) => reversedTiles.Remove(toTile(key)));

      if (Validator.isValidAllTiles(reversedTiles.ToArray())) {
        break;
      }
    }

    // handTiles以外の残りの牌
    const restTiles = reversedTiles.Reverse().Skip(handTiles.length).ToArray();
    return restTiles;
  };
}

export class PlayerDealedTiles {
  constructor(public hand?: Hand, public dealedTiles?: 牌[]) {
    this.hand = hand ? hand : new Hand();
    this.dealedTiles = typeof dealedTiles != "undefined" ? dealedTiles : [];
  }

  toTiles(): 牌[] {
    return this.hand.tiles.concat(this.dealedTiles);
  }
}
