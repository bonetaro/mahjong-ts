import { Enumerable, List } from "linqts";
import { 牌 } from "./Types";

export class Wall {
  private _upperTiles: 牌[] = []; // 山の上段
  private _lowerTiles: 牌[] = []; // 山の下段
  private _isUpper: boolean = true;

  constructor(tiles: Array<牌>) {
    const half = Math.ceil(tiles.length / 2);

    this._upperTiles = tiles.slice(0, half);
    this._lowerTiles = tiles.slice(half);
  }

  get tilesCount(): number {
    return this._upperTiles.length + this._lowerTiles.length;
  }

  // 山の中のとあるポジションの牌
  tile(num: number, isUpper: boolean = true): 牌 {
    return isUpper ? this._upperTiles[num] : this._lowerTiles[num];
  }

  pickTiles(num: number): Array<牌> {
    return Enumerable.Range(0, num)
      .Select((n) => {
        return this.pickTile();
      })
      .ToArray();
  }

  pickTile(): 牌 {
    const tile = this._isUpper
      ? this._upperTiles.shift()
      : this._lowerTiles.shift();

    this._isUpper = !this._isUpper;

    return tile;
  }
}
