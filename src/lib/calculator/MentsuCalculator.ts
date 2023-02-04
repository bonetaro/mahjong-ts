import { List } from "linqts";
import { PlayerHand, Mentsu, MinKouMentsu, Tile } from "../../models";
import { Helper } from "../Helper";
import { 牌, 塔子like, 面子like, 順子like } from "../../types";

abstract class MentsuCalculator {
  constructor(protected readonly hand: PlayerHand) {}
}

export class KanCalculator extends MentsuCalculator {
  ankanCandidateTiles(): 牌[] {
    // todo リーチ時には、面子が変わるようなカンはできない

    const tiles: 牌[] = [];

    const group = new List(this.hand.tiles).GroupBy((t) => t);
    for (const key in group) {
      if (group[key].length === 4) {
        tiles.push(Tile.toTile(key));
      }
    }

    return tiles;
  }

  canKakan(tile: 牌): boolean {
    return this.hand.openMentsuList.some((mentsu) => mentsu instanceof MinKouMentsu && mentsu.tiles.includes(tile));
  }

  canDaiminkan(tile: 牌): boolean {
    return this.hand.tiles.map((t) => t == tile).length == 3;
  }
}

export class PonCalculator extends MentsuCalculator {
  canPon(tile: 牌): boolean {
    return this.hand.tiles.filter((t) => t == tile).length >= 2;
  }
}

export class ChiCalculator extends MentsuCalculator {
  chiCandidates(pai: 牌): 塔子like[] {
    if (!Tile.isSuits(pai)) {
      return [];
    }

    const tile = new Tile(pai).toSuitsTile();

    const sameColorSuitTiles = this.hand.tiles.filter((t) => Tile.isSuits(t) && t[1] == tile.color);
    if (sameColorSuitTiles.length < 2) {
      return [];
    }

    // 同じ色の数牌２つの組み合わせを取得
    const combinationArray = Helper.combination(
      sameColorSuitTiles.map((t) => new Tile(t).toSuitsTile().value),
      2
    );

    const matchTartsNumList = combinationArray
      .map((tartsNums) => {
        const nums = [...tartsNums];
        // ターツに鳴く牌を追加して面子にする
        nums.push(tile.value);
        return { tartsNums, mentsu: nums.map((num) => `${num}${tile.color}`) as 面子like };
      })
      .filter((obj) => Mentsu.isRunMentsu(obj.mentsu as 順子like))
      .map((obj) => obj.tartsNums);

    return matchTartsNumList.map((tartsNums) => tartsNums.map((num) => `${num}${tile.color}`) as 塔子like);
  }
}
