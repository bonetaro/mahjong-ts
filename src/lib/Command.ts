import { List } from "linqts";
import { PlayerCommandType, PlayerDirection } from "./Constants";
import { AnKanMentsu, MinKanMentsu, MinKouMentsu } from "./Mentsu";
import { Player } from "./Player";
import { 牌 } from "./Types";
import { GameRoundHand } from "./GameRoundHand";

export abstract class BaseCommand {
  protected _type: PlayerCommandType;
  protected _who: Player;

  constructor(who: Player) {
    this._who = who;
  }

  get who(): Player {
    return this._who;
  }

  get type(): PlayerCommandType {
    return this._type;
  }

  abstract execute(roundHand: GameRoundHand): void;
}

export abstract class PlayerCommand extends BaseCommand {}

export abstract class OtherPlayersCommand extends BaseCommand {
  protected _direction: PlayerDirection;
  protected _tile: 牌;

  constructor(who: Player, direction: PlayerDirection, tile: 牌) {
    super(who);
    this._direction = direction;
    this._tile = tile;
  }

  whomPlayer(roundHand: GameRoundHand): Player {
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
  _type = PlayerCommandType.Discard;

  get tile(): 牌 {
    return this._tile;
  }

  constructor(who: Player, tile: 牌) {
    super(who);
    this._tile = tile;
  }

  execute(): void {
    this._who.doDiscard(this._tile);
    this._who.sortHandTiles();
  }
}

export class TsumoCommand extends PlayerCommand {
  _type = PlayerCommandType.Tsumo;

  constructor(who: Player) {
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

  constructor(who: Player, tile: 牌) {
    super(who);
    this._tile = tile;
  }

  execute(): void {
    this.who.hand.tiles = new List(this.who.hand.tiles)
      .Where((tile) => this._tile != tile)
      .ToArray();

    this.who.hand.openMentsuList.push(
      new AnKanMentsu([this._tile, this._tile, this._tile, this._tile])
    );

    this.who.hand.sortTiles();
  }
}

export class KaKanCommand extends PlayerCommand {
  private _tile: 牌;
  _type = PlayerCommandType.Kan;

  get tile(): 牌 {
    return this._tile;
  }

  constructor(who: Player, tile: 牌) {
    super(who);
    this._tile = tile;
  }

  execute(): void {
    // 加槓するファイルを手牌から除く
    this.who.hand.tiles = new List(this.who.hand.tiles)
      .Where((tile) => this._tile != tile)
      .ToArray();

    // 加槓されるベースとなる明刻
    const minkouMentsu = new List(this.who.hand.openMentsuList)
      .Where((mentsu) => mentsu instanceof MinKouMentsu)
      .Single((mentsu) => mentsu.tiles.includes(this._tile)) as MinKanMentsu;

    const mentsuList = this.who.hand.openMentsuList;

    // 副露している面子から加槓する面子を取り除く
    new List(this.who.hand.openMentsuList)
      .RemoveAll(() => true)
      .AddRange(
        new List(mentsuList)
          .Where(
            (mentsu) =>
              !(
                mentsu instanceof MinKouMentsu &&
                mentsu.tiles.includes(this.tile)
              )
          )
          .ToArray()
      );

    // 加槓面子を作成して追加
    this.who.hand.openMentsuList.push(
      new MinKanMentsu(this.tile, minkouMentsu.tiles, minkouMentsu.fromPlayer)
    );
  }
}

export class NothingCommand extends OtherPlayersCommand {
  execute(): void {
    // do nothing
  }
}

export class RonCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Ron;
  _tile: 牌;

  constructor(who: Player, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}

export class PonCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Pon;

  constructor(who: Player, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {
    this.who.hand.tiles = new List(this.who.hand.tiles)
      .Where((tile) => this._tile != tile)
      .ToArray();

    this.who.hand.openMentsuList.push(
      new MinKouMentsu(
        this._tile,
        [this._tile, this._tile],
        this.whomPlayer(roundHand)
      )
    );
  }
}

export class DaiMinKanCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Kan;

  constructor(who: Player, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}

export class ChiCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Chi;

  constructor(who: Player, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(): void {}
}
