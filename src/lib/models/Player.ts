import { v4 as uuid } from "uuid";
import { Hand, DrawTile, DiscardTile } from "./";
import { WindNames, logger, toEmojiFromArray, toMojiFromArray, toEmojiMoji, 牌, PlayerDirection, throwErrorAndLogging } from "../";

export class Player {
  constructor(public readonly name: string, public readonly id?: string) {
    this.id = uuid();
  }
}

export class RoundHandPlayer extends Player {
  private _discardTiles: DiscardTile[];

  constructor(public index: number, player: Player, public hand = new Hand()) {
    super(player.name);
  }

  get status(): string {
    return `${this.name}の手牌 [${this.hand.status}] 捨牌 [${this.discardStatus}]`;
  }

  get discardTiles(): DiscardTile[] {
    return this._discardTiles;
  }

  get discardStatus(): string {
    if (this.discardTiles.length == 0) {
      return "";
    }

    return `${toEmojiFromArray(this.discardTiles.map((t) => t.tile))} (${toMojiFromArray(this.discardTiles.map((t) => t.tile))})`;
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

  // 対面
  isOppositePlayer(player: RoundHandPlayer): boolean {
    return (this.index + 2) % 4 == player.index;
  }

  getPlayerDirectionOf(player: RoundHandPlayer): PlayerDirection {
    if (this.isLeftPlayer(player)) {
      return PlayerDirection.ToTheLeft;
    } else if (this.isRightPlayer(player)) {
      return PlayerDirection.ToTheRight;
    } else if (this.isOppositePlayer(player)) {
      return PlayerDirection.Opposite;
    } else {
      throwErrorAndLogging(player);
    }
  }

  init(): void {
    logger.debug("player init");

    this.hand = new Hand();
    this._discardTiles = [];
  }

  debugDiscardStatus(): any {
    return {
      discards: this.discardStatus,
      length: this._discardTiles.length,
    };
  }

  doDiscard(tile: 牌): void {
    const index = this.hand.tiles.indexOf(tile);
    this.hand.tiles.splice(index, 1);

    this._discardTiles.push(new DiscardTile(tile));

    logger.info(`${this.name}が${toEmojiMoji(tile)}を捨てました`, { hand: this.hand.debugStatus(), discards: this.debugDiscardStatus() });
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
}
