import { WindsLabel } from "./constants";
import { logger } from "../logging";
import { Hand } from "./Hand";
import { Tile } from "./Tile";
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
    this._discardTiles = [];
  }

  show(): void {
    logger.info(`${this.name}`, {
      hand: toEmojiFromArray(this.hand.tiles),
      discard: toEmojiFromArray(this._discardTiles),
    });
  }

  get discardStatus(): string {
    if (this._discardTiles.length == 0) {
      return "[]";
    }

    return `[${toEmojiFromArray(this._discardTiles)}]` + " " + `[${toKanjiFromArray(this._discardTiles)}]`;
  }

  doDiscard(tile: 牌): void {
    this._discardTiles.push(tile);

    const index = this._hand.tiles.indexOf(tile);
    this._hand.tiles.splice(index, 1);

    logger.info(`${this.name}が${toMoji(tile)}を捨てました`, this.hand.debugStatus());
  }

  drawTile(tile: Tile) {
    this._hand.drawingTile = tile;

    logger.info(`${this.name}が${toMoji(tile.tile)}をツモりました`, this.hand.debugStatus());
  }

  drawTiles(tiles: Array<牌>) {
    tiles.forEach((tile) => this._hand.tiles.push(tile));

    logger.debug(`${this.name}が牌を${tiles.length}枚とりました`, {
      tiles: this.hand.tiles,
      length: this.hand.tiles.length,
    });
  }

  sortHandTiles(): void {
    this._hand.tiles = this._hand.sortTiles();

    logger.debug(`${this.name}が牌を並び替えました`, {
      tiles: this.hand.tiles.join(""),
      length: this.hand.tiles.length,
      emoji: toEmojiFromArray(this.hand.tiles),
      kanji: toKanjiFromArray(this.hand.tiles),
    });
  }
}

export class RoundHandPlayer {
  private _index: number;

  constructor(public player: Player, index: number) {
    this._index = index;
  }

  get windName(): string {
    return `${WindsLabel[this._index]}家`;
  }
}
