import { Player } from ".";
import { PlayerDrawTiles } from "./PlayerDrawTiles";
import { FourMembers } from "../Types";

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
