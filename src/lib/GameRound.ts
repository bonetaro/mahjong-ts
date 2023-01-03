import { List } from "linqts";
import { GameRoundHand } from "./GameRoundHand";

// 場（東場、南場）
export class GameRound {
  private _hands: GameRoundHand[] = [];

  constructor() {
    this._hands.push(new GameRoundHand());
  }

  get hands(): GameRoundHand[] {
    return this._hands;
  }

  get currentHand(): GameRoundHand {
    return new List(this._hands).Last();
  }

  isEnd(): boolean {
    return false;
  }
}
