import { GameHand } from "./GameHand";

// 場（東場、南場）
export class GameRound {
  private _hands: GameHand[] = [];

  get hands(): GameHand[] {
    return this._hands;
  }
}
