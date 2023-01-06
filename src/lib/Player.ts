import { List } from "linqts";
import { logger } from "../logging";
import { Hand } from "./Hand";
import { 牌 } from "./Types";
import { toEmojiFromArray, toKanjiFromArray, toMoji } from "./Functions";

export class Player {
  private _name: string;
  private _hand: Hand;
  private _discardTiles: Array<牌> = [];

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get hand(): Hand {
    return this._hand;
  }

  init(): void {
    logger.debug("player init");

    this._hand = new Hand();
  }

  show(): void {
    logger.info(`${this.name}`, {
      hand: toEmojiFromArray(this.hand.tiles),
      discard: toEmojiFromArray(this._discardTiles),
    });
  }

  get handStatus(): string {
    return this._hand.status;
  }

  get discardStatus(): string {
    return (
      `[${toEmojiFromArray(this._discardTiles)}]` +
      " " +
      `[${toKanjiFromArray(this._discardTiles)}]`
    );
  }

  doDiscard(num: number): 牌 {
    const tile = this._hand.tiles[num];

    this._discardTiles.push(tile);
    this._hand = new Hand(
      new List(this._hand.tiles).Where((_, index) => index != num).ToArray()
    );

    logger.info(`${this.name}が${toMoji(tile)}を捨てました`);

    return tile;
  }

  drawTile(tile: 牌) {
    this._hand.tiles.push(tile);

    logger.info(`${this.name}が${toMoji(tile)}をツモりました`);
  }

  drawTiles(tiles: Array<牌>) {
    tiles.forEach((tile) => this._hand.tiles.push(tile));

    logger.debug(`${this.name}が牌を${tiles.length}枚とりました`, {
      tiles: this.hand.tiles,
      length: this.hand.tiles.length,
    });
  }

  sortHandTiles(): void {
    this._hand = new Hand(this._hand.sort());

    logger.debug(`${this.name}が牌を並び替えました`, {
      tiles: this.hand.tiles.join(""),
      length: this.hand.tiles.length,
      emoji: toEmojiFromArray(this.hand.tiles),
      kanji: toKanjiFromArray(this.hand.tiles),
    });
  }
}
