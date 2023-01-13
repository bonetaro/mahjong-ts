import { toEmoji } from "./Functions";
import { Player } from "./Player";
import { 牌 } from "./Types";

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
    return (
      `${toEmoji(this.tiles[0], true)}` +
      ` ${toEmoji(this.tiles[1])}` +
      ` ${toEmoji(this.tiles[2])}` +
      ` ${toEmoji(this.tiles[3], true)}`
    );
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
  constructor(public tile: 牌, public tiles: 牌[], public fromPlayer: Player) {
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
  constructor(tile: 牌, fromPlayer: Player) {
    super(tile, [tile, tile], fromPlayer);
  }

  status(): string {
    return (
      `${toEmoji(this.tiles[0])}` +
      ` ${toEmoji(this.tiles[1])}` +
      ` ${toEmoji(this.tile)}`
    );
  }
}

// 明槓
export class MinKanMentsu extends OpenMentsu {
  constructor(tile: 牌, fromPlayer: Player) {
    super(tile, [tile, tile, tile], fromPlayer);
  }

  status(): string {
    return (
      `${toEmoji(this.tiles[0])}` +
      ` ${toEmoji(this.tiles[1])}` +
      ` ${toEmoji(this.tiles[2])}` +
      ` ${toEmoji(this.tile)}`
    );
  }
}
