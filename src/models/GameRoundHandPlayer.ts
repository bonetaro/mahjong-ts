import { v4 as uuid } from "uuid";
import { DiscardTile, DrawTile, PlayerHand, Tile } from ".";
import { CustomError, WindNameList, logger } from "../lib";
import { PlayerDirection, 牌 } from "../types";

export class Player {
  constructor(public readonly name: string, public readonly id?: string) {
    this.id = uuid();
  }
}

export class GameRoundHandPlayer extends Player {
  private _discardTiles: DiscardTile[];

  constructor(public index: number, player: Player, public hand = new PlayerHand()) {
    super(player.name);
  }

  get status(): string {
    return `${this.name}の手牌 ${this.hand.status} 捨牌 ${this.discardStatus}`;
  }

  get discardTiles(): DiscardTile[] {
    return this._discardTiles;
  }

  get discardStatus(): string {
    let status = "";

    if (this.discardTiles.length > 0) {
      status = this.discardTiles.map((t) => (t.meld ? `(${Tile.toEmoji(t.tile)})` : Tile.toEmoji(t.tile))).join(" ");
      status += " " + this.discardTiles.map((t) => (t.meld ? `(${Tile.toMoji(t.tile)})` : Tile.toMoji(t.tile))).join(" ");
    }

    return `[${status}]`;
  }

  get windName(): string {
    return `${WindNameList[this.index]}家`;
  }

  get fullName(): string {
    return `${this.windName} ${this.name}`;
  }

  // 下家
  isRightPlayer(player: GameRoundHandPlayer): boolean {
    return (this.index + 1) % 4 == player.index;
  }

  // 対面
  isOppositePlayer(player: GameRoundHandPlayer): boolean {
    return (this.index + 2) % 4 == player.index;
  }

  // 上家
  isLeftPlayer(player: GameRoundHandPlayer): boolean {
    return (this.index + 3) % 4 == player.index;
  }

  getPlayerDirectionOf(player: GameRoundHandPlayer): PlayerDirection {
    if (this.isLeftPlayer(player)) {
      return "toTheLeft";
    } else if (this.isRightPlayer(player)) {
      return "toTheRight";
    } else if (this.isOppositePlayer(player)) {
      return "opposite";
    } else {
      throw new CustomError(player);
    }
  }

  init(): void {
    logger.debug("player init");

    this.hand = new PlayerHand();
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

    logger.info(`${this.name}が${Tile.toEmojiMoji(tile)}を捨てました`, { hand: this.hand.debugStatus(), discards: this.debugDiscardStatus() });
  }

  drawTile(tile: DrawTile) {
    this.hand.drawingTile = tile;

    logger.info(`${this.name}が${tile.kingsTile ? "王牌から" : ""}${Tile.toEmojiMoji(tile.tile)}をツモりました`, this.hand.debugStatus());
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
      emoji: Tile.toEmojiArray(this.hand.tiles),
      moji2: Tile.toMojiArray(this.hand.tiles),
    });
  }
}
