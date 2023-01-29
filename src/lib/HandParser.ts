import { OtherPlayersCommandType, PlayerCommandType, 牌 } from "../types";
import { PlayerHand } from "../models";
import { ChiCalculator, KanCalculator, PonCalculator } from "./calculator/MentsuCalculator";

export class HandParser {
  constructor(private readonly hand: PlayerHand) {}

  private _parseAsPlayerCommand = (): Map<PlayerCommandType, 牌[]> => {
    const playerCommandMap = new Map<PlayerCommandType, 牌[]>();

    // 牌を捨てる
    playerCommandMap.set("discard", this.hand.tiles);

    const kanCalculator = new KanCalculator(this.hand);

    // 暗槓
    const ankanCandidateTiles = kanCalculator.ankanCandidate();
    if (ankanCandidateTiles.length > 0) {
      playerCommandMap.set("kan", ankanCandidateTiles);
    }

    // 加槓
    if (kanCalculator.canKakan(this.hand.drawingTile.tile)) {
      const tiles: 牌[] = playerCommandMap.has("kan") ? playerCommandMap.get("kan") : [];
      tiles.push(this.hand.drawingTile.tile);

      playerCommandMap.set("kan", tiles);
    }

    // todo ツモ
    return playerCommandMap;
  };
  public get parseAsPlayerCommand() {
    return this._parseAsPlayerCommand;
  }
  public set parseAsPlayerCommand(value) {
    this._parseAsPlayerCommand = value;
  }

  /**
   *
   * @param tile
   * @param fromLeftPlayer tileが上家が捨てた牌として処理するか
   * @returns
   */
  parseAsOtherPlayersCommand = (tile: 牌, fromLeftPlayer: boolean): Map<OtherPlayersCommandType, 牌[][]> => {
    const map = new Map<OtherPlayersCommandType, 牌[][]>();

    // ポン
    if (new PonCalculator(this.hand).canPon(tile)) {
      map.set("pon", [[tile]]);
    }

    // チー
    if (fromLeftPlayer) {
      const candidates = new ChiCalculator(this.hand).chiCandidates(tile);
      if (candidates.length > 0) {
        map.set("chi", candidates);
      }
    }

    // カン（大明槓）
    if (new KanCalculator(this.hand).canDaiminkan(tile)) {
      map.set("kan", [[tile]]);
    }

    // 何もしない
    map.set("nothing", []);

    return map;
  };
}
