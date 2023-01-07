import { 牌 } from "./Types";
import { Wall } from "./Wall";
import { nextTile } from "./Functions";

export class DeadWall {
  private _wall: Wall;
  private _doraIndexList: number[] = [4];

  constructor(wall: Wall) {
    if (wall.tilesCount != 14) {
      throw new Error(`Tiles count is ${wall.tilesCount}. 王牌 is 14 tiles.`);
    }

    this._wall = wall;
  }

  get doras(): 牌[] {
    return this._doraIndexList.map((doraIndex) =>
      nextTile(this._wall.tile(doraIndex))
    );
  }

  // 引数のtileは王牌に追加する牌
  pickupTileByKan(tile: 牌): 牌 {
    this.increaseDora();
    this._wall.pushTile(tile);
    return this._wall.pickTile();
  }

  increaseDora(): void {
    this._doraIndexList.push(
      this._doraIndexList[this._doraIndexList.length - 1] + 2
    );
    this._doraIndexList = this._doraIndexList.map((doraIndex) => doraIndex - 1);
  }
}
