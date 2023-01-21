import { Hand } from "./models";
import { KanCalculator, CommandType, PlayerCommandType, 牌 } from ".";
import { PonCalculator, ChiCalculator } from "./MentsuCalculator";

export class HandParser {
  constructor(private readonly hand: Hand) {}

  parseAsPlayerCommand = (): Map<PlayerCommandType, 牌[]> => {
    const playerCommandMap = new Map<PlayerCommandType, 牌[]>();

    // 牌を捨てる
    playerCommandMap.set(CommandType.Discard, this.hand.tiles);

    const kanCalculator = new KanCalculator(this.hand);

    // 暗槓
    const ankanCandidateTiles = kanCalculator.ankanCandidate();
    if (ankanCandidateTiles.length > 0) {
      playerCommandMap.set(CommandType.Kan, ankanCandidateTiles);
    }

    // 加槓
    if (kanCalculator.canKakan(this.hand.drawingTile.tile)) {
      let tiles: 牌[] = [];
      if (playerCommandMap.has(CommandType.Kan)) {
        tiles = playerCommandMap.get(CommandType.Kan);
      }
      tiles.push(this.hand.drawingTile.tile);
      playerCommandMap.set(CommandType.Kan, tiles);
    }

    // todo ツモ

    return playerCommandMap;
  };

  /**
   *
   * @param tile
   * @param fromLeftPlayer tileが上家が捨てた牌として処理するか
   * @returns
   */
  parseAsOtherPlayersCommand = (tile: 牌, fromLeftPlayer: boolean): Map<CommandType, 牌[][]> => {
    const map = new Map<CommandType, 牌[][]>();

    // ポン
    if (new PonCalculator(this.hand).canPon(tile)) {
      map.set(CommandType.Pon, [[tile]]);
    }

    // チー
    if (fromLeftPlayer) {
      const candidates = new ChiCalculator(this.hand).chiCandidates(tile);
      if (candidates.length > 0) {
        map.set(CommandType.Chi, candidates);
      }
    }

    // カン（大明槓）
    if (new KanCalculator(this.hand).canKakan(tile)) {
      map.set(CommandType.Kan, [[tile]]);
    }

    // 何もしない
    map.set(CommandType.Nothing, []);

    return map;
  };
}
