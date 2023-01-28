import { List } from "linqts";
import { 牌 } from "./Types";
import { logger } from "./logging";
import { PlayerDrawTiles } from "./models/PlayerDrawTiles";
import { CustomError } from "./CustomError";

export class Validator {
  static isValidAllTiles(tiles: 牌[]): boolean {
    if (tiles.length !== 136) {
      logger.error("tiles count is NOT 136");
      return false;
    }

    const group = new List(tiles).GroupBy((t) => t);
    if (!Validator.isValidFourByTileType(group)) {
      const wrongs = Object.keys(group).filter((key) => group[key].length != 4);
      logger.error("count per tile type is NOT 4", wrongs);
      return false;
    }

    if (Object.keys(group).length !== 34) {
      logger.error("tile type count is NOT 34", group);
      return false;
    }

    return true;
  }

  static isValidFourByTileType(group: { [key: string]: 牌[] }) {
    return Object.keys(group).every((key) => group[key].length == 4);
  }

  static isValidPlayerDrawTilesList(playerDrawTilesList: PlayerDrawTiles[], kingsTiles: 牌[]): boolean {
    const tiles = playerDrawTilesList
      .map((playerDrawTiles) => playerDrawTiles.hand.tiles.concat(playerDrawTiles.drawTiles))
      .flatMap((x) => x)
      .concat(kingsTiles);

    const group = new List(tiles).GroupBy((t) => t);
    const wrong = Object.keys(group).filter((key) => group[key].length != 4);
    if (wrong.length > 0) {
      throw new CustomError({
        wrong: wrong.sort(),
        group: group,
      });
    }

    return true;
  }

  static isValidPlayerDrawTiles(playerDrawTiles: PlayerDrawTiles, less: boolean): boolean {
    if (playerDrawTiles.hand.tiles.length != 13) {
      throw new CustomError(playerDrawTiles.hand);
    }

    const drawTilesCount = less ? 17 : 18;
    if (playerDrawTiles.drawTiles.length != drawTilesCount) {
      throw new CustomError(playerDrawTiles.drawTiles);
    }

    return true;
  }
}
