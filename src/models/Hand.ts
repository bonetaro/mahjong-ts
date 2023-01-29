import { DrawTile, IMentsu, Tile } from ".";
import { CustomError, toEmojiArray, toMojiArray } from "../lib";
import { 牌 } from "../types";

export class Hand {
  private _tiles: 牌[];
  private _openMentsuList: IMentsu[] = [];
  private _drawingTile: DrawTile;

  constructor(tile?: string);
  constructor(tiles?: 牌[]);
  constructor(tileSomthing?: string | 牌[]) {
    let tiles: 牌[] = [];

    if (Array.isArray(tileSomthing)) {
      tiles = tileSomthing;

      if (tiles.length > 0 && tiles.length !== 13) {
        throw new CustomError("hand tiles count must be 13", tiles);
      }
    } else if (typeof tileSomthing === "string") {
      tiles = Hand.parse(tileSomthing);
    }

    this._tiles = tiles ?? [];
  }

  get tiles(): Array<牌> {
    return this._tiles;
  }

  set tiles(tiles: Array<牌>) {
    this._tiles = tiles;
  }

  get drawingTile(): DrawTile {
    return this._drawingTile;
  }

  set drawingTile(tile: DrawTile) {
    this._drawingTile = tile;
    this.tiles.push(tile.tile);
  }

  get openMentsuList(): IMentsu[] {
    return this._openMentsuList;
  }

  set openMentsuList(mentsuList: IMentsu[]) {
    this._openMentsuList = mentsuList;
  }

  get status(): string {
    const testList: string[] = [];
    testList.push(`[${toEmojiArray(this.tiles)} (${toMojiArray(this.tiles)})]`);

    if (this.openMentsuList.length > 0) {
      testList.push(`副露牌 [${this._openMentsuList.map((mentsu) => `${mentsu.status()}`).join(" ")}]`);
    }

    return testList.join(" ");
  }

  static parse(tilesString: string): 牌[] {
    const strArray = tilesString.match(/.{2}/g);

    if (!strArray.every((x) => Tile.isTile(x))) {
      throw new CustomError({ tilesString, strArray });
    }

    if (strArray.length > 0 && strArray.length !== 13) {
      throw new CustomError("hand tiles count must be 13", strArray);
    }

    return strArray.map((x) => Tile.toTile(x));
  }

  removeTiles(tiles: 牌[]): void {
    tiles.forEach((tile) => this.removeTile(tile));
  }

  removeTile(tile: 牌): void {
    const index = this.tiles.indexOf(tile);
    if (index < 0) {
      throw new CustomError(tile);
    }

    this.tiles.splice(index, 1);
  }

  debugStatus(): any {
    return {
      tiles: this.tiles.join(""),
      length: this.tiles.length,
      emoji: toEmojiArray(this.tiles),
      moji2: toMojiArray(this.tiles),
      furo: this._openMentsuList.map((m) => m.status()).join("|"),
    };
  }

  sortTiles(): Array<牌> {
    return Tile.sortTiles(this.tiles);
  }

  //シャンテン数（向聴数）を計算する
  calculateToReady(): number {
    throw new Error();
  }
}
