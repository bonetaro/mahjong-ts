import { 牌, 配牌 } from "./MahjongType";
export class Hand {
  private hand_of_tiles: Array<牌>;

  constructor(tiles: 配牌) {
    // todo sort
    this.hand_of_tiles = tiles;
  }

  static parse(text: string) {
    const textArray = text.match(/.{2}/g);

    if (textArray instanceof Array<牌>) {
      return textArray as Array<牌>;
    }

    throw new Error("parse Error");
  }
}
