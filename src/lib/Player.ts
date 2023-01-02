import { logger } from "../logging";
import { Hand } from "./Hand";
import { 牌 } from "./Types";
import { toEmojiFromArray, toKanjiFromArray } from "./Functions";

export class Player {
  private _name: string;
  private _hand: Array<牌> = [];

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get hand(): Hand {
    return new Hand(this._hand);
  }

  drawTiles(tiles: Array<牌>) {
    this._hand.push(...tiles);

    logger.info(`${this.name}が牌を${tiles.length}枚とりました`, {
      tiles: this.hand.tiles,
      length: this.hand.tiles.length,
    });
  }

  sortHandTiles(): void {
    this._hand = new Hand(this._hand).sort();

    logger.info(`${this.name}が牌を並び替えました`, {
      tiles: this.hand.tiles.join(""),
      length: this.hand.tiles.length,
      emoji: toEmojiFromArray(this.hand.tiles),
      kanji: toKanjiFromArray(this.hand.tiles),
    });
  }
}
