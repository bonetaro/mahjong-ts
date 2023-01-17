import { List } from "linqts";
import { CommandType, PlayerDirection } from "../Constants";
import { AnKanMentsu, MinKanMentsu, MinKouMentsu } from "./Mentsu";
import { RoundHandPlayer } from "./Player";
import { 牌 } from "../Types";
import { GameRoundHand } from "./GameRoundHand";
import { logger } from "../logging";
import { toEmoji, isMeldCommandType } from "../Functions";

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
    return roundHand.players[this.direction as number];
  }
}

export class DiscardCommand extends PlayerCommand {
  protected _type = CommandType.Discard;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(): void {
    this.who.doDiscard(this.tile);
    this.who.sortHandTiles();
  }
}

export class TsumoCommand extends PlayerCommand {
  protected _type = CommandType.Tsumo;

  constructor(who: RoundHandPlayer) {
    super(who);
  }

  execute(): void {}
}

export class AnKanCommand extends PlayerCommand {
  _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(): void {
    logger.info(`${this.who.name}が${toEmoji(this.tile)} を暗槓しました`);

    this.who.hand.tiles = this.who.hand.tiles.filter((tile) => this.tile != tile);
    this.who.hand.openMentsuList.push(new AnKanMentsu(this.tile));
    this.who.hand.sortTiles();
  }
}

export class KaKanCommand extends PlayerCommand {
  protected _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, public readonly tile: 牌) {
    super(who);
  }

  execute(): void {
    logger.info(`${this.who.name}が${toEmoji(this.tile)} を加槓しました`);

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

  execute(): void {}
}

export class ChankanRonCommand extends RonCommand {
  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}

export class PonCommand extends OtherPlayersCommand {
  protected _type = CommandType.Pon;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {
    let tiles = [this.tile];

    [...Array(2)].map(() => {
      const index = this.who.hand.tiles.indexOf(this.tile);
      tiles = tiles.concat(this.who.hand.tiles.splice(index, 1));
    });

    const mentsu = new MinKouMentsu(this.tile, this.direction);
    this.who.hand.openMentsuList.push(mentsu);
  }
}

export class DaiMinKanCommand extends OtherPlayersCommand {
  protected _type = CommandType.Kan;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}

export class ChiCommand extends OtherPlayersCommand {
  protected _type = CommandType.Chi;

  constructor(who: RoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}
