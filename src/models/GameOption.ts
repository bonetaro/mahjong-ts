import { FourMembers } from "../types";
import { Player, PlayerDrawTiles } from ".";

export class GameOption {
  private _cheat = false;

  constructor(public players: FourMembers<Player>, public cheatOption?: CheatOption) {
    if (cheatOption) {
      this._cheat = true;
    }
  }

  get cheat(): boolean {
    return this._cheat;
  }
}

export class CheatOption {
  constructor(public playerDrawTilesList: FourMembers<PlayerDrawTiles>) {}
}
