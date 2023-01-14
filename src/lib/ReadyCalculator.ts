import { Hand } from "./models/Hand";

export class ReadyCalculator {
  private _hand: Hand;

  constructor(hand: Hand) {
    this._hand = hand;
  }

  public calcurate(): number {
    return 0;
  }
}
