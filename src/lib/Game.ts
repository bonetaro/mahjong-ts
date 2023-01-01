import { Enumerable, List } from "linqts";
import { ManduChar, PinduChar, SouduChar, Winds, Dragons } from "./Constants";
import { toManzu, toPinzu, toSouzu, ToSangenpai, ToKazehai } from "./Functions";
import { 牌, 色 } from "./Types";

export class Game {
  private _wall: Array<牌>; //牌の山

  constructor() {
    this._wall = this.initializeTiles();
  }

  get wall(): Array<牌> {
    return this._wall;
  }

  start(): void {
    this.washTiles();
  }

  //洗牌
  washTiles(): void {
    this._wall = new List(this.wall).OrderBy(() => Math.random()).ToArray();
  }

  //牌を配る
  dealTiles(num: number): Array<牌> {
    let tiles: Array<牌> = [];

    for (let i = 0; i < num; i++) {
      tiles.push(this.dealTile());
    }

    return tiles;
  }

  dealTile(): 牌 {
    const tile = this.wall.shift();

    return tile;
  }

  initializeTiles(): Array<牌> {
    let tiles = new List<牌>();

    tiles.AddRange(this.initializeSuits(ManduChar));
    tiles.AddRange(this.initializeSuits(PinduChar));
    tiles.AddRange(this.initializeSuits(SouduChar));
    tiles.AddRange(this.initializeHonors());

    tiles = tiles.Concat(tiles).Concat(tiles).Concat(tiles);

    return tiles.ToArray();
  }

  // 数牌を初期化
  initializeSuits(color: 色): Array<牌> {
    return Enumerable.Range(1, 9)
      .Select((n) => {
        switch (color) {
          case ManduChar:
            return toManzu(n + color);
          case PinduChar:
            return toPinzu(n + color);
          case SouduChar:
            return toSouzu(n + color);
        }
      })
      .ToArray();
  }

  // 字牌を初期化
  initializeHonors(): Array<牌> {
    const tiles: Array<牌> = [];
    tiles.push(...this.initializeKazehai());
    tiles.push(...this.initializeSangenpai());

    return tiles;
  }

  initializeKazehai(): Array<牌> {
    return new List(Winds)
      .Select((n) => {
        return ToKazehai(n);
      })
      .ToArray();
  }

  initializeSangenpai(): Array<牌> {
    return new List(Dragons)
      .Select((n) => {
        return ToSangenpai(n);
      })
      .ToArray();
  }
}
