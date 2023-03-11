import { List } from "linqts";
import { AnKanMentsu, ChiMentsu, GameRoundHand, MinKanMentsu, MinKouMentsu, GameRoundHandPlayer, Tile } from ".";
import { logger } from "../lib";
import { CommandType, PlayerDirection, 塔子like, 数牌, 牌 } from "../types";

export abstract class BaseCommand {
  protected _type: CommandType;

  constructor(public readonly who: GameRoundHandPlayer) {}

  get type(): CommandType {
    return this._type;
  }

  abstract execute(roundHand: GameRoundHand): void;
}

//-----------------------------

// ツモ番のプレイヤーのコマンド
export abstract class PlayerCommand extends BaseCommand {
  constructor(who: GameRoundHandPlayer) {
    super(who);
  }
}

// 牌を捨てる
export class DiscardCommand extends PlayerCommand {
  constructor(who: GameRoundHandPlayer, public readonly tile: 牌) {
    super(who);
    this._type = "discard";
  }

  execute(roundHand: GameRoundHand): void {
    this.who.discardTile(this.tile);
    this.who.sortHandTiles();
  }
}

// ツモ
export class TsumoCommand extends PlayerCommand {
  constructor(who: GameRoundHandPlayer) {
    super(who);
    this._type = "tsumo";
  }

  execute(roundHand: GameRoundHand): void {}
}

// 暗槓
export class AnKanCommand extends PlayerCommand {
  constructor(who: GameRoundHandPlayer, public readonly tile: 牌) {
    super(who);
    this._type = "kan";
  }

  furo(): void {
    this.who.hand.removeTiles([this.tile, this.tile, this.tile, this.tile]);
    this.who.hand.openMentsuList.push(new AnKanMentsu(this.tile));
  }

  execute(roundHand: GameRoundHand): void {
    logger.info(`「${this.who.name}」が${Tile.toEmoji(this.tile)} を暗槓しました`);

    this.furo();
    this.who.drawTile(roundHand.pickKingsTile());
  }
}

// 加槓
export class KaKanCommand extends PlayerCommand {
  constructor(who: GameRoundHandPlayer, public readonly tile: 牌) {
    super(who);
    this._type = "kan";
  }

  furo(): void {
    let openMentsuList = new List(this.who.hand.openMentsuList);

    // 加槓する牌を手牌から除く
    this.who.hand.removeTile(this.tile);
    // 加槓される明刻から鳴いた相手を取り出す
    const minkouMentsu = openMentsuList.Where((mentsu) => mentsu instanceof MinKouMentsu).Single((mentsu) => mentsu.tiles.includes(this.tile)) as MinKanMentsu;
    // 明槓子
    const minkanMentsu = new MinKanMentsu(this.tile, minkouMentsu.fromPlayerDirection);
    // ベースとなった明刻を除き、作成した明槓子をさらす
    openMentsuList = openMentsuList.Where((mentsu) => !(mentsu instanceof MinKouMentsu && mentsu.tiles.includes(this.tile)));
    openMentsuList.Add(minkanMentsu);

    this.who.hand.openMentsuList = openMentsuList.ToArray();
  }

  execute(roundHand: GameRoundHand): void {
    this.furo();
    this.who.drawTile(roundHand.pickKingsTile());

    logger.info(`「${this.who.name}」が${Tile.toEmoji(this.tile)} を加槓しました`);
  }
}

// ---------------------------------------

// ツモ番以外のプレイヤーのコマンド
export abstract class OtherPlayersCommand extends BaseCommand {
  constructor(who: GameRoundHandPlayer, public readonly direction: PlayerDirection, public readonly tile: 牌) {
    super(who);
  }

  whomPlayer(roundHand: GameRoundHand): GameRoundHandPlayer {
    return roundHand.getPlayerByDirection(this.who, this.direction);
  }
}

// 何もしない
export class NothingCommand extends OtherPlayersCommand {
  constructor() {
    super(null, null, null);
    this._type = "nothing";
  }

  execute(): void {
    // do nothing
  }
}

// ロン
export class RonCommand extends OtherPlayersCommand {
  constructor(who: GameRoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
    this._type = "ron";
  }

  execute(roundHand: GameRoundHand): void {}
}

// 槍槓
export class ChankanRonCommand extends RonCommand {
  constructor(who: GameRoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
  }

  execute(roundHand: GameRoundHand): void {}
}

export class PonCommand extends OtherPlayersCommand {
  constructor(who: GameRoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
    this._type = "pon";
  }

  execute(roundHand: GameRoundHand): void {
    this.who.hand.removeTiles([this.tile, this.tile]);
    const minkouMentsu = new MinKouMentsu(this.tile, this.direction);
    this.who.hand.openMentsuList.push(minkouMentsu);

    // 牌を捨てた人の捨て牌から取り除く（実際はflagをたてるだけ）
    this.whomPlayer(roundHand).discardTiles.slice(-1)[0].meld = true;

    logger.info(`「${this.who.name}」が${Tile.toEmoji(this.tile)} をポンしました`, {
      hand: this.who.hand.debugStatus(),
      discards: this.who.debugDiscardStatus(),
    });
  }
}

// 大明槓
export class DaiMinKanCommand extends OtherPlayersCommand {
  constructor(who: GameRoundHandPlayer, direction: PlayerDirection, tile: 牌) {
    super(who, direction, tile);
    this._type = "kan";
  }

  execute(roundHand: GameRoundHand): void {
    this.who.hand.removeTiles([this.tile, this.tile, this.tile]);
    const minkanMentsu = new MinKanMentsu(this.tile, this.direction);
    this.who.hand.openMentsuList.push(minkanMentsu);

    // 牌を捨てた人の捨て牌から取り除く（実際はflagをたてるだけ）
    this.whomPlayer(roundHand).discardTiles.slice(-1)[0].meld = true;

    logger.info(`「${this.who.name}」が${Tile.toEmoji(this.tile)} を大明槓しました`);
  }
}

// チー
export class ChiCommand extends OtherPlayersCommand {
  private _tiles: 塔子like; // 順子のもとになったターツ

  constructor(who: GameRoundHandPlayer, direction: PlayerDirection = "toTheLeft", tile: 牌, tiles: 塔子like) {
    super(who, direction, tile);
    this._tiles = tiles;
    this._type = "chi";
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

    logger.info(`「${this.who.name}」が${Tile.toEmojiMoji(this.tile)}をチーしました`, {
      hand: this.who.hand.debugStatus(),
      discards: this.who.debugDiscardStatus(),
    });
  }
}
