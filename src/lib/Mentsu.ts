import { toEmoji } from "./Functions";
import { Player } from "./Player";
import { 牌 } from "./Types";

export abstract class Mentsu {
  abstract status(): string;
}

// 暗槓
export class AnKanMentsu extends Mentsu {
  private _tiles: 牌[];

  constructor(tiles: 牌[]) {
    super();

    this._tiles = tiles;
  }

  status(): string {
    return (
      `${toEmoji(this._tiles[0], true)}` +
      ` ${toEmoji(this._tiles[1])}` +
      ` ${toEmoji(this._tiles[2])}` +
      ` ${toEmoji(this._tiles[3], true)}`
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
  private _fromPlayer: Player;
  private _tile: 牌;
  private _tiles: 牌[];

  constructor(tile: 牌, tiles: 牌[], player: Player) {
    super();

    this._fromPlayer = player;
    this._tile = tile;
    this._tiles = tiles;
  }

  status(): string {
    return "?";
  }
}

// 鳴き順子
export class ChiMentsu extends OpenMentsu {}

// 明刻
export class MinKouMentsu extends OpenMentsu {}

// 明槓
export class MinKanMentsu extends OpenMentsu {}