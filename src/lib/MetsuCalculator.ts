import { List } from "linqts";
import { toTile } from "./Functions";
import { Hand } from "./Hand";
import { 牌 } from "./Types";

export class MentsuCalculator {
  private _hand: Hand;

  constructor(hand: Hand) {
    this._hand = hand;
  }

  ankanCandidate(): 牌[] {
    // todo リーチ時には、面子が変わるようなカンはできない
    const group = new List(this._hand.tiles).GroupBy((t) => t);

    const tiles: 牌[] = [];
    for (let key in group) {
      if (group[key].length === 4) {
        tiles.push(toTile(key));
      }
    }

    return tiles;
  }

  canKakan(tile: 牌): boolean {
    return false;
  }
}
