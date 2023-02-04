import * as Constants from "../constants";

export class TileType {
  static isSuitsType(char: string): boolean {
    return char == Constants.ManduChar || char == Constants.PinduChar || char == Constants.SouduChar;
  }

  static isHonor(char: string): boolean {
    return char == Constants.WindChar || char == Constants.DragonChar;
  }
}
