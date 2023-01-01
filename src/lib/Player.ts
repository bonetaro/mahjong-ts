import { Hand } from "./Hand";
import { 牌 } from "./MahjongTypes";

export class Player {
  private name: string;
  private tiles: Array<牌> = [];

  constructor(name: string) {
    this.name = name;
  }

  takeTiles(tiles: Array<牌>) {
    this.tiles.push(...tiles);
  }

  sortTiles(): void {
    this.tiles = new Hand(this.tiles).sort();
  }
}
