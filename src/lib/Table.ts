import { logger } from "./logging";
import { Enumerable, List } from "linqts";
import { Wall } from "./Wall";
import { DeadWall } from "./DeadWall";
import { ManduChar, PinduChar, SouduChar, Winds, Dragons } from "./Constants";
import { toManzu, toPinzu, toSouzu, ToSangenpai, ToKazehai } from "./Functions";
import { 牌, 色 } from "./Types";
import { Validator } from "./Validator";

export class Table {
  private _walls: Array<Wall>; //牌の山
  private _deadWall: DeadWall; // 王牌
  protected _washedTiles: Array<牌> = [];

  constructor(washedTiles?: Array<牌>) {
    if (washedTiles) {
      this._washedTiles = washedTiles;
    } else {
      this.washInitializeTiles(Table.initializeTiles());
    }

    if (!Validator.isValidAllTiles(this._washedTiles)) {
      throw new Error(
        JSON.stringify({
          tiles: this._washedTiles,
          length: this.washedTiles?.length,
        })
      );
    }
  }

  get walls(): Wall[] {
    return this._walls;
  }

  get washedTiles(): Array<牌> {
    return this._washedTiles;
  }

  get restTilesCount(): number {
    return new List(this._walls).Sum((wall) => wall.tilesCount);
  }

  get deadWall(): DeadWall {
    return this._deadWall;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set deadWall(deadWall: DeadWall) {
    this._deadWall = deadWall;

    logger.debug("王牌を作成しました");
  }

  makeDeadWall(): void {
    // todo 常に先頭の山から14枚を王牌としている
    this.deadWall = new DeadWall(new Wall(this._walls[0].pickTiles(14)));
  }

  buildWalls(): void {
    // 山を4つにわける
    this._walls = [...Array(4)].map(() => this.buildWall());

    logger.debug("山を積みました");
  }

  buildWall(): Wall {
    // 17 x 2 ずつ山(wall)を分けていく
    return new Wall(
      Enumerable.Range(0, 17 * 2)
        .Select(() => {
          return this._washedTiles.shift();
        })
        .ToArray()
    );
  }

  drawTiles(num: number): Array<牌> {
    return [...Array(num)].map(() => this.pickTile());
  }

  pickTile(): 牌 {
    return new List(this._walls).First((wall) => wall.tilesCount > 0).pickTile();
  }

  popTile(): 牌 {
    return new List(this._walls).Last((wall) => wall.tilesCount > 0).popTile();
  }

  //洗牌
  washInitializeTiles(tiles: 牌[]): void {
    this._washedTiles = new List(tiles).OrderBy(() => Math.random()).ToArray();

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

export class CheatTable {
  constructor(public washedTiles: 牌[]) {}

  drawTiles(num: number): Array<牌> {
    return Enumerable.Range(0, num)
      .Select(() => {
        return this.drawTile();
      })
      .ToArray();
  }

  drawTile(): 牌 {
    return this.washedTiles.shift();
  }

  pickTile(tile: 牌) {
    const index = this.washedTiles.indexOf(tile);
    return this.washedTiles.splice(index, 1);
  }
}
