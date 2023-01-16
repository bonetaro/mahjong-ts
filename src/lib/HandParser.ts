import { Hand } from "./models";
import { MentsuCalculator, PlayerCommandType, 牌 } from ".";

export class HandParser {
  private _hand: Hand;
  private _calculator: MentsuCalculator;

  constructor(hand: Hand) {
    this._hand = hand;
    this._calculator = new MentsuCalculator(this._hand);
  }

  calculate(): MentsuCalculator {
    return this._calculator;
  }

  parseAsPlayerCommand = (): Map<PlayerCommandType, 牌[]> => {
    const commandList: PlayerCommandType[] = [];
    const map = new Map<PlayerCommandType, 牌[]>();

    commandList.push(PlayerCommandType.Discard);
    map.set(PlayerCommandType.Discard, this._hand.tiles);

    // todo ツモ
    // 暗槓
    const ankanCandidateTiles = this._calculator.ankanCandidate();
    if (ankanCandidateTiles.length > 0) {
      commandList.push(PlayerCommandType.Kan);
      map.set(PlayerCommandType.Kan, ankanCandidateTiles);
    }

    // 加槓
    if (this._calculator.canKakan(this._hand.drawingTile.tile)) {
      commandList.push(PlayerCommandType.Kan);
      map.set(PlayerCommandType.Kan, [this._hand.drawingTile.tile]);
    }

    return map;
  };

  parseAsOtherPlayersCommand = (tile: 牌): Map<PlayerCommandType, 牌[]> => {
    const commandList: PlayerCommandType[] = [];
    const map = new Map<PlayerCommandType, 牌[]>();

    if (this._calculator.canPon(tile)) {
      commandList.push(PlayerCommandType.Pon);
      map.set(PlayerCommandType.Pon, [tile]);
    }

    commandList.push(PlayerCommandType.Nothing);
    map.set(PlayerCommandType.Nothing, []);

    return map;
  };
}
