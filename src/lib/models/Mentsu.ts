import { PlayerDirection } from "../Constants";
import { isKanMentsu, toEmoji, toKanji } from "../Functions";
import { 刻子, 槓子, 牌, 面子 } from "../Types";

export interface IMentsu {
  tiles: 牌[];
  status(): string;
  emojiStatus(): string;
  kanjiStatus(): string;
}

export abstract class Mentsu<T extends 面子> implements IMentsu {
  constructor(public mentsu: T) {
    this.tiles = mentsu;
  }

  tiles: 牌[];
  abstract status(): string;
  abstract emojiStatus(): string;
  abstract kanjiStatus(): string;
}

export interface OpenMentsu {
  calledTile: 牌;
  fromPlayerDirection: PlayerDirection;
}

export abstract class KanMentsu extends Mentsu<槓子> {
  constructor(public tile: 牌, public tiles: 槓子) {
    if (!isKanMentsu(tiles)) {
      throw new Error(tiles);
    }

    super(tiles);
  }
  status(): string {
    throw new Error("Method not implemented.");
  }
  kanjiStatus(): string {
    throw new Error("Method not implemented.");
  }
}

// 暗槓
export class AnKanMentsu extends KanMentsu {
  constructor(tile: 牌) {
    super(tile, [tile, tile, tile, tile]);
  }
  status(): string {
    return `暗槓 ${this.emojiStatus()} (${this.kanjiStatus()})`;
  }
  emojiStatus(): string {
    return `${toEmoji(this.tiles[0], true)} ${toEmoji(this.tiles[1])} ${toEmoji(this.tiles[2])} ${toEmoji(this.tiles[3], true)}`;
  }
  kanjiStatus(): string {
    return toKanji(this.tiles[0]);
  }
}

// 順子
// export class Shuntsu extends Mentsu<順子> {
//   status(): string {
//     return "?";
//   }
// }

// 暗刻
export class AnKouMentsu extends Mentsu<刻子> {
  constructor(tile: 牌) {
    super([tile, tile, tile]);
  }

  tiles: 刻子;

  status(): string {
    return `${this.emojiStatus()} (${this.kanjiStatus()})`;
  }

  emojiStatus(): string {
    return `${toEmoji(this.tiles[0])} ${toEmoji(this.tiles[1])} ${toEmoji(this.tiles[2])}`;
  }

  kanjiStatus(): string {
    return toKanji(this.tiles[0]);
  }
}

// export class OpenMentsu extends Mentsu<T> {
//   constructor(public tile: 牌, public tiles: 牌[], public fromPlayerDirection: PlayerDirection) {
//     tiles.push(tile);

//     super(tiles);
//   }

//   status(): string {
//     return "?";
//   }
// }

// 鳴き順子
// export class ChiMentsu implements OpenMentsu {}

// 明刻
export class MinKouMentsu extends Mentsu<刻子> implements OpenMentsu {
  constructor(public tile: 牌, public fromPlayerDirection: PlayerDirection) {
    super([tile, tile, tile]);

    this.calledTile = tile;
  }
  calledTile: 牌;
  tiles: 刻子;
  status(): string {
    return `ポン ${this.emojiStatus()} (${this.kanjiStatus()})`;
  }

  emojiStatus(): string {
    return [...Array(3)]
      .map((_, index) => {
        const text = index == (this.fromPlayerDirection as number) ? `(${toEmoji(this.tile)} )` : toEmoji(this.tile);
        return text;
      })
      .join(" ");
  }

  kanjiStatus(): string {
    return toKanji(this.tile);
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
    return `${this.emojiStatus()} (${this.kanjiStatus()})`;
  }
  emojiStatus(): string {
    // todo fromPlayerDirectionの牌
    return `${toEmoji(this.tiles[0])} ${toEmoji(this.tiles[1])} ${toEmoji(this.tiles[2])} ${toEmoji(this.tile)}`;
  }
}
