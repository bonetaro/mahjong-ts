import { GameRoundHand } from "./GameRoundHand";

// 場（東場、南場）
export class GameRound {
  private _hands: GameRoundHand[] = [];

  get hands(): GameRoundHand[] {
    return this._hands;
  }
}
