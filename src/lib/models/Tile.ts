import { 牌 } from "../Types";

export class Tile {
  private _tile: 牌;
  private _kingsTile: boolean;

  constructor(tile: 牌, kingsTile = false) {
    this._tile = tile;
    this._kingsTile = kingsTile;
  }

  get tile(): 牌 {
    return this._tile;
  }

  get kingsTile(): boolean {
    return this.kingsTile;
  }
}
