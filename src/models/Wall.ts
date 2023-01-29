import { 牌 } from "../types";
import { Enumerable } from "linqts";

export class Wall {
  private _tiles: 牌[];

  constructor(tiles: Array<牌>) {
    this._tiles = tiles;
  }

  get tiles(): 牌[] {
    return this._tiles;
  }

  get tilesCount(): number {
    return this._tiles.length;
  }

  splitHalf(tiles: 牌[]): [牌[], 牌[]] {
    const half = Math.floor(tiles.length / 2);

    return [tiles.slice(0, half), tiles.slice(half)];
  }

  // 山の中のとあるポジションの牌
  tile(num: number, isUpper = true): 牌 {
    return this._tiles[num];
  }

  pickTiles(num: number): Array<牌> {
    return Enumerable.Range(0, num)
      .Select(() => this.pickTile())
      .ToArray();
  }

  pickTile(): 牌 {
    const tile = this._tiles.shift();
    return tile;
  }

  popTile(): 牌 {
    const tile = this._tiles.pop();
    return tile;
  }

  pushTile(tile: 牌): void {
    this._tiles.push(tile);
  }
}
