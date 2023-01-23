import { Enumerable, List } from "linqts";
import {
  Dragons,
  ManduChar,
  PinduChar,
  SouduChar,
  Validator,
  Winds,
  logger,
  sortTiles,
  toKazehai,
  toManzu,
  toPinzu,
  toSangenpai,
  toSouzu,
  数牌の色,
  牌,
} from "../";
import { throwErrorAndLogging } from "../error";
import { KingsWall, Wall } from "./";

export class Table {
  private _walls: Wall[] = []; //牌の山
  private _kingsWall: KingsWall; // 王牌
  protected _washedTiles: 牌[] = [];

  constructor(washedTiles?: Array<牌>) {
    if (washedTiles) {
      this._washedTiles = washedTiles;
    } else {
      this.washInitializeTiles(Table.initializeTiles());
    }

    if (!Validator.isValidAllTiles(this._washedTiles)) {
      throwErrorAndLogging(
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
    return new List(this._walls).Sum((wall) => (wall ? wall?.tilesCount : 0));
  }

  get kingsWall(): KingsWall {
    return this._kingsWall;
  }

  set kingsWall(kingsWall: KingsWall) {
    this._kingsWall = kingsWall;

    logger.debug("王牌を作成しました");
  }

  makeKingsWall(): void {
    // todo 常に先頭の山から14枚を王牌としている
    this.kingsWall = new KingsWall(new Wall(this._walls[0].pickTiles(14)));
  }

  buildWalls(): void {
    // 山を4つにわける
    this._walls = [...Array(4)].map(() => this.buildWall());

    logger.debug("山を積みました");
  }

  buildWall(): Wall {
    // 17 x 2の山(wall)をつくる
    return new Wall(
      [...Array(17 * 2)].map(() => {
        const tile = this._washedTiles.shift();
        if (!tile) {
          throw new Error();
        }

        return tile;
      })
    );
  }

  drawTiles(num: number): Array<牌> {
    return [...Array(num)].map(() => this.pickTile());
  }

  pickTile(): 牌 {
    return new List(this._walls).First((wall) => wall.tilesCount > 0).pickTile();
  }

  // 山の最後の牌を取り出す。カンのときに利用する
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
  static initializeSuits(color: 数牌の色): Array<牌> {
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
    return Winds.map((n) => toKazehai(n));
  }

  static initializeSangenpai(): Array<牌> {
    return Dragons.map((n) => toSangenpai(n));
  }
}

export class CheatTable {
  constructor(public washedTiles: 牌[]) {}

  drawTiles(num: number): Array<牌> {
    return [...Array(num)].map(() => this.drawTile());
  }

  drawTile(): 牌 {
    const tile = this.washedTiles.shift();
    if (!tile) {
      throwErrorAndLogging({ washedTiles: this.washedTiles });
    }

    return tile;
  }

  removeTile(tile: 牌): void {
    const index = this.washedTiles.indexOf(tile);
    if (index < 0) {
      throwErrorAndLogging({ tile, washedTiles: sortTiles(this.washedTiles) });
    }

    this.washedTiles.splice(index, 1);
  }
}
