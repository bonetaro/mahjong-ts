import { PlayerHand } from "../../models";
import { IShantenCalculator, BaseNormalShantenCalculator } from ".";

// 引き算方式
export class SubShantenCalculator extends BaseNormalShantenCalculator {
  calculate(shuntsuCount: number, koutsuCount: number, pairCount: number, tatsuCount: number): number {
    const penalty = this.getPenalty(shuntsuCount, koutsuCount, pairCount, tatsuCount);

    // 8 - ((メンツ数 × 2) + (対子 or 塔子 × 1))
    return 8 - (shuntsuCount + koutsuCount) * 2 - pairCount - tatsuCount + penalty;
  }
}

// 足し算方式
export class AddShantenCalculator extends BaseNormalShantenCalculator {
  calculate(shuntsuCount: number, koutsuCount: number, pairCount: number, tatsuCount: number): number {
    const hasHead = pairCount > 0;

    const nums: number[] = [];

    for (let i = 0; i < shuntsuCount + koutsuCount; i++) {
      nums.push(0);
    }

    nums.push(hasHead ? 0 : 1);

    for (let i = 0; i < pairCount - (hasHead ? 1 : 0) + tatsuCount; i++) {
      nums.push(1);
    }

    const length = nums.length;
    for (let i = 0; i < 5 - length; i++) {
      nums.push(2);
    }

    const penalty = this.getPenalty(shuntsuCount, koutsuCount, pairCount, tatsuCount);

    return nums.reduce((sum, num) => sum + num, 0) - 1 - penalty;
  }
}

const calculatorMap = {
  sub: SubShantenCalculator,
  add: AddShantenCalculator,
};

export type CalculatorType = keyof typeof calculatorMap;

export class ReadyCalculatorFactory {
  static factory(key: CalculatorType, hand: PlayerHand): IShantenCalculator {
    return new calculatorMap[key](hand);
  }
}
