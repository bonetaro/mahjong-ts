import { v4 as uuid } from "uuid";
import { Hand, DrawTile } from "./";
import { WindNames, logger, toEmojiFromArray, toMojiFromArray, toEmojiMoji, 牌 } from "../";
import { PlayerDirection } from "../Types";
import { DiscardTile } from "./Tile";

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
  private _discardTiles: DiscardTile[];

  constructor(player: Player, public index: number, public hand = new Hand()) {
    super(player.name, player.id);
  }

  get discardTiles(): DiscardTile[] {
    return this._discardTiles;
  }

  get windName(): string {
    return `${WindNames[this.index]}家`;
  }

  get fullName(): string {
    return `${this.windName} ${this.name}`;
  }

  // 上家
  isLeftPlayer(player: RoundHandPlayer): boolean {
    return (this.index + 1) % 4 == player.index;
  }

  // 下家
  isRightPlayer(player: RoundHandPlayer): boolean {
    return (this.index - 1) % 4 == player.index;
  }

  getPlayerDirectionOf(player: RoundHandPlayer): PlayerDirection {
    if (this.isLeftPlayer(player)) {
      return PlayerDirection.ToTheLeft;
    } else if (this.isRightPlayer(player)) {
      return PlayerDirection.ToTheRight;
    } else {
      return PlayerDirection.Opposite;
    }
  }

  init(): void {
    logger.debug("player init");

    this.hand = new Hand();
    this._discardTiles = [];
  }

  get discardStatus(): string {
    if (this.discardTiles.length == 0) {
      return "";
    }

    return `${toEmojiFromArray(this.discardTiles.map((t) => t.tile))} (${toMojiFromArray(this.discardTiles.map((t) => t.tile))})`;
  }

  doDiscard(tile: 牌): void {
    this._discardTiles.push(new DiscardTile(tile));

    const index = this.hand.tiles.indexOf(tile);
    this.hand.tiles.splice(index, 1);

    logger.info(`${this.name}が${toEmojiMoji(tile)}を捨てました`, this.hand.debugStatus());
  }

  drawTile(tile: DrawTile) {
    this.hand.drawingTile = tile;

    logger.info(`${this.name}が${tile.kingsTile ? "王牌から" : ""}${toEmojiMoji(tile.tile)}をツモりました`, this.hand.debugStatus());
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
      moji2: toMojiFromArray(this.hand.tiles),
    });
  }

  get status(): string {
    return `${this.name}の手牌 [${this.hand.status}] 捨牌 [${this.discardStatus}]`;
  }
}
