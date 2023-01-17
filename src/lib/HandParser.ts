import { Hand } from "./models";
import { MentsuCalculator, CommandType, PlayerCommandType, 牌 } from ".";

export class HandParser {
  private _calculator: MentsuCalculator;

  constructor(private readonly hand: Hand) {
    this._calculator = new MentsuCalculator(hand);
  }

  parseAsPlayerCommand = (): Map<PlayerCommandType, 牌[]> => {
    const commandList: PlayerCommandType[] = [];
    const map = new Map<PlayerCommandType, 牌[]>();

    // 牌を捨てる
    commandList.push(CommandType.Discard);
    map.set(CommandType.Discard, this.hand.tiles);

    // 暗槓
    const ankanCandidateTiles = this._calculator.ankanCandidate();
    if (ankanCandidateTiles.length > 0) {
      commandList.push(CommandType.Kan);
      map.set(CommandType.Kan, ankanCandidateTiles);
    }

    // 加槓
    if (this._calculator.canKakan(this.hand.drawingTile.tile)) {
      commandList.push(CommandType.Kan);
      map.set(CommandType.Kan, [this.hand.drawingTile.tile]);
    }

    // todo ツモ

    return map;
  };

  /**
   *
   * @param tile
   * @param fromLeftPlayer tileが上家が捨てた牌として処理するか
   * @returns
   */
  parseAsOtherPlayersCommand = (tile: 牌, fromLeftPlayer: boolean): Map<CommandType, 牌[]> => {
    const commandList: CommandType[] = [];
    const map = new Map<CommandType, 牌[]>();

    if (this._calculator.canPon(tile)) {
      commandList.push(CommandType.Pon);
      map.set(CommandType.Pon, [tile]);
    }

    if (fromLeftPlayer && this._calculator.canChi(tile)) {
      commandList.push(CommandType.Chi);
      map.set(CommandType.Chi, [tile]);
    }

    if (this._calculator.canKakan(tile)) {
      commandList.push(CommandType.Kan);
      map.set(CommandType.Kan, [tile]);
    }

    commandList.push(CommandType.Nothing);
    map.set(CommandType.Nothing, []);

    return map;
  };
}
