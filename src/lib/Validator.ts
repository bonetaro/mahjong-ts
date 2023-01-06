import { List } from "linqts";
import { 牌 } from "./Types";

export class Validator {
  static isValidAllTiles(tiles: 牌[]): boolean {
    if (tiles.length !== 136) {
      return false;
    }

    const group = new List(tiles).GroupBy((t) => t);
    if (!Object.keys(group).every((key) => group[key].length == 4)) {
      return false;
    }

    if (Object.keys(group).length !== 34) {
      return false;
    }

    return true;
  }
}
