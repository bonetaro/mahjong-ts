import { Hand } from "./Hand";
import { 牌 } from "./Types";

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
  }

  sortTiles(): void {
    this._hand = new Hand(this._hand).sort();
  }
}
