import { List } from "linqts";
import * as Constants from "../constants";
import { 牌種, 牌, 四風牌, 白, 發, 中, 三元牌, 字牌, 数牌の数, 東, 南, 西, 北, 萬子牌, 筒子牌, 索子牌, 数牌, 数牌の色 } from "../types";
import { CustomError } from "../lib/";

export class Tile {
  type: 牌種;

  constructor(public readonly tile: 牌) {
    this.type = tile[1] as 牌種;
  }

  static parse(tilesString: string): 牌[] {
    const strArray = tilesString.match(/.{2}/g);

    if (!strArray.every((x) => Tile.isTile(x))) {
      throw new CustomError({ tilesString, strArray });
    }

    return strArray.map((x) => Tile.toTile(x));
  }

  static toTile(value: unknown): 牌 {
    if (Tile.isTile(value)) return value;
  }

  static toKazehai(value: unknown): 四風牌 {
    if (this.isKazehai(value)) return value;
    throw new Error(`${value} NOT 風牌`);
  }

  static toHaku(value: unknown): 白 {
    if (this.isHaku(value)) return value;
    throw new Error(`${value} NOT 白`);
  }

  static toHatsu(value: unknown): 發 {
    if (this.isHatsu(value)) return value;
    throw new Error(`${value} NOT 發`);
  }

  static toChun(value: unknown): 中 {
    if (this.isChun(value)) return value;
    throw new Error(`${value} NOT 中`);
  }

  static toSangenpai(value: unknown): 三元牌 {
    if (this.isSangenpai(value)) return value;
    throw new Error(`${value} NOT 三元牌`);
  }

  static toHonours(value: unknown): 字牌 {
    if (this.isHonours(value)) return value;
    throw new Error(`${value} NOT 字牌`);
  }

  toSuitsTile(): SuitsTile {
    return new SuitsTile(this, this.tile[0] as unknown as 数牌の数);
  }

  toDragonTile(): DragonTile {
    return new DragonTile(this, this.tile[0] as unknown as (typeof Constants.DragonChars)[number]);
  }

  toWindTile(): WindTile {
    return new WindTile(this, this.tile[0] as unknown as (typeof Constants.WindChars)[number]);
  }

  static toEast(value: unknown): 東 {
    if (this.isEast(value)) return value;
    throw new Error(`${value} NOT 東`);
  }

  static toSouth(value: unknown): 南 {
    if (this.isSouth(value)) return value;
    throw new Error(`${value} NOT 南`);
  }

  static toWest(value: unknown): 西 {
    if (this.isWest(value)) return value;
    throw new Error(`${value} NOT 西`);
  }

  static toNorth(value: unknown): 北 {
    if (this.isNorth(value)) return value;
    throw new Error(`${value} NOT 北`);
  }

  static toManzu(value: unknown): 萬子牌 {
    if (this.isManzu(value)) return value;
    throw new Error(`${value} NOT 萬子牌`);
  }

  static toPinzu(value: unknown): 筒子牌 {
    if (this.isPinzu(value)) return value;
    throw new Error(`${value} NOT 筒子牌`);
  }

  static toSouzu(value: unknown): 索子牌 {
    if (this.isSouzu(value)) return value;
    throw new Error(`${value} NOT 索子牌`);
  }

  static toSuits(value: unknown): 数牌 {
    if (this.isSuits(value)) return value;
    throw new Error(`${value} NOT 数牌`);
  }

  static isTile(value: unknown): value is 牌 {
    return Tile.isSuits(value) || Tile.isHonours(value);
  }

  static isManzu(value: unknown): value is 萬子牌 {
    return new RegExp(`^[1-9]${Constants.ManduChar}$`, "g").test(value.toString());
  }

  static isPinzu(value: unknown): value is 筒子牌 {
    return new RegExp(`^[1-9]${Constants.PinduChar}$`, "g").test(value.toString());
  }

  static isSouzu(value: unknown): value is 索子牌 {
    return new RegExp(`^[1-9]${Constants.SouduChar}$`, "g").test(value.toString());
  }

  /**
   * 数牌か
   * @param value
   * @returns
   */
  static isSuits(value: unknown): value is 数牌 {
    return this.isManzu(value) || this.isPinzu(value) || this.isSouzu(value);
  }

