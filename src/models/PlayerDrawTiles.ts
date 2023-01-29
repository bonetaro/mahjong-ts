import { List } from "linqts";
import { PlayerHand } from "./";
import { CustomError } from "../lib";
import { 牌 } from "../types";

export class PlayerDrawTiles {
  constructor(public hand = new PlayerHand(), public drawTiles: 牌[] = []) {
    const group = new List(this.hand.tiles).GroupBy((t) => t);

    if (Object.keys(group).filter((key) => group[key].length > 4).length > 0) {
      throw new CustomError({
        message: "over 4 tiles",
        obj: Object.keys(group).filter((key) => group[key].length > 4),
      });
    }
  }

  toTiles(): 牌[] {
    return this.hand.tiles.concat(this.drawTiles);
  }
}
