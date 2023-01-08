import { List } from "linqts";
import { 牌 } from "./Types";
import { typeSortMap, windSortMap, dragonSortMap } from "./Constants";
import { isKazehai, isSangenpai, isSuits } from "./Functions";
import { Mentsu } from "./Mentsu";
import { toEmojiFromArray, toKanjiFromArray } from "./Functions";
import { Tile } from "./Tile";

export class Hand {
  private _tiles: Array<牌>;
  private _openMentsuList: Mentsu[] = [];
  private _drawingTile: Tile;

  constructor(tiles?: Array<牌>);

  constructor(tiles?: Array<牌>) {
    this._tiles = tiles ?? [];
  }

  get tiles(): Array<牌> {
    return this._tiles;
  }

  set tiles(tiles: Array<牌>) {
    this._tiles = tiles;
  }

  get drawingTile(): Tile {
    return this._drawingTile;
  }

  set drawingTile(tile: Tile) {
    this._drawingTile = tile;
    this.tiles.push(tile.tile);
  }

  get openMentsuList(): Mentsu[] {
    return this._openMentsuList;
  }

  get status(): string {
    let text =
      `[${toEmojiFromArray(this.tiles)}]` +
      " " +
      `[${toKanjiFromArray(this.tiles)}]`;

    if (this.openMentsuList.length > 0) {
      text +=
        " 副露牌" +
        this._openMentsuList
          .map((m) => `[${m.status()} ${toKanjiFromArray(m.tiles)}]`)
          .join("|");
    }

    return text;
  }

  debugStatus(): any {
    return {
      tiles: this.tiles.join(""),
      length: this.tiles.length,
      emoji: toEmojiFromArray(this.tiles),
      kanji: toKanjiFromArray(this.tiles),
      furo: this._openMentsuList.map((m) => m.status()).join("|"),
    };
  }

  sortTiles(): Array<牌> {
    return new List(this.tiles)
      .OrderBy((x) => typeSortMap.get(x[1])) // 2文字目で整列
      .ThenBy((x) => {
        const key = x[0]; // 1文字目で整列

        if (isSuits(x)) return key;
        if (isKazehai(x)) return windSortMap.get(key);
        if (isSangenpai(x)) return dragonSortMap.get(key);
        throw new Error(x);
      })
      .ToArray();
  }

  //シャンテン数（向聴数）を計算する
  calculateToReady(): number {
    throw new Error();
  }
}
