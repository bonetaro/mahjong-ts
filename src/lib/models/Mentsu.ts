import { toEmoji, toMoji, sortTiles } from "../functions";
import { 数牌, 刻子like, 塔子like, 槓子like, 牌, 面子like, 順子like, 数牌の色, 順子, PlayerDirection } from "../Types";
import { CustomError } from "../CustomError";
import { Tile } from "./Tile";

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

  // export function isShuntsuMentsu<C extends 数牌の色>(values: unknown[]): values is 順子<C> {
  //   return values.every((x) => isSuits(x)
  // }

  // 順子のメンツか。順子は英語でRun
  static isRunMentsu<T extends 数牌の色>(tiles: 順子like): tiles is 順子<T> {
    if (!tiles.every((tile) => Tile.isSameColor(tiles[0], tile))) {
      return false;
    }

    const sortedTiles = sortTiles(tiles);
    const firstTileNum = Number(sortedTiles[0][0]);

    return Number(sortedTiles[1][0]) == firstTileNum + 1 && Number(sortedTiles[2][0]) == firstTileNum + 2;
  }
}

export interface OpenMentsu {
  get calledTile(): 牌;
  get fromPlayerDirection(): PlayerDirection;
}

class KanMentsu extends Mentsu<槓子like> {
  constructor(tile: 牌) {
    const tiles = [tile, tile, tile, tile];

    if (Mentsu.isKanMentsu(tiles)) {
      super(tiles);
    } else {
      throw new CustomError(tiles);
    }
  }

  emojiStatus(): string {
    throw new Error("Method not implemented.");
  }
  mojiStatus(): string {
    throw new Error("Method not implemented.");
  }
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
    return this.tiles.map((tile, index) => toEmoji(tile, index == 0 || index == 3)).join(" ");
  }
  mojiStatus(): string {
    return toMoji(this.tiles[0]);
  }
}

// 暗刻
export class AnKouMentsu extends KoutsuMentsu {
  constructor(tile: 牌) {
    super(tile);
  }

  emojiStatus(): string {
    return this.tiles.map((tile) => toEmoji(tile)).join(" ");
  }
  mojiStatus(): string {
    return toMoji(this.tiles[0]);
  }
}

// 鳴き順子（チー面子）。上家からしか鳴けないので、fromDirectionは上家固定
export class ChiMentsu extends Mentsu<順子like> implements OpenMentsu {
  constructor(public readonly calledTile: 数牌, tartsTiles: 塔子like, public fromPlayerDirection: PlayerDirection = "toTheLeft") {
    super([calledTile].concat(tartsTiles) as 順子like);
  }

  emojiStatus(): string {
    return this.tiles
      .map((tile) => {
        const text = tile == this.calledTile ? `(${toEmoji(tile)} )` : toEmoji(tile);
        return text;
      })
      .join(" ");
  }
  mojiStatus(): string {
    return this.tiles.map((tile) => toMoji(tile)).join("");
  }
}

// 明刻
export class MinKouMentsu extends KoutsuMentsu implements OpenMentsu {
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
    return [...Array(3)]
      .map((_, index) => {
        const text = index + Number(this.fromPlayerDirection) == 3 ? `(${toEmoji(this.calledTile)} )` : toEmoji(this.calledTile);
        return text;
      })
      .join(" ");
  }

  mojiStatus(): string {
    return toMoji(this.calledTile);
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
          ? `(${toEmoji(tile)} )` // 絵文字が重なってしまうため、半角空白をいれる
          : toEmoji(tile);
      })
      .join(" ");
  }
  mojiStatus(): string {
    return toMoji(this.tiles[0]);
  }
}
