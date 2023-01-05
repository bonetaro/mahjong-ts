import { PlayerCommandType } from "./Constants";
import { Player } from "./Player";
import { 牌 } from "./Types";

export abstract class BaseCommand {
  protected _type: PlayerCommandType;
  protected _who: Player;

  get who(): Player {
    return this._who;
  }

  get type(): PlayerCommandType {
    return this._type;
  }

  abstract execute(): void;
}

export abstract class PlayerCommand extends BaseCommand {}

export abstract class OtherPlayersCommand extends BaseCommand {
  protected _whom: Player;
  protected _tile: 牌;

  get whom(): Player {
    return this._whom;
  }

  get tile(): 牌 {
    return this._tile;
  }
}

export class DiscardCommand extends PlayerCommand {
  private _tile: 牌;
  _type = PlayerCommandType.discard;

  get tile(): 牌 {
    return this._tile;
  }

  constructor(who: Player, tile: 牌) {
    super();

    this._who = who;
    this._tile = tile;
  }

  execute(): void {}
}

export class TsumoCommand extends PlayerCommand {
  _type = PlayerCommandType.Tsumo;

  constructor(who: Player) {
    super();

    this._who = who;
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
    super();

    this._who = who;
    this._tile = tile;
  }

  execute(): void {}
}

export class KaKanCommand extends PlayerCommand {
  private _tile: 牌;
  _type = PlayerCommandType.Kan;

  get tile(): 牌 {
    return this._tile;
  }

  constructor(who: Player, tile: 牌) {
    super();

    this._who = who;
    this._tile = tile;
  }

  execute(): void {}
}

export class NothingCommand extends OtherPlayersCommand {
  execute(): void {}
}

export class RonCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Ron;
  _tile: 牌;

  constructor(who: Player, whom: Player, tile: 牌) {
    super();

    this._who = who;
    this._whom = whom;
    this._tile = tile;
  }

  execute(): void {}
}

export class PonCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Pon;

  constructor(who: Player, whom: Player, tile: 牌) {
    super();

    this._who = who;
    this._whom = whom;
    this._tile = tile;
  }

  execute(): void {}
}

export class DaiMinKanCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Kan;

  constructor(who: Player, whom: Player, tile: 牌) {
    super();

    this._who = who;
    this._whom = whom;
    this._tile = tile;
  }

  execute(): void {}
}

export class ChiCommand extends OtherPlayersCommand {
  _type = PlayerCommandType.Chi;

  constructor(who: Player, whom: Player, tile: 牌) {
    super();

    this._who = who;
    this._whom = whom;
    this._tile = tile;
  }

  execute(): void {}
}
