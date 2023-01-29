import { List } from "linqts";
import { logger } from "../lib/";
import { GameRoundHand } from "./";

// 場（東場、南場）
export class GameRound {
  private _hands: GameRoundHand[] = [];

  constructor() {
    logger.debug("gameRound create");
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
