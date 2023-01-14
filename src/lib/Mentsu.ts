import { toEmoji, toKanji } from "./Functions";
import { 牌 } from "./Types";
import { PlayerDirection } from "./Constants";

export abstract class Mentsu {
  constructor(public tiles: 牌[]) {}

  abstract status(): string;
}

// 暗槓
export class AnKanMentsu extends Mentsu {
  constructor(tile: 牌) {
    super([tile, tile, tile, tile]);
  }

  status(): string {
    return `${toEmoji(this.tiles[0], true)}` + ` ${toEmoji(this.tiles[1])}` + ` ${toEmoji(this.tiles[2])}` + ` ${toEmoji(this.tiles[3], true)}`;
  }
}

// 順子
export class Shuntsu extends Mentsu {
  status(): string {
    return "?";
  }
}

// 暗刻
export class AnKouMentsu extends Mentsu {
  status(): string {
    return "?";
  }
}

export class OpenMentsu extends Mentsu {
  constructor(public tile: 牌, public tiles: 牌[], public fromPlayerDirection: PlayerDirection) {
    tiles.push(tile);

    super(tiles);
  }

  status(): string {
    return "?";
  }
}

// 鳴き順子
export class ChiMentsu extends OpenMentsu {}

// 明刻
export class MinKouMentsu extends OpenMentsu {
  constructor(tile: 牌, fromPlayerDirection: PlayerDirection) {
    super(tile, [tile, tile], fromPlayerDirection);
  }

  status(): string {
    return [...Array(3)]
      .map((_, index) => {
        const text = index == (this.fromPlayerDirection as number) ? `(${toEmoji(this.tile)} )` : toEmoji(this.tile);
        return text;
      })
      .join(" ");
  }

  statusKanji(): string {
    return [...Array(3)]
      .map((_, index) => {
        const text = index == (this.fromPlayerDirection as number) ? `(${toKanji(this.tile)} )` : toKanji(this.tile);
        return text;
      })
      .join(" ");
  }
}

// 明槓
export class MinKanMentsu extends OpenMentsu {
  constructor(tile: 牌, fromPlayerDirection: PlayerDirection) {
    super(tile, [tile, tile, tile], fromPlayerDirection);
  }

  status(): string {
    return `${toEmoji(this.tiles[0])}` + ` ${toEmoji(this.tiles[1])}` + ` ${toEmoji(this.tiles[2])}` + ` ${toEmoji(this.tile)}`;
  }
}
