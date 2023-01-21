import { List } from "linqts";
import { 牌 } from "../Types";
import { throwErrorAndLogging } from "../error";
import { Hand } from "./Hand";

export class PlayerDrawTiles {
  constructor(public hand = new Hand(), public drawTiles: 牌[] = []) {
    const group = new List(this.hand.tiles).GroupBy((t) => t);

    if (Object.keys(group).filter((key) => group[key].length > 4).length > 0) {
      throwErrorAndLogging({
        message: "over 4 tiles",
        obj: Object.keys(group).filter((key) => group[key].length > 4),
      });
    }
  }

  toTiles(): 牌[] {
    return this.hand.tiles.concat(this.drawTiles);
  }
}
