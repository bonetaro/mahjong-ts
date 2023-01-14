import { WindsLabel } from "../constants";
import { logger } from "../logging";
import { Hand } from "./Hand";
import { Tile } from "./Tile";
import { 牌 } from "../Types";
import { toEmojiFromArray, toKanjiFromArray, toMoji } from "../Functions";
import { v4 as uuid } from "uuid";

export class Player {
  protected _id: string;
  protected _name: string;

  constructor(name: string, public hand = new Hand(), public discardTiles: 牌[] = []) {
    this._id = uuid();
    this._name = name;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  init(): void {
    logger.debug("player init");

    this.hand = new Hand();
    this.discardTiles = [];
  }

  show(): void {
    logger.info(`${this.name}`, {
      hand: toEmojiFromArray(this.hand.tiles),
      discard: toEmojiFromArray(this.discardTiles),
    });
  }

  get discardStatus(): string {
    if (this.discardTiles.length == 0) {
      return "[]";
    }

    return `[${toEmojiFromArray(this.discardTiles)} (${toKanjiFromArray(this.discardTiles)})]`;
  }

  doDiscard(tile: 牌): void {
    this.discardTiles.push(tile);

    const index = this.hand.tiles.indexOf(tile);
    this.hand.tiles.splice(index, 1);

    logger.info(`${this.name}が${toMoji(tile)}を捨てました`, this.hand.debugStatus());
  }

  drawTile(tile: Tile) {
    this.hand.drawingTile = tile;

    logger.info(`${this.name}が${toMoji(tile.tile)}をツモりました`, this.hand.debugStatus());
  }

  drawTiles(tiles: Array<牌>) {
    this.hand.tiles = this.hand.tiles.concat(tiles);

    logger.debug(`${this.name}が牌を${tiles.length}枚とりました`, {
      tiles: this.hand.tiles,
      length: this.hand.tiles.length,
    });
  }

  sortHandTiles(): void {
    this.hand.tiles = this.hand.sortTiles();

    logger.debug(`${this.name}が牌を並び替えました`, {
      tiles: this.hand.tiles.join(""),
      length: this.hand.tiles.length,
      emoji: toEmojiFromArray(this.hand.tiles),
      kanji: toKanjiFromArray(this.hand.tiles),
    });
  }
}

export class RoundHandPlayer extends Player {
  constructor(player: Player, public index: number) {
    super(player.name);

    this._id = player.id;
    this.hand = player.hand;
    this.discardTiles = player.discardTiles;
  }

  get windName(): string {
    return `${WindsLabel[this.index]}家`;
  }

  get fullName(): string {
    return `${this.windName} ${this.name}`;
  }
}
