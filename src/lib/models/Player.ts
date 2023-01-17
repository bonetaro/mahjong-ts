import { v4 as uuid } from "uuid";
import { Hand, Tile } from "./";
import { WindsLabel, logger, toEmojiFromArray, toKanjiFromArray, toMoji, 牌 } from "../";

export class Player {
  protected _id: string;

  constructor(public readonly name: string, id?: string) {
    this._id = id ?? uuid();
  }

  get id(): string {
    return this._id;
  }
}

export class RoundHandPlayer extends Player {
  constructor(player: Player, public index: number, public hand = new Hand(), public discardTiles: 牌[] = []) {
    super(player.name, player.id);
  }

  get windName(): string {
    return `${WindsLabel[this.index]}家`;
  }

  get fullName(): string {
    return `${this.windName} ${this.name}`;
  }

  isLeftPlayer(player: RoundHandPlayer): boolean {
    return (this.index + 1) % 4 == player.index;
  }
  init(): void {
    logger.debug("player init");

    this.hand = new Hand();
    this.discardTiles = [];
  }

  status(): void {
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

    logger.info(`${this.name}が${tile.kingsTile ? "王牌から" : ""}${toMoji(tile.tile)}をツモりました`, this.hand.debugStatus());
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
