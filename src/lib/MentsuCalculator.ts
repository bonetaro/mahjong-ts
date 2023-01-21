import { List } from "linqts";
import { Hand, MinKouMentsu } from "./models";
import { toTile, 塔子like, 数牌の色, 牌, 面子like, 順子like } from ".";
import { isSuits, isRunMentsu, combination } from "./Functions";

abstract class MentsuCalculator {
  constructor(protected readonly hand: Hand) {}
}

export class KanCalculator extends MentsuCalculator {
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
}

export class PonCalculator extends MentsuCalculator {
  canPon(tile: 牌): boolean {
    return this.hand.tiles.filter((t) => t == tile).length >= 2;
  }
}

export class ChiCalculator extends MentsuCalculator {
  chiCandidates(tile: 牌): 塔子like[] {
    if (!isSuits(tile)) {
      return [];
    }

    const color = tile[1] as 数牌の色;

    const sameColorSuitTiles = this.hand.tiles.filter((t) => isSuits(t) && t[1] == color);
    if (sameColorSuitTiles.length < 2) {
      return [];
    }

    // 同じ色の数牌２つの組み合わせを取得
    const combinationArray = combination(
      sameColorSuitTiles.map((t) => Number(t[0])),
      2
    );

    const matchTartsNumList = combinationArray
      .map((tartsNums) => {
        const nums = [...tartsNums];
        // ターツに鳴く牌を追加して面子にする
        nums.push(Number(tile[0]));
        return { tartsNums, mentsu: nums.map((num) => `${num}${color}`) as 面子like };
      })
      .filter((obj) => isRunMentsu(obj.mentsu as 順子like))
      .map((obj) => obj.tartsNums);

    return matchTartsNumList.map((tartsNums) => tartsNums.map((num) => `${num}${color}`) as 塔子like);
  }
}
