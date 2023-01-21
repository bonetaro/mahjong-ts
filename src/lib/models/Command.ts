import { List } from "linqts";
import { AnKanMentsu, GameRoundHand, MinKanMentsu, MinKouMentsu, RoundHandPlayer } from ".";
import { isMeldCommandType, toEmoji, toEmojiMoji } from "../Functions";
import { CommandType, PlayerDirection, 塔子like, 数牌, 牌 } from "../Types";
import { logger } from "../logging";
import { ChiMentsu } from "./Mentsu";

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

export abstract class PlayerCommand extends BaseCommand {
  constructor(who: RoundHandPlayer) {
    super(who);
  }
}

export abstract class OtherPlayersCommand extends BaseCommand {
  constructor(who: RoundHandPlayer, public readonly direction: PlayerDirection, public readonly tile: 牌) {
    super(who);
  }

  whomPlayer(roundHand: GameRoundHand): RoundHandPlayer {
    const index = this.who.index + (this.direction as number);
    return roundHand.players[index % 4];
  }
}

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

export class TsumoCommand extends PlayerCommand {
  protected _type = CommandType.Tsumo;

  constructor(who: RoundHandPlayer) {
    super(who);
  }

  execute(roundHand: GameRoundHand): void {}
}

export class AnKanCommand extends PlayerCommand {
  _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(roundHand: GameRoundHand): void {
    this.who.hand.tiles = this.who.hand.tiles.filter((tile) => this.tile != tile);
    this.who.hand.openMentsuList.push(new AnKanMentsu(this.tile));
    this.who.hand.sortTiles();
    this.who.drawTile(roundHand.pickKingsTile());

    logger.info(`${this.who.name}が${toEmoji(this.tile)} を暗槓しました`);
  }
}

export class KaKanCommand extends PlayerCommand {
  protected _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(roundHand: GameRoundHand): void {
    const furoMentsuList = new List(this.who.hand.openMentsuList);

    // 加槓する牌を手牌から除く
    this.who.hand.tiles = this.who.hand.tiles.filter((tile) => this.tile != tile);
    // 加槓される明刻
    const minkouMentsu = furoMentsuList.Where((mentsu) => mentsu instanceof MinKouMentsu).Single((mentsu) => mentsu.tiles.includes(this.tile)) as MinKanMentsu;
    // 明槓子
    const minkanMentsu = new MinKanMentsu(this.tile, minkouMentsu.fromPlayerDirection);
    // 作成した明槓子をさらす
    furoMentsuList.Where((mentsu) => !(mentsu instanceof MinKouMentsu && mentsu.tiles.includes(this.tile))).Add(minkanMentsu);
    this.who.hand.openMentsuList = furoMentsuList.ToArray();

    logger.info(`${this.who.name}が${toEmoji(this.tile)} を加槓しました`);
  }
}

export class NothingCommand extends OtherPlayersCommand {
  protected _type = CommandType.Nothing;

  constructor() {
    super(null, null, null);
  }

  execute(): void {
    // do nothing
  }
}

export class RonCommand extends OtherPlayersCommand {
  protected _type = CommandType.Ron;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {}
}

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
    [...Array(2)].map(() => {
      const index = this.who.hand.tiles.indexOf(this.tile);
      this.who.hand.tiles.splice(index, 1);
    });

    const mentsu = new MinKouMentsu(this.tile, this.direction);
    this.who.hand.openMentsuList.push(mentsu);

    // 牌を捨てた人の捨て牌から取り除く（実際はflagをたてるだけ）
    this.whomPlayer(roundHand).discardTiles.slice(-1)[0].meld = true;

    logger.info(`${this.who.name}が${toEmoji(this.tile)} をポンしました`);
  }
}

export class DaiMinKanCommand extends OtherPlayersCommand {
  protected _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {}
}

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

    logger.info(`${this.who.name}が${toEmojiMoji(this.tile)}をチーしました`);
  }
}
