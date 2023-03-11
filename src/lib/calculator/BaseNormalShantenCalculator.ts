import { 牌 } from "../../types";
import { CustomError } from "../CustomError";
import { HandTilesParser, SevenPairsCalculator, TerminalsAndHonorsCalculator } from ".";
import { BaseShantenCalculator } from "./IShantenCalculator";
import { Mentsu } from "../../models/Mentsu";

export abstract class BaseNormalShantenCalculator extends BaseShantenCalculator {
  abstract calculate(shuntsuCount: number, koutsuCount: number, pairCount: number, tatsuCount: number): number;

  getPenalty(shuntsuCount: number, koutsuCount: number, pairCount: number, tatsuCount: number): number {
    const blockNum = shuntsuCount + koutsuCount + pairCount + tatsuCount;
    const headless = pairCount == 0;

    // 6ブロックある時はターツオーバーで1、雀頭がなければさらに1
    return blockNum > 5 ? (headless ? 2 : 1) : 0;
  }

  canRemoveTiles = (handTiles: 牌[], tiles: 牌[]): boolean => {
    const newHandTiles = [...handTiles];

    return tiles.every((tile) => {
      const index = newHandTiles.indexOf(tile);
      if (index > -1) {
        newHandTiles.splice(index, 1);
        return true;
      }

      return false;
    });
  };

  removeTiles = (handTiles: 牌[], tiles: 牌[]): void => {
    tiles.forEach((tile) => {
      const index = handTiles.indexOf(tile);
      if (index < 0) {
        throw new CustomError(tile);
      }

      handTiles.splice(index, 1);
    });
  };

  countShuntsu = (parser: HandTilesParser, tiles: 牌[]): number => {
    let count = 0;

    // 順子は、一盃口、三連刻?がありえるので、とりきれなくなるまで繰り返す
    parser.shuntsuList.forEach((shuntsu) => {
      while (this.canRemoveTiles(tiles, shuntsu)) {
        this.removeTiles(tiles, shuntsu);
        count++;
      }
    });

    return count;
  };

  countKoutsu = (parser: HandTilesParser, tiles: 牌[]): number => {
    let count = 0;
    parser.koutsuList.forEach((koutsu) => {
      if (this.canRemoveTiles(tiles, koutsu)) {
        this.removeTiles(tiles, koutsu);
        count++;
      }
    });

    return count;
  };

  countPair = (parser: HandTilesParser, tiles: 牌[]): number => {
    let count = 0;

    parser.pairsList.forEach((pair) => {
      if (this.canRemoveTiles(tiles, pair)) {
        this.removeTiles(tiles, pair);
        count++;
      }
    });

    return count;
  };

  countTatsu = (parser: HandTilesParser, tiles: 牌[]): number => {
    let count = 0;

    parser.tatsuList.forEach((tatsu) => {
      if (this.canRemoveTiles(tiles, tatsu)) {
        this.removeTiles(tiles, tatsu);
        count++;
      }
    });

    return count;
  };

  calculateShanten(): number {
    const parser = new HandTilesParser(this.hand);

    const furoShuntsuCount = this.hand.openMentsuList.filter((mentsu) => Mentsu.isRunMentsu(mentsu.tiles)).length;
    // 副露槓子は刻子として扱う
    const furoKotsuCount = this.hand.openMentsuList.filter((mentsu) => Mentsu.isKoutsuMentsu(mentsu.tiles) || Mentsu.isKanMentsu(mentsu.tiles)).length;

    // 順子優先
    const calculateAsShuntsuPriority = (handTiles: 牌[]): number => {
      const tiles = [...handTiles];

      const shuntsuCount = this.countShuntsu(parser, tiles) + furoShuntsuCount;
      const kotsuCount = this.countKoutsu(parser, tiles) + furoKotsuCount;
      const pairCount = this.countPair(parser, tiles);
      const tatsuCount = this.countTatsu(parser, tiles);

      return this.calculate(shuntsuCount, kotsuCount, pairCount, tatsuCount);
    };

    // 刻子優先
    const calculateAsKotsuPriority = (handTiles: 牌[]): number => {
      const tiles = [...handTiles];

      const koutsuCount = this.countKoutsu(parser, tiles) + furoKotsuCount;
      const shuntsuCount = this.countShuntsu(parser, tiles) + furoShuntsuCount;
      const pairCount = this.countPair(parser, tiles);
      const tatsuCount = this.countTatsu(parser, tiles);

      return this.calculate(shuntsuCount, koutsuCount, pairCount, tatsuCount);
    };

    // ツモ牌を除いた手牌（13牌）
    const handTiles = [...this.hand.rawTiles];

    const shuntsuResult = calculateAsShuntsuPriority(handTiles);
    const kotsuResult = calculateAsKotsuPriority(handTiles);
    const chitoitsuResult = new SevenPairsCalculator(this.hand).calculateShanten(parser);
    const kokushiResult = new TerminalsAndHonorsCalculator(this.hand).calculateShanten();

    return Math.min(shuntsuResult, kotsuResult, chitoitsuResult, kokushiResult);
  }
}
