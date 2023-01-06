import { logger } from "../logging";
import { Enumerable, List } from "linqts";
import { Wall } from "./Wall";
import { DeadWall } from "./DeadWall";
import { ManduChar, PinduChar, SouduChar, Winds, Dragons } from "./Constants";
import { toManzu, toPinzu, toSouzu, ToSangenpai, ToKazehai } from "./Functions";
import { 牌, 色 } from "./Types";

export class Table {
  private _deadWall: DeadWall;
  private _walls: Array<Wall>; //牌の山
  private _initializedTiles: Array<牌> = [];
  protected _washedTiles: Array<牌> = [];

  constructor() {
    this._initializedTiles = Table.initializeTiles();
  }

  get deadWall(): DeadWall {
    return this._deadWall;
  }

  get washedTiles(): Array<牌> {
    return this._washedTiles;
  }

  get restTilesCount(): number {
    return new List(this._walls).Sum((wall) => wall.tilesCount);
  }

  makeDeadWall(): void {
    // todo 常に先頭の山から14枚を王牌としている
    this._deadWall = new DeadWall(new Wall(this._walls[0].pickTiles(14)));

    logger.debug("王牌を作成しました");
  }

  buildWalls(): void {
    this._walls = Enumerable.Range(0, 4)
      .Select((n) => this.buildWall())
      .ToArray();

    logger.debug("山を積みました");
  }

  buildWall(): Wall {
    return new Wall(
      Enumerable.Range(0, 17 * 2)
        .Select((n) => {
          return this._washedTiles.shift();
        })
        .ToArray()
    );
  }

  pickTiles(num: number): Array<牌> {
    return Enumerable.Range(0, num)
      .Select((n) => {
        return this.pickTile();
      })
      .ToArray();
  }

  pickTile(): 牌 {
    return new List(this._walls)
      .First((wall) => wall.tilesCount > 0)
      .pickTile();
  }

  //洗牌
  washInitializedTiles(): void {
    this._washedTiles = new List(this._initializedTiles)
      .OrderBy(() => Math.random())
      .ToArray();

    logger.debug("洗牌");
  }

  static shuffleTiles(tiles: 牌[]): 牌[] {
    return new List(tiles).OrderBy(() => Math.random()).ToArray();
  }

  static initializeTiles(): Array<牌> {
    let tiles = new List<牌>();

    tiles.AddRange(this.initializeSuits(ManduChar));
    tiles.AddRange(this.initializeSuits(PinduChar));
    tiles.AddRange(this.initializeSuits(SouduChar));
    tiles.AddRange(this.initializeHonors());

    tiles = tiles.Concat(tiles).Concat(tiles).Concat(tiles);

    return tiles.ToArray();
  }

  // 数牌を初期化
  static initializeSuits(color: 色): Array<牌> {
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
  static initializeHonors(): Array<牌> {
    const tiles: Array<牌> = [];
    tiles.push(...this.initializeKazehai());
    tiles.push(...this.initializeSangenpai());

    return tiles;
  }

  static initializeKazehai(): Array<牌> {
    return new List(Winds)
      .Select((n) => {
        return ToKazehai(n);
      })
      .ToArray();
  }

  static initializeSangenpai(): Array<牌> {
    return new List(Dragons)
      .Select((n) => {
        return ToSangenpai(n);
      })
      .ToArray();
  }
}

export class CheatTable extends Table {
  constructor(washedTiles: 牌[]) {
    super();
    this._washedTiles = washedTiles;
  }
}
