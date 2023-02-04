import { List } from "linqts";
import { PlayerHand } from "../../models/PlayerHand";
import { Helper } from "../Helper";
import { Tile } from "../../../src/models";
import { TileType } from "../../models/TileType";
import { Mentsu } from "../../models/Mentsu";
import { 刻子like, 順子like, 牌 } from "MahjongTypes";
import { logger } from "../logging";

export class ReadyCalculator {
  constructor(private hand: PlayerHand) {}

  public calculate(): number {
    const group = new List(Tile.sortTiles(this.hand.tiles)).GroupBy((t) => t[1]);

    const syuntsuCount = this.getShuntsuCount(group);
    const koutsuCount = this.getKoutsuCount(group);

    logger.debug({ 刻子: koutsuCount, 順子: syuntsuCount });

    return 4 - (syuntsuCount + koutsuCount);
  }

  public calculateAsThirteenOrphans(): number {
    return 13 - this.getTerminalsAndHonors();
  }

  private getTerminalsAndHonors(): number {
    let count = 0;
    let hasHead = false;

    const group = new List(this.hand.tiles).GroupBy((t) => t);
    for (const key in group) {
      if (Tile.isSuits(key)) {
        const tile = new Tile(key).toSuitsTile();
        count += tile.value == 1 || tile.value == 9 ? 1 : 0;
      } else {
        count += 1;
      }

      hasHead = hasHead || group[key].length > 1;
    }

    return count + (hasHead ? 1 : 0);
  }

  public calculateAsSevenPairs() {
    // 七対子は最悪6シャンテン
    return 6 - this.getPairCount();
  }

  // 対子の数
  // todo 3枚、4枚も含んでいるが？
  private getPairCount() {
    let count = 0;

    const group = new List(this.hand.tiles).GroupBy((t) => t);
    for (const key in group) {
      count += group[key].length > 1 ? 1 : 0;
    }

    return count;
  }

  public getKoutsuCount(group: { [key: string]: 牌[] }): number {
    let count = 0;

    for (const key in group) {
      if (TileType.isSuitsType(key)) {
        const array = Helper.combination(
          group[key].map((t) => new Tile(t).toSuitsTile().value),
          3
        );

        for (let i = 0; i < array.length; i++) {
          const mentsu = array[i].map((n) => `${n}${key}`) as 刻子like;
          count += Mentsu.isKoutsuMentsu(mentsu) ? 1 : 0;
        }
      }
    }

    return count;
  }

  /**
   * 順子の数を数える
   * @param group
   * @returns
   */
  public getShuntsuCount(group: { [key: string]: 牌[] }): number {
    let count = 0;

    for (const key in group) {
      if (TileType.isSuitsType(key)) {
        const array = Helper.combination(
          group[key].map((t) => new Tile(t).toSuitsTile().value),
          3
        );

        for (let i = 0; i < array.length; i++) {
          const mentsu = array[i].map((n) => `${n}${key}`) as 順子like;
          count += Mentsu.isRunMentsu(mentsu) ? 1 : 0;
        }
      }
    }

    return count;
  }
}
