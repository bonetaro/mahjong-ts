import { List } from "linqts";
import { Tile } from "../../models";
import { BaseShantenCalculator } from "./";

export class TerminalsAndHonorsCalculator extends BaseShantenCalculator {
  calculateShanten(): number {
    let count = 0;
    let hasHead = false;

    if (!this.hand.isMenzen) {
      return Infinity;
    }

    const groupingTiles = new List(this.hand.tiles).GroupBy((t) => t);
    for (const tile in groupingTiles) {
      if (Tile.isSuits(tile)) {
        const suits = new Tile(tile).toSuitsTile();
        count += suits.value == 1 || suits.value == 9 ? 1 : 0;
      } else {
        count += 1;
      }

      hasHead = hasHead || groupingTiles[tile].length > 1;
    }

    return 13 - (count + (hasHead ? 1 : 0));
  }
}
