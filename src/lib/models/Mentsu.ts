import { isKanMentsu, toEmoji, toMoji, isKoutsuMentsu } from "../Functions";
import { PlayerDirection, 数牌, 刻子like, 塔子like, 槓子like, 牌, 面子like, 順子like } from "../Types";
import { throwErrorAndLogging } from "../error";

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
}

export interface OpenMentsu {
  get calledTile(): 牌;
  get fromPlayerDirection(): PlayerDirection;
}

class KanMentsu extends Mentsu<槓子like> {
  constructor(tile: 牌) {
    const tiles = [tile, tile, tile, tile];

    if (isKanMentsu(tiles)) {
      super(tiles);
    } else {
      throwErrorAndLogging(tiles);
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

    if (isKoutsuMentsu(tiles)) {
      super(tiles);
    } else {
      throwErrorAndLogging(tiles);
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
  constructor(public readonly calledTile: 数牌, tartsTiles: 塔子like, public readonly fromPlayerDirection = PlayerDirection.ToTheLeft) {
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
        return (index == 0 && this.fromPlayerDirection == PlayerDirection.ToTheLeft) ||
          (index == 1 && this.fromPlayerDirection == PlayerDirection.Opposite) ||
          (index == 3 && this.fromPlayerDirection == PlayerDirection.ToTheRight)
          ? `(${toEmoji(tile)} )` // 絵文字が重なってしまうため、半角空白をいれる
          : toEmoji(tile);
      })
      .join(" ");
  }
  mojiStatus(): string {
    return toMoji(this.tiles[0]);
  }
}
