import { Hand } from "./Hand";
import { 牌 } from "./Types";

export class Player {
  private _name: string;
  private tiles: Array<牌> = [];

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  takeTiles(tiles: Array<牌>) {
    this.tiles.push(...tiles);
  }

  sortTiles(): void {
    this.tiles = new Hand(this.tiles).sort();
  }
}
