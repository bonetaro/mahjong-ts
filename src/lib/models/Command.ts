import { List } from "linqts";
import { PlayerCommandType, PlayerDirection } from "../Constants";
import { AnKanMentsu, MinKanMentsu, MinKouMentsu } from "./Mentsu";
import { RoundHandPlayer } from "./Player";
import { 牌 } from "../Types";
import { GameRoundHand } from "./GameRoundHand";
import { logger } from "../logging";
import { toEmoji, isMeldCommandType } from "../Functions";

export abstract class BaseCommand {
  protected _type: PlayerCommandType;
  protected _who: RoundHandPlayer;

  constructor(who: RoundHandPlayer) {
    this._who = who;
  }

  get who(): RoundHandPlayer {
    return this._who;
  }

  get type(): PlayerCommandType {
    return this._type;
  }

  abstract execute(roundHand: GameRoundHand): void;

  // ポン、チー、カン
  isMeldCommand(): boolean {
    return isMeldCommandType(this.type);
  }
}

export abstract class PlayerCommand extends BaseCommand {}

export abstract class OtherPlayersCommand extends BaseCommand {
  protected _direction: PlayerDirection;
  protected _tile: 牌;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who);

    this._direction = direction;
    this._tile = tile;
  }

  whomPlayer(roundHand: GameRoundHand): RoundHandPlayer {
    return roundHand.players[this._direction as number];
  }

  get direction(): PlayerDirection {
    return this._direction;
  }

  get tile(): 牌 {
    return this._tile;
  }
}

export class DiscardCommand extends PlayerCommand {
  private _tile: 牌;

  protected _type = PlayerCommandType.Discard;

  get tile(): 牌 {
    return this._tile;
  }

  constructor(who: RoundHandPlayer, tile: 牌) {
    super(who);
    this._tile = tile;
  }

  execute(): void {
    this._who.doDiscard(this._tile);
    this._who.sortHandTiles();
  }
}

export class TsumoCommand extends PlayerCommand {
  protected _type = PlayerCommandType.Tsumo;

  constructor(who: RoundHandPlayer) {
    super(who);
  }

  execute(): void {}
}

export class AnKanCommand extends PlayerCommand {
  private _tile: 牌;
  _type = PlayerCommandType.Kan;

  get tile(): 牌 {
    return this._tile;
  }

  constructor(who: RoundHandPlayer, tile: 牌) {
    super(who);
    this._tile = tile;
  }

  execute(): void {
    logger.info(`${this.who.name}が${toEmoji(this.tile)} を暗槓しました`);

    this.who.hand.tiles = this.who.hand.tiles.filter((tile) => this._tile != tile);
    this.who.hand.openMentsuList.push(new AnKanMentsu(this._tile));
    this.who.hand.sortTiles();
  }
}

export class KaKanCommand extends PlayerCommand {
  private _tile: 牌;

  protected _type = PlayerCommandType.Kan;

  get tile(): 牌 {
    return this._tile;
  }

  constructor(who: RoundHandPlayer, tile: 牌) {
    super(who);
    this._tile = tile;
  }

  execute(): void {
    // 加槓するファイルを手牌から除く
    this.who.hand.tiles = new List(this.who.hand.tiles).Where((tile) => this._tile != tile).ToArray();

    // 加槓されるベースとなる明刻
    const minkouMentsu = new List(this.who.hand.openMentsuList)
      .Where((mentsu) => mentsu instanceof MinKouMentsu)
      .Single((mentsu) => mentsu.tiles.includes(this._tile)) as MinKanMentsu;

    const mentsuList = this.who.hand.openMentsuList;

    // 副露している面子から加槓する明刻を取り除く
    new List(this.who.hand.openMentsuList)
      .RemoveAll(() => true)
      .AddRange(new List(mentsuList).Where((mentsu) => !(mentsu instanceof MinKouMentsu && mentsu.tiles.includes(this.tile))).ToArray());

    // 加槓面子を作成して追加
    this.who.hand.openMentsuList.push(new MinKanMentsu(this.tile, minkouMentsu.fromPlayerDirection));
  }
}

export class NothingCommand extends OtherPlayersCommand {
  protected _type = PlayerCommandType.Nothing;

  constructor() {
    super(null, null, null);
  }

  execute(): void {
    // do nothing
  }
}

export class RonCommand extends OtherPlayersCommand {
  protected _type = PlayerCommandType.Ron;
  _tile: 牌;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}

export class PonCommand extends OtherPlayersCommand {
  protected _type = PlayerCommandType.Pon;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {
    let tiles = [this._tile];

    [...Array(2)].map(() => {
      const index = this.who.hand.tiles.indexOf(this._tile);
      tiles = tiles.concat(this.who.hand.tiles.splice(index, 1));
    });

    const mentsu = new MinKouMentsu(this._tile, this.direction);
    this.who.hand.openMentsuList.push(mentsu);
  }
}

export class DaiMinKanCommand extends OtherPlayersCommand {
  protected _type = PlayerCommandType.Kan;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}

export class ChiCommand extends OtherPlayersCommand {
  protected _type = PlayerCommandType.Chi;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}