  static isEast(value: unknown): value is 東 {
    return value.toString() === `${Constants.EastWindChar}${Constants.KazehaiChar}`;
  }

  static isSouth(value: unknown): value is 南 {
    return value.toString() === `${Constants.SouduChar}${Constants.KazehaiChar}`;
  }

  static isWest(value: unknown): value is 西 {
    return value.toString() === `${Constants.WestWindChar}${Constants.KazehaiChar}`;
  }

  static isNorth(value: unknown): value is 北 {
    return value.toString() === `${Constants.NorthWindChar}${Constants.KazehaiChar}`;
  }

  static isKazehai(value: unknown): value is 四風牌 {
    return this.isEast(value) || this.isSouth(value) || this.isWest(value) || this.isNorth(value);
  }

  static isHaku(value: unknown): value is 白 {
    return value.toString() === `${Constants.WhiteDragonChar}${Constants.SangenpaiChar}`;
  }

  static isHatsu(value: unknown): value is 發 {
    return value.toString() === `${Constants.GreenDragonChar}${Constants.SangenpaiChar}`;
  }

  static isChun(value: unknown): value is 中 {
    return value.toString() === `${Constants.RedDragonChar}${Constants.SangenpaiChar}`;
  }

  static isSangenpai(value: unknown): value is 三元牌 {
    return this.isHaku(value) || this.isHatsu(value) || this.isChun(value);
  }

  static isHonours(value: unknown): value is 字牌 {
    return this.isKazehai(value) || this.isSangenpai(value);
  }

  static isSameColor(tile: 数牌, tile2: 数牌): boolean {
    const color = tile[1];
    const color2 = tile2[1];

    return color == color2;
  }

  static nextTile(pai: 牌): 牌 {
    if (Tile.isSuits(pai)) {
      const tile = new Tile(pai).toSuitsTile();
      const nextNumber = Number(tile.value) + 1;
      return Tile.toSuits(`${nextNumber == 10 ? 1 : nextNumber}${tile.color}`);
    } else if (Tile.isKazehai(pai)) {
      const value = new Tile(pai).toWindTile().value;
      const nextIndex = (Constants.WindChars.indexOf(value) + 1) % Constants.WindChars.length;
      return `${Constants.WindChars[nextIndex]}${Constants.KazehaiChar}`;
    } else if (Tile.isSangenpai(pai)) {
      const value = new Tile(pai).toDragonTile().value;
      const nextIndex = (Constants.DragonChars.indexOf(value) + 1) % Constants.DragonChars.length;
      return `${Constants.DragonChars[nextIndex]}${Constants.SangenpaiChar}`;
    } else {
      throw new Error(pai);
    }
  }

  static sortTiles = (tiles: 牌[]): 牌[] => {
    return new List(tiles)
      .OrderBy((x) => Constants.TileTypeSort.indexOf(new Tile(x).type)) // 2文字目で整列
      .ThenBy((x) => {
        const tile = new Tile(x);

        if (Tile.isSuits(x)) return tile.toSuitsTile().value;
        if (Tile.isKazehai(x)) return Constants.WindChars.indexOf(tile.toWindTile().value);
        if (Tile.isSangenpai(x)) return Constants.DragonChars.indexOf(tile.toDragonTile().value);
        throw new Error(x);
      })
      .ToArray();
  };
}

export class SuitsTile extends Tile {
  constructor(tile: Tile, public readonly value: 数牌の数) {
    super(tile.tile);
  }

  get color(): 数牌の色 {
    return this.type as 数牌の色;
  }
}

export class WindTile extends Tile {
  constructor(tile: Tile, public readonly value: (typeof Constants.WindChars)[number]) {
    super(tile.tile);
  }
}

export class DragonTile extends Tile {
  constructor(tile: Tile, public readonly value: (typeof Constants.DragonChars)[number]) {
    super(tile.tile);
  }
}

export class DrawTile extends Tile {
  constructor(tile: 牌, public readonly kingsTile = false) {
    super(tile);
  }
}

export class DiscardTile extends Tile {
  constructor(tile: 牌, public reach = false, public meld = false) {
    super(tile);
  }
}
