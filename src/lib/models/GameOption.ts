import { PlayerDrawTiles } from "../CheatTableBuilder";

export class GameOption {
  private _cheat = false;

  constructor(public cheatOption?: CheatOption) {
    if (cheatOption) {
      this._cheat = true;
    }
  }

  get cheat(): boolean {
    return this._cheat;
  }
}

export class CheatOption {
  constructor(public playerDrawTilesList: PlayerDrawTiles[]) {
    if (playerDrawTilesList.length > 4) {
      throw new Error(`${playerDrawTilesList.length}`);
    }
  }
}
