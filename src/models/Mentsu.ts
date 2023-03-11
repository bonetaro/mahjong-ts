import { 牌, 面子like, 槓子like, 刻子like, 数牌の色, 順子like, 順子, PlayerDirection, 数牌, 塔子like, 塔子 } from "../types";
import { CustomError } from "../lib";
import { Tile } from "./";
import { PlayerDirectionList } from "../constants";
import { logger } from "../lib/logging";

export interface IMentsu {
  get tiles(): 牌[];

  status(): string;

  emojiStatus(): string;

  mojiStatus(): string;
}

export abstract class Mentsu<T extends 面子like> implements IMentsu {
  protected _tiles: 牌[];

  constructor(public mentsu: T) {
    this._tiles = mentsu;
  }

  get tiles(): 牌[] {
    return this._tiles;
  }

  status(): string {
    return `${this.emojiStatus()} (${this.mojiStatus()})`;
  }
  abstract emojiStatus(): string;

  abstract mojiStatus(): string;

  static isKanMentsu(values: unknown[]): values is 槓子like {
    return values.length === 4 && values.every((v) => Tile.isTile(v)) && values.every((v) => v == values[0]);
  }

  static isKoutsuMentsu(values: unknown[]): values is 刻子like {
    return values.length === 3 && values.every((v) => Tile.isTile(v)) && values.every((v) => v == values[0]);
  }

  static isTatsu<T extends 数牌の色>(tiles: 塔子like): tiles is 塔子<T> {
    if (!tiles.every((tile) => Tile.isSameColor(tiles[0], tile))) {
      return false;
    }

    const sortedTiles = Tile.sortTiles(tiles);
    const firstTileNum = Number(new Tile(sortedTiles[0]).toSuitsTile().value);
    const secondTileNum = Number(new Tile(sortedTiles[1]).toSuitsTile().value);

    // todo 実装不十分
    return secondTileNum == firstTileNum + 1 || secondTileNum == firstTileNum + 2;
  }

  // 順子のメンツか。順子は英語でRun
  static isRunMentsu<T extends 数牌の色>(tiles: 牌[]): tiles is 順子<T> {
    if (!tiles.every((tile) => Tile.isSuits(tile) && Tile.isSameColor(tiles[0] as 数牌, tile))) {
      return false;
    }

    const sortedTiles = Tile.sortTiles(tiles);
    const firstTileNum = Number(sortedTiles[0][0]);

    return Number(sortedTiles[1][0]) == firstTileNum + 1 && Number(sortedTiles[2][0]) == firstTileNum + 2;
  }
}

export interface OpenMentsu {
  get calledTile(): 牌;
  get fromPlayerDirection(): PlayerDirection;
}

abstract class KanMentsu extends Mentsu<槓子like> {
  constructor(tile: 牌) {
    const tiles = [tile, tile, tile, tile];

    if (Mentsu.isKanMentsu(tiles)) {
      super(tiles);
    } else {
      throw new CustomError(tiles);
    }
  }

  abstract emojiStatus(): string;

  abstract mojiStatus(): string;
}

abstract class KoutsuMentsu extends Mentsu<刻子like> {
  constructor(tile: 牌) {
    const tiles = [tile, tile, tile];

    if (Mentsu.isKoutsuMentsu(tiles)) {
      super(tiles);
    } else {
      throw new CustomError(tiles);
    }
  }

  abstract emojiStatus(): string;
  abstract mojiStatus(): string;
}

// 暗槓
export class AnKanMentsu extends KanMentsu {
  constructor(tile: 牌) {
    super(tile);
  }

  emojiStatus(): string {
    return this.tiles.map((tile, index) => Tile.toEmoji(tile, index == 0 || index == 3)).join(" ");
  }

  mojiStatus(): string {
    return Tile.toMoji(this.tiles[0]);
  }
}

// 暗刻
export class AnKouMentsu extends KoutsuMentsu {
  constructor(tile: 牌) {
    super(tile);
  }

  emojiStatus(): string {
    return this.tiles.map((tile) => Tile.toEmoji(tile)).join(" ");
  }

  mojiStatus(): string {
    return Tile.toMoji(this.tiles[0]);
  }
}

// 鳴き順子（チー面子）。上家からしか鳴けないので、fromDirectionは上家固定
export class ChiMentsu extends Mentsu<順子like> implements OpenMentsu {
  constructor(public readonly calledTile: 数牌, tartsTiles: 塔子like) {
    super([calledTile].concat(tartsTiles) as 順子like);
  }

  get fromPlayerDirection(): PlayerDirection {
    return "toTheLeft";
  }

  emojiStatus(): string {
    return this.tiles
      .map((tile) => {
        const text = tile == this.calledTile ? `(${Tile.toEmoji(tile)} )` : Tile.toEmoji(tile);
        return text;
      })
      .join(" ");
  }

  mojiStatus(): string {
    return this.tiles.map((tile) => Tile.toMoji(tile)).join("");
  }
}

// 明刻
export class MinKouMentsu extends KoutsuMentsu implements OpenMentsu {
  constructor(public readonly calledTile: 牌, public readonly fromPlayerDirection: PlayerDirection) {
    super(calledTile);
  }

  emojiStatus(): string {
    return [...Array(3)]
      .map((_, index) => {
        const text = index == PlayerDirectionList.indexOf(this.fromPlayerDirection) ? `(${Tile.toEmoji(this.calledTile)} )` : Tile.toEmoji(this.calledTile);
        return text;
      })
      .join(" ");
  }

  mojiStatus(): string {
    return Tile.toMoji(this.calledTile);
  }
}

// 明槓
export class MinKanMentsu extends KanMentsu implements OpenMentsu {
  private _calledTile: 牌;
  private _fromPlayerDirection: PlayerDirection;

  constructor(calledTile: 牌, fromPlayerDirection: PlayerDirection) {
    super(calledTile);

    this._calledTile = calledTile;
    this._fromPlayerDirection = fromPlayerDirection;
  }

  get calledTile(): 牌 {
    return this._calledTile;
  }

  get fromPlayerDirection(): PlayerDirection {
    return this._fromPlayerDirection;
  }

  emojiStatus(): string {
    // todo 対面から明槓のときの横向きにする牌の位置を確認
    return this.tiles
      .map((tile, index) => {
        return (index == 0 && this.fromPlayerDirection == "toTheLeft") ||
          (index == 1 && this.fromPlayerDirection == "opposite") ||
          (index == 3 && this.fromPlayerDirection == "toTheRight")
          ? `(${Tile.toEmoji(tile)} )` // 絵文字が重なってしまうため、半角空白をいれる
          : Tile.toEmoji(tile);
      })
      .join(" ");
  }

  mojiStatus(): string {
    return Tile.toMoji(this.tiles[0]);
  }
}
