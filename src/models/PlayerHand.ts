import { DrawTile, IMentsu, Tile } from ".";
import { CustomError } from "../lib";
import { SubShantenCalculator } from "../lib/calculator";
import { 牌 } from "../types";

export class PlayerHand {
  private _tiles: 牌[];
  private _openMentsuList: IMentsu[] = [];
  private _drawingTile: DrawTile | null;

  constructor(hand: PlayerHand);
  constructor(tile?: string);
  constructor(tiles?: 牌[]);
  constructor(something?: string | 牌[] | PlayerHand) {
    this._tiles = [];

    if (Array.isArray(something)) {
      const tiles: 牌[] = something;

      if (tiles.length > 0 && tiles.length !== 13) {
        throw new CustomError("hand tiles count must be 13", tiles);
      }

      this._tiles = tiles;
    } else if (typeof something === "string") {
      this._tiles = PlayerHand.parse(something);
    } else if (something instanceof PlayerHand) {
      this._tiles = [...something.tiles];
      this.openMentsuList = [...something.openMentsuList];
      if (something.drawingTile) {
        this.drawingTile = something.drawingTile;
      }
    }
  }

  get tiles(): Array<牌> {
    return this._tiles;
  }

  set tiles(tiles: Array<牌>) {
    this._tiles = tiles;
  }

  // ツモ番（牌を捨てる番）でも、ツモ牌を除いた手牌を返す
  get rawTiles(): 牌[] {
    const tiles = [...this._tiles];
    if (![1, 4, 7, 10, 13].includes(tiles.length)) {
      tiles.pop();
    }

    return tiles;
  }

  get drawingTile(): DrawTile | null {
    return this._drawingTile;
  }

  set drawingTile(tile: DrawTile) {
    this._drawingTile = tile;
    this.tiles.push(tile.tile);
  }

  get isMenzen(): boolean {
    return this.openMentsuList.length == 0;
  }

  get openMentsuList(): IMentsu[] {
    return this._openMentsuList;
  }

  set openMentsuList(mentsuList: IMentsu[]) {
    this._openMentsuList = mentsuList;
  }

  get status(): string {
    const testList: string[] = [];
    testList.push(`[${Tile.toEmojiArray(this.tiles)} (${Tile.toMojiArray(this.tiles)})]`);

    if (this.openMentsuList.length > 0) {
      testList.push(`副露牌 [${this._openMentsuList.map((mentsu) => `${mentsu.status()}`).join(" ")}]`);
    }

    const shanten = this.calculateShanten();
    testList.push(`${shanten}シャンテン`);

    return testList.join(" ");
  }

  static parse(tilesString: string): 牌[] {
    const strArray = tilesString.match(/.{2}/g);

    if (!strArray.every((x) => Tile.isTile(x))) {
      throw new CustomError({ tilesString, strArray });
    }

    if (strArray.length > 0 && strArray.length !== 13) {
      throw new CustomError("hand tiles count must be 13", strArray);
    }

    return strArray.map((x) => Tile.toTile(x));
  }

  discardTile(tile: 牌): void {
    this.removeTile(tile);
    this._drawingTile = null;
  }

  removeTiles(tiles: 牌[]): void {
    tiles.forEach((tile) => this.removeTile(tile));
  }

  removeTile(tile: 牌): void {
    const index = this.tiles.indexOf(tile);
    if (index < 0) {
      throw new CustomError(tile);
    }

    this.tiles.splice(index, 1);
  }

  debugStatus(): any {
    return {
      tiles: this.tiles.join(""),
      length: this.tiles.length,
      emoji: Tile.toEmojiArray(this.tiles),
      moji2: Tile.toMojiArray(this.tiles),
      furo: this._openMentsuList.map((m) => m.status()).join("|"),
    };
  }

  sortTiles(): Array<牌> {
    return Tile.sortTiles(this.tiles);
  }

  //シャンテン数（向聴数）を計算する
  calculateShanten(): number {
    const shanten = new SubShantenCalculator(this).calculateShanten();
    return shanten;
  }
}
