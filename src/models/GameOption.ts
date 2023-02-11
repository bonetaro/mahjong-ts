import { FourMembers } from "../types";
import { Player, PlayerDrawTiles } from ".";

export class GameOption {
  constructor(public players: FourMembers<Player>, public cheatOption?: CheatOption) {}
}

export class CheatOption {
  constructor(public playerDrawTilesList: FourMembers<PlayerDrawTiles>) {}
}
