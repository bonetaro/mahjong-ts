import { List } from "linqts";
import { Hand, MinKouMentsu } from "./models";
import { toTile, 牌 } from ".";
import { isSuits } from "./Functions";

export class MentsuCalculator {
  constructor(private readonly hand: Hand) {}

  ankanCandidate(): 牌[] {
    // todo リーチ時には、面子が変わるようなカンはできない
    const group = new List(this.hand.tiles).GroupBy((t) => t);

    const tiles: 牌[] = [];
    for (const key in group) {
      if (group[key].length === 4) {
        tiles.push(toTile(key));
      }
    }

    return tiles;
  }

  canKakan(tile: 牌): boolean {
    return new List(this.hand.openMentsuList).Any((mentsu) => mentsu instanceof MinKouMentsu && mentsu.tiles.includes(tile));
  }

  canPon(tile: 牌): boolean {
    return this.hand.tiles.filter((t) => t == tile).length >= 2;
  }

  canChi(tile: 牌): boolean {
    if (!isSuits(tile)) {
      return false;
    }

    // todo
    // return this.hand.tiles.;
    return true;
  }
}
