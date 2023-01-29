import { FourMembers, PlayerIndex, PlayerDirection, isPlayerIndex } from "../types";
import { logger, PlayerDirectionList } from "../lib";
import { RoundHandPlayer } from "./";

export class RoundHandMembers {
  constructor(public readonly players: FourMembers<RoundHandPlayer>) {
    logger.info(players.map((p) => p.fullName).join(" | "));
  }

  getPlayer(index: PlayerIndex): RoundHandPlayer {
    return this.players[index];
  }

  getPlayerOf(player: RoundHandPlayer, direction: PlayerDirection): RoundHandPlayer {
    const index = (player.index + PlayerDirectionList.indexOf(direction)) % PlayerDirectionList.length;
    if (isPlayerIndex(index)) {
      return this.players[index];
    }
  }
}
