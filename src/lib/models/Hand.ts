import { toEmojiFromArray, toMojiFromArray, sortTiles, splitBy2Chars, toTile } from "../Functions";
import { IMentsu } from "./Mentsu";
import { 牌 } from "../Types";
import { DrawTile } from "./Tile";
import { throwErrorAndLogging } from "../error";

export class Hand {
  private _tiles: 牌[];
  private _openMentsuList: IMentsu[] = [];
  private _drawingTile: DrawTile;

  constructor(tile?: string);
  constructor(tiles?: 牌[]);
  constructor(tileSomthing?: string | 牌[]) {
    let tiles: 牌[] = [];

    if (Array.isArray(tileSomthing)) {
      tiles = tileSomthing as 牌[];
    }

    if (typeof tileSomthing === "string") {
      tiles = splitBy2Chars(tileSomthing).map((x) => toTile(x));
    }

    // todo
    if (tiles.length > 0 && tiles.length !== 13) {
      throwErrorAndLogging("hand tiles count must be 13");
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
    testList.push(`${toEmojiFromArray(this.tiles)}] (${toMojiFromArray(this.tiles)})`);

    if (this.openMentsuList.length > 0) {
      testList.push(`副露牌 [${this._openMentsuList.map((mentsu) => `${mentsu.status()}`).join(" ")}]`);
    }

    return testList.join(" ");
  }

  removeTiles(tiles: 牌[]): void {
    tiles.forEach((tile) => this.removeTile(tile));
  }

  removeTile(tile: 牌): void {
    const index = this.tiles.indexOf(tile);
    if (index < 0) {
      throwErrorAndLogging(tile);
    }

    this.tiles.splice(index, 1);
  }

  debugStatus(): any {
    return {
      tiles: this.tiles.join(""),
      length: this.tiles.length,
      emoji: toEmojiFromArray(this.tiles),
      moji2: toMojiFromArray(this.tiles),
      furo: this._openMentsuList.map((m) => m.status()).join("|"),
    };
  }

  sortTiles(): Array<牌> {
    return sortTiles(this.tiles);
  }

  //シャンテン数（向聴数）を計算する
  calculateToReady(): number {
    throw new Error();
  }
}
