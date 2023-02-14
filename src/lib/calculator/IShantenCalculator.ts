import { PlayerHand } from "../../models";
import { HandTilesParser } from ".";

export interface IShantenCalculator {
  calculateShanten(parser?: HandTilesParser): number;
}

export abstract class BaseShantenCalculator implements IShantenCalculator {
  constructor(protected hand: PlayerHand) {}

  abstract calculateShanten(parser?: HandTilesParser): number;
}
