import { 牌 } from "../Types";
import { Wall } from "./Wall";
import { nextTile } from "../Functions";

export class KingsWall {
  private _wall: Wall;
  private _doraTileIndexList: number[] = [4]; // 王牌の先頭からのindex

  constructor(wall: Wall) {
    if (wall.tilesCount != 14) {
      throw new Error(`Tiles count is ${wall.tilesCount}. 王牌 is 14 tiles.`);
    }

    this._wall = wall;
  }

  get doras(): 牌[] {
    return this._doraTileIndexList.map((doraIndex) => nextTile(this._wall.tile(doraIndex)));
  }

  // 引数のtileは王牌に追加する牌
  pickTile(tile: 牌): 牌 {
    // todo ドラを増やすタイミング
    this.increaseDora();

    this._wall.pushTile(tile);
    return this._wall.pickTile();
  }

  increaseDora(): void {
    this._doraTileIndexList.push(this._doraTileIndexList[this._doraTileIndexList.length - 1] + 2);

    // 王牌から1枚とるので、indexも一つ後ろにずらす
    this._doraTileIndexList = this._doraTileIndexList.map((doraIndex) => doraIndex - 1);
  }
}
