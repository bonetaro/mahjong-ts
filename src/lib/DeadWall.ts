import { 牌 } from "./Types";
import { Wall } from "./Wall";
import { nextTile } from "./Functions";

export class DeadWall {
  private _wall: Wall;

  constructor(wall: Wall) {
    if (wall.tilesCount != 14) {
      throw new Error(`Tiles count is ${wall.tilesCount}. 王牌 is 14 tiles.`);
    }

    this._wall = wall;
  }

  get dora(): 牌 {
    const tile = this._wall.tile(3); // 表示牌
    return nextTile(tile);
  }
}
