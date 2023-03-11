import { v4 as uuid } from "uuid";
import { DiscardTile, DrawTile, PlayerHand, Tile } from ".";
import { CustomError, logger } from "../lib";
import { PlayerDirection, PlayerIndex, isPlayerIndex, 牌 } from "../types";
import { PlayerDirectionList, WindNameList } from "../constants";

export class Player {
  private _id;

  constructor(public readonly name: string) {
    this._id = uuid();
  }

  get id() {
    return this._id;
  }
}

export class GameRoundHandPlayer extends Player {
  private _discardTiles: DiscardTile[];

  constructor(player: Player, public index: number, public hand = new PlayerHand()) {
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
      status = this.discardTiles.map((t) => (t.meld ? `(${Tile.toEmoji(t.tile)} )` : Tile.toEmoji(t.tile))).join(" ");
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

  calculateIndex(direction: PlayerDirection): PlayerIndex {
    const index = (this.index + PlayerDirectionList.indexOf(direction)) % PlayerDirectionList.length;
    if (isPlayerIndex(index)) {
      return index;
    }
  }

  // (thisがwhomの)下家
  isRightPlayerOf(whom: GameRoundHandPlayer): boolean {
    return this.index == whom.calculateIndex("toTheRight");
  }

  // (thisがwhomの)対面
  isOppositePlayerOf(whom: GameRoundHandPlayer): boolean {
    return this.index == whom.calculateIndex("opposite");
  }

  // (thisがwhomの)上家
  isLeftPlayerOf(whom: GameRoundHandPlayer): boolean {
    return this.index == whom.calculateIndex("toTheLeft");
  }

  getDirectionOf(whom: GameRoundHandPlayer): PlayerDirection {
    if (this.isLeftPlayerOf(whom)) {
      return "toTheLeft";
    } else if (this.isRightPlayerOf(whom)) {
      return "toTheRight";
    } else if (this.isOppositePlayerOf(whom)) {
      return "opposite";
    } else {
      throw new CustomError(whom);
    }
  }

  init(): void {
    logger.debug(`${this.fullName} GameRoundHandPlayer init`);

    this.hand = new PlayerHand();
    this._discardTiles = [];
  }

  debugDiscardStatus(): any {
    return {
      tiles: this.discardStatus,
      length: this._discardTiles.length,
    };
  }

  discardTile(tile: 牌): void {
    this.hand.discardTile(tile);

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
