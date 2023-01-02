import { List } from "linqts";
import { 牌 } from "./Types";
import { typeSortMap, windSortMap, dragonSortMap } from "./Constants";
import { isKazehai, isSangenpai, isSuits } from "./Functions";

export class Hand {
  private _tiles: Array<牌>;

  constructor(tiles: Array<牌>) {
    this._tiles = tiles;
  }

  get tiles(): Array<牌> {
    return this._tiles;
  }

  sort(): Array<牌> {
    return new List(this.tiles)
      .OrderBy((x) => typeSortMap.get(x[1]))
      .ThenBy((x) => {
        const key = x[0];

        if (isSuits(x)) return key;
        if (isKazehai(x)) return windSortMap.get(key);
        if (isSangenpai(x)) return dragonSortMap.get(key);
        throw new Error(x);
      })
      .ToArray();
  }

  //シャンテン数（向聴数）を計算する
  calculateToReady(): number {
    throw new Error();
  }
}
