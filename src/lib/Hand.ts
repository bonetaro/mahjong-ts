import { List } from "linqts";
import { 牌 } from "./Types";
import { typeSortMap, windSortMap, dragonSortMap } from "./Constants";
import { isKazehai, isSangenpai, isSuits, toEmoji } from "./Functions";
import { Mentsu } from "./Mentsu";
import { toEmojiFromArray, toKanjiFromArray } from "./Functions";

export class Hand {
  private _tiles: Array<牌>;
  private _openMentsuList: Mentsu[] = [];

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

  get openMentsuList(): Mentsu[] {
    return this._openMentsuList;
  }

  get status(): string {
    return (
      `[${toEmojiFromArray(this.tiles)}]` +
      " " +
      `[${toKanjiFromArray(this.tiles)}]` +
      " 副露牌" +
      this._openMentsuList
        .map((m) => `${m.status()} [${toKanjiFromArray(m.tiles)}]`)
        .join("|")
    );
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

  sort(): Array<牌> {
    return new List(this.tiles)
      .OrderBy((x) => typeSortMap.get(x[1]))
      .ThenBy((x) => {
        const key = x[0];

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
