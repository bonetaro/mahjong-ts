import { BaseShantenCalculator, HandTilesParser } from "./";

// 七対子のシャンテン数計算
export class SevenPairsCalculator extends BaseShantenCalculator {
  calculateShanten(parser?: HandTilesParser): number {
    parser ??= new HandTilesParser(this.hand);

    if (!this.hand.isMenzen) {
      return Infinity;
    }

    // 七対子は最悪でも6シャンテン
    return 6 - parser.pairsList.length;
  }
}
