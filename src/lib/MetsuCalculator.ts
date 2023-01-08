import { List } from "linqts";
import { toTile } from "./Functions";
import { Hand } from "./Hand";
import { 牌 } from "./Types";
import { MinKouMentsu } from "./Mentsu";

export class MentsuCalculator {
  private _hand: Hand;

  constructor(hand: Hand) {
    this._hand = hand;
  }

  ankanCandidate(): 牌[] {
    // todo リーチ時には、面子が変わるようなカンはできない
    const group = new List(this._hand.tiles).GroupBy((t) => t);

    const tiles: 牌[] = [];
    for (const key in group) {
      if (group[key].length === 4) {
        tiles.push(toTile(key));
      }
    }

    return tiles;
  }

  canKakan(tile: 牌): boolean {
    return new List(this._hand.openMentsuList).Any(
      (mentsu) => mentsu instanceof MinKouMentsu && mentsu.tiles.includes(tile)
    );
  }

  canPon(tile: 牌): boolean {
    return new List(this._hand.tiles).Where((t) => t == tile).Count() >= 2;
  }
}
