import { Tile, Wall } from ".";
import { CustomError, logger, toEmojiMoji } from "../lib";
import { 牌 } from "../types";

export class KingsWall {
  private _wall: Wall;
  private _doraTileIndexList: number[] = [4]; // 王牌の先頭からのindex

  constructor(wall: Wall) {
    if (wall.tilesCount != 14) {
      throw new CustomError(`Tiles count is ${wall.tilesCount}. 王牌 is 14 tiles.`);
    }

    this._wall = wall;

    logger.info(`ドラ: ${this.doras.map((x) => toEmojiMoji(x)).join(" ")}`);
  }

  get doras(): 牌[] {
    return this._doraTileIndexList.map((doraIndex) => Tile.nextTile(this._wall.tile(doraIndex)));
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

    // 王牌から1枚とるので、ドラのindexも一つ前ににずらす
    this._doraTileIndexList = this._doraTileIndexList.map((doraIndex) => doraIndex - 1);
  }
}
