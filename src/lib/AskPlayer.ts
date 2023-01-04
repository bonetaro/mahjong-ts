import { logger } from "../logging";
import { rl } from "../readline";
import { 牌 } from "./Types";
import { Game } from "./Game";
import { Player } from "./Player";
import { playerAction, otherPlayersAction } from "./PlayerAction";

export class PlayerAskResult {
  private _tile: 牌;
  private _discard: boolean = false;
  private _kan: boolean = false;
  private _tsumo: boolean = false;

  get kan(): boolean {
    return this._kan;
  }

  get tsumo(): boolean {
    return this._tsumo;
  }

  get discard(): boolean {
    return this._discard;
  }

  get dicardTile(): 牌 {
    return this._discard ? this._tile : null;
  }

  isValid(): boolean {
    return !(this._kan && !this._tsumo && !this._discard);
  }

  doDiscard(tile: 牌) {
    this._discard = true;
    this._tile = tile;
  }

  doKan(tile: 牌) {
    this._kan = true;
    this._tile = tile;
  }

  doTsumo(tile: 牌) {
    this._tsumo = true;
    this._tile = tile;
  }
}

export class OtherPlayersAskResult {
  private _tile: 牌;
  private _kan: boolean = false;
  private _pon: boolean = false;
  private _ron: boolean = false;
  private _chi: boolean = false;
  private _player: Player;

  get Player(): Player {
    return this._player;
  }

  get kan(): boolean {
    return this._kan;
  }

  get pon(): boolean {
    return this._pon;
  }

  get chi(): boolean {
    return this._chi;
  }

  get ron(): boolean {
    return this._ron;
  }

  doKan(tile: 牌, player: Player) {
    this._kan = true;
    this._tile = tile;
    this._player = player;
  }

  doPon(tile: 牌, player: Player) {
    this._pon = true;
    this._tile = tile;
    this._player = player;
  }

  doRon(tile: 牌, player: Player) {
    this._ron = true;
    this._tile = tile;
    this._player = player;
  }

  doChi(tile: 牌, player: Player) {
    this._chi = true;
    this._tile = tile;
    this._player = player;
  }
}

export const askPlayer = async (player: Player): Promise<PlayerAskResult> => {
  return new Promise((resolve, reject) => {
    rl.question(
      `> ${player.name} 捨て牌選択[0-13] ツモ[(t)umo] カン[(k)an]\n`,
      (answer) => {
        return playerAction(player, answer, resolve, reject);
      }
    );
  });
};

export const askOtherPlayers = async (
  players: Player[],
  tile: 牌
): Promise<OtherPlayersAskResult> => {
  logger.info(
    "ほかのプレイヤーたち\n" +
      players
        .map(
          (player, index) =>
            `${player.name}(${index}) 手牌: ${player.handStatus} 捨牌: ${player.discardStatus}`
        )
        .join("\n")
  );

  return new Promise((resolve, reject) => {
    rl.question(
      `> ロン[(r)on] ポン[(p)on] カン[(k)an] チー[(c)hi] 何もしない[rpkcq以外]\n`,
      (answer) => {
        return otherPlayersAction(players, answer, tile, resolve, reject);
      }
    );
  });
};

export const askPlayerLoop = async (
  player: Player
): Promise<PlayerAskResult> => {
  let result: PlayerAskResult;

  while (true) {
    result = await askPlayer(player);
    if (result.isValid()) {
      return result;
    }

    logger.error("無効な操作");
  }
};

export const askOtherPlayersLoop = async (
  game: Game,
  discardTile: 牌
): Promise<OtherPlayersAskResult> => {
  let result: OtherPlayersAskResult;

  while (true) {
    result = await askOtherPlayers(game.otherPlayers, discardTile);

    if (result.ron) {
      // todo
      return result;
    }

    if (result.chi) {
      // todo
    }
    if (result.pon) {
      // todo
    }
    if (result.kan) {
      // todo
    }
  }
};
