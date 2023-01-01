import { List } from "linqts";
import { 牌 } from "./Types";
import { TileTypeSort, WindsSort, DragonsSort } from "./Constants";
import { isKazehai, isSangenpai, isSuits } from "./Functions";

const typeSortMap = new Map<string, number>();
TileTypeSort.forEach((x, index) => typeSortMap.set(x, index));

const windSortMap = new Map<string, number>();
WindsSort.forEach((x, index) => windSortMap.set(x, index));

const dragonSortMap = new Map<string, number>();
DragonsSort.forEach((x, index) => dragonSortMap.set(x, index));

export class Hand {
  private tiles: Array<牌>;

  constructor(tiles: Array<牌>) {
    this.tiles = tiles;
  }

  sort(): Array<牌> {
    return new List(this.tiles)
      .OrderBy((x) => typeSortMap.get(x[1]))
      .ThenBy((x) => {
        const sort = x[0];

        if (isSuits(x)) return sort;
        if (isKazehai(x)) return windSortMap.get(sort);
        if (isSangenpai(x)) return dragonSortMap.get(sort);
        throw new Error(x);
      })
      .ToArray();
  }
}
