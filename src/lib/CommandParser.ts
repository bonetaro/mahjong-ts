import { OtherPlayersCommandType, PlayerCommandType, 牌 } from "../types";
import { PlayerHand } from "../models";
import { ChiCalculator, KanCalculator, PonCalculator } from "./calculator";

export class CommandParser {
  constructor(private readonly hand: PlayerHand) {}

  public parseAsPlayerCommand = (): Map<PlayerCommandType, 牌[]> => {
    const map = new Map<PlayerCommandType, 牌[]>();

    // 牌を捨てる
    map.set("discard", this.hand.tiles);

    const kanCalculator = new KanCalculator(this.hand);

    // 暗槓
    const ankanCandidateTiles = kanCalculator.ankanCandidateTiles();
    if (ankanCandidateTiles.length > 0) {
      map.set("kan", ankanCandidateTiles);
    }

    // 加槓
    if (kanCalculator.canKakan(this.hand.drawingTile.tile)) {
      const tiles: 牌[] = map.has("kan") ? map.get("kan") : [];
      tiles.push(this.hand.drawingTile.tile);

      map.set("kan", tiles);
    }

    // todo ツモ

    return map;
  };

  /**
   *
   * @param tile
   * @param leftPlayer tileが上家が捨てた牌として処理するか
   * @returns
   */
  parseAsOtherPlayersCommand = (tile: 牌, leftPlayer: boolean): Map<OtherPlayersCommandType, 牌[][]> => {
    const map = new Map<OtherPlayersCommandType, 牌[][]>();

    // ポン
    if (new PonCalculator(this.hand).canPon(tile)) {
      map.set("pon", [[tile]]);
    }

    // チー
    if (leftPlayer) {
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
