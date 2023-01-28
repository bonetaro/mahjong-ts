import { List } from "linqts";
import { AnKanMentsu, GameRoundHand, MinKanMentsu, MinKouMentsu } from ".";
import { CommandType } from "../Constants";
import { PlayerDirection, 塔子like, 数牌, 牌 } from "../Types";
import { isMeldCommandType, toEmoji, toEmojiMoji } from "../functions";
import { logger } from "../logging";
import { ChiMentsu } from "./Mentsu";
import { RoundHandPlayer } from "./RoundHandPlayer";

export abstract class BaseCommand {
  protected _type: CommandType;

  constructor(public readonly who: RoundHandPlayer) {}

  get type(): CommandType {
    return this._type;
  }

  abstract execute(roundHand: GameRoundHand): void;

  // ポン、チー、カン
  isMeldCommand(): boolean {
    return isMeldCommandType(this.type);
  }
}

//-----------------------------

// ツモ番のプレイヤーのコマンド
export abstract class PlayerCommand extends BaseCommand {
  constructor(who: RoundHandPlayer) {
    super(who);
  }
}

// 牌を捨てる
export class DiscardCommand extends PlayerCommand {
  protected _type = CommandType.Discard;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(roundHand: GameRoundHand): void {
    this.who.doDiscard(this.tile);
    this.who.sortHandTiles();
  }
}

// ツモ
export class TsumoCommand extends PlayerCommand {
  protected _type = CommandType.Tsumo;

  constructor(who: RoundHandPlayer) {
    super(who);
  }

  execute(roundHand: GameRoundHand): void {}
}

// 暗槓
export class AnKanCommand extends PlayerCommand {
  protected _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(roundHand: GameRoundHand): void {
    logger.info(`「${this.who.name}」が${toEmoji(this.tile)} を暗槓しました`);

    this.who.hand.removeTiles([this.tile, this.tile, this.tile, this.tile]);
    this.who.hand.openMentsuList.push(new AnKanMentsu(this.tile));
    this.who.hand.sortTiles();
    this.who.drawTile(roundHand.pickKingsTile());
  }
}

// 加槓
export class KaKanCommand extends PlayerCommand {
  protected _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(roundHand: GameRoundHand): void {
    let furoMentsuList = new List(this.who.hand.openMentsuList);

    // 加槓する牌を手牌から除く
    this.who.hand.removeTile(this.tile);
    // 加槓される明刻から鳴いた相手を取り出す
    const minkouMentsu = furoMentsuList.Where((mentsu) => mentsu instanceof MinKouMentsu).Single((mentsu) => mentsu.tiles.includes(this.tile)) as MinKanMentsu;
    // 明槓子
    const minkanMentsu = new MinKanMentsu(this.tile, minkouMentsu.fromPlayerDirection);
    // ベースとなった明刻を除き、作成した明槓子をさらす
    furoMentsuList = furoMentsuList.Where((mentsu) => !(mentsu instanceof MinKouMentsu && mentsu.tiles.includes(this.tile)));
    furoMentsuList.Add(minkanMentsu);
    this.who.hand.openMentsuList = furoMentsuList.ToArray();

    this.who.drawTile(roundHand.pickKingsTile());

    logger.info(`「${this.who.name}」が${toEmoji(this.tile)} を加槓しました`);
  }
}

// ---------------------------------------

// ツモ番以外のプレイヤーのコマンド
export abstract class OtherPlayersCommand extends BaseCommand {
  constructor(who: RoundHandPlayer, public readonly direction: PlayerDirection, public readonly tile: 牌) {
    super(who);
  }

  whomPlayer(roundHand: GameRoundHand): RoundHandPlayer {
    return roundHand.menbers.getPlayerOf(this.who, this.direction);
  }
}

// 何もしない
export class NothingCommand extends OtherPlayersCommand {
  protected _type = CommandType.Nothing;

  constructor() {
    super(null, null, null);
  }

  execute(): void {
    // do nothing
  }
}

// ロン
export class RonCommand extends OtherPlayersCommand {
  protected _type = CommandType.Ron;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {}
}

// 槍槓
export class ChankanRonCommand extends RonCommand {
  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {}
}

export class PonCommand extends OtherPlayersCommand {
  protected _type = CommandType.Pon;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {
    this.who.hand.removeTiles([this.tile, this.tile]);
    const minkouMentsu = new MinKouMentsu(this.tile, this.direction);
    this.who.hand.openMentsuList.push(minkouMentsu);

    // 牌を捨てた人の捨て牌から取り除く（実際はflagをたてるだけ）
    this.whomPlayer(roundHand).discardTiles.slice(-1)[0].meld = true;

    logger.info(`「${this.who.name}」が${toEmoji(this.tile)} をポンしました`, { hand: this.who.hand.debugStatus(), discards: this.who.debugDiscardStatus() });
  }
}

// 大明槓
export class DaiMinKanCommand extends OtherPlayersCommand {
  protected _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {
    this.who.hand.removeTiles([this.tile, this.tile, this.tile]);
    const minkanMentsu = new MinKanMentsu(this.tile, this.direction);
    this.who.hand.openMentsuList.push(minkanMentsu);

    // 牌を捨てた人の捨て牌から取り除く（実際はflagをたてるだけ）
    this.whomPlayer(roundHand).discardTiles.slice(-1)[0].meld = true;

    logger.info(`「${this.who.name}」が${toEmoji(this.tile)} を大明槓しました`);
  }
}

// チー
export class ChiCommand extends OtherPlayersCommand {
  protected _type = CommandType.Chi;
  protected _tiles: 塔子like; // 順子のもとになったターツ

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌, tiles: 塔子like) {
    super(who, direction, tile);
    this._tiles = tiles;
  }

  execute(roundHand: GameRoundHand): void {
    this._tiles.map((tile) => {
      const index = this.who.hand.tiles.indexOf(tile);
      this.who.hand.tiles.splice(index, 1);
    });

    const chiMentsu = new ChiMentsu(this.tile as 数牌, this._tiles as 塔子like);
    this.who.hand.openMentsuList.push(chiMentsu);

    // 牌を捨てた人の捨て牌から取り除く（実際はflagをたてるだけ）
    this.whomPlayer(roundHand).discardTiles.slice(-1)[0].meld = true;

    logger.info(`「${this.who.name}」が${toEmojiMoji(this.tile)}をチーしました`, {
      hand: this.who.hand.debugStatus(),
      discards: this.who.debugDiscardStatus(),
    });
  }
}
