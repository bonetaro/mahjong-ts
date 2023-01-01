import { logger } from "./logging";
import { Hand } from "./Hand";
import { 牌 } from "./Types";
import { toVisualFromArray, toKanjiFromArray } from "./Functions";

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

  takeTiles(tiles: Array<牌>) {
    this._hand.push(...tiles);

    logger.info(`${this.name}が牌を${tiles.length}枚とる`, {
      tiles: this.hand.tiles,
      length: this.hand.tiles.length,
    });
  }

  sortTiles(): void {
    this._hand = new Hand(this._hand).sort();

    logger.info(`${this.name}が牌を並び替える`, {
      tiles: this.hand.tiles.join(""),
      length: this.hand.tiles.length,
      visual: toVisualFromArray(this.hand.tiles),
      kanji: toKanjiFromArray(this.hand.tiles),
    });
  }
}
