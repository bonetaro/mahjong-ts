import { List } from "linqts";
import { WindNameList } from "../constants";
import { logger } from "../lib/";
import { Game, GameRoundHand } from "./";

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

  name(game: Game): string {
    return `${WindNameList[game.roundCount - 1]}場`;
  }

  isEnd(): boolean {
    return false;
  }
}
