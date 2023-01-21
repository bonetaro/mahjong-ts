import { isKanMentsu, toEmoji, sortTiles, toMoji } from "../Functions";
import { PlayerDirection, 数牌, 刻子like, 塔子like, 槓子like, 牌, 面子like, 順子like } from "../Types";
import { throwErrorAndLogging } from "../error";

export interface IMentsu {
  tiles: 牌[];
  status(): string;
  emojiStatus(): string;
  mojiStatus(): string;
}

export abstract class Mentsu<T extends 面子like> implements IMentsu {
  constructor(public mentsu: T) {
    this.tiles = mentsu;
  }

  tiles: 牌[];
  abstract status(): string;
  abstract emojiStatus(): string;
  abstract mojiStatus(): string;
}

export interface OpenMentsu {
  calledTile: 牌;
  fromPlayerDirection: PlayerDirection;
}

export abstract class KanMentsu extends Mentsu<槓子like> {
  constructor(public tile: 牌, public tiles: 槓子like) {
    if (!isKanMentsu(tiles)) {
      throwErrorAndLogging(tiles);
    }

    super(tiles);
  }
  status(): string {
    throw new Error("Method not implemented.");
  }
  mojiStatus(): string {
    throw new Error("Method not implemented.");
  }
}

// 暗槓
export class AnKanMentsu extends KanMentsu {
  constructor(tile: 牌) {
    super(tile, [tile, tile, tile, tile]);
  }
  status(): string {
    return `${this.emojiStatus()} (${this.mojiStatus()})`;
  }
  emojiStatus(): string {
    return `${toEmoji(this.tiles[0], true)} ${toEmoji(this.tiles[1])} ${toEmoji(this.tiles[2])} ${toEmoji(this.tiles[3], true)}`;
  }
  mojiStatus(): string {
    return toMoji(this.tiles[0]);
  }
}

// 暗刻
export class AnKouMentsu extends Mentsu<刻子like> {
  constructor(tile: 牌) {
    super([tile, tile, tile]);
  }

  tiles: 刻子like;

  status(): string {
    return `${this.emojiStatus()} (${this.mojiStatus()})`;
  }

  emojiStatus(): string {
    return `${toEmoji(this.tiles[0])} ${toEmoji(this.tiles[1])} ${toEmoji(this.tiles[2])}`;
  }

  mojiStatus(): string {
    return toMoji(this.tiles[0]);
  }
}

// 鳴き順子（チー面子）。上家からしか鳴けないので、fromDirectionは上家固定
export class ChiMentsu extends Mentsu<順子like> implements OpenMentsu {
  constructor(public readonly calledTile: 数牌, tartsTiles: 塔子like, public fromPlayerDirection = PlayerDirection.ToTheLeft) {
    super([calledTile].concat(tartsTiles) as 順子like);
  }

  status(): string {
    return `${this.emojiStatus()} (${this.mojiStatus()})`;
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
export class MinKouMentsu extends Mentsu<刻子like> implements OpenMentsu {
  constructor(public tile: 牌, public fromPlayerDirection: PlayerDirection) {
    super([tile, tile, tile]);

    this.calledTile = tile;
  }
  calledTile: 牌;
  tiles: 刻子like;
  status(): string {
    return `${this.emojiStatus()} (${this.mojiStatus()})`;
  }

  emojiStatus(): string {
    return [...Array(3)]
      .map((_, index) => {
        const text = index == (this.fromPlayerDirection as number) ? `(${toEmoji(this.tile)} )` : toEmoji(this.tile);
        return text;
      })
      .join(" ");
  }

  mojiStatus(): string {
    return toMoji(this.tile);
  }
}

// 明槓
export class MinKanMentsu extends KanMentsu implements OpenMentsu {
  constructor(public tile: 牌, public fromPlayerDirection: PlayerDirection) {
    super(tile, [tile, tile, tile, tile]);

    this.calledTile = tile;
  }
  calledTile: 牌;
  status(): string {
    return `${this.emojiStatus()} (${this.mojiStatus()})`;
  }
  emojiStatus(): string {
    // todo fromPlayerDirectionの牌
    return this.tiles
      .map((tile, index) => {
        return (index == 0 && this.fromPlayerDirection == PlayerDirection.ToTheLeft) ||
          (index == 1 && this.fromPlayerDirection == PlayerDirection.Opposite) ||
          (index == 3 && this.fromPlayerDirection == PlayerDirection.ToTheRight)
          ? `(${toEmoji(tile)})`
          : toEmoji(tile);
      })
      .join(" ");
  }
}
