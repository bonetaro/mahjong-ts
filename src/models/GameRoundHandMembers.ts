import { FourMembers, PlayerIndex, PlayerDirection, isPlayerIndex } from "../types";
import { logger, PlayerDirectionList } from "../lib";
import { GameRoundHandPlayer } from ".";

export class GameRoundHandMembers {
  constructor(public readonly players: FourMembers<GameRoundHandPlayer>) {
    logger.info(players.map((p) => p.fullName).join(" | "));
  }

  getPlayer(index: PlayerIndex): GameRoundHandPlayer {
    return this.players[index];
  }

  getPlayerOf(player: GameRoundHandPlayer, direction: PlayerDirection): GameRoundHandPlayer {
    const index = (player.index + PlayerDirectionList.indexOf(direction)) % PlayerDirectionList.length;
    if (isPlayerIndex(index)) {
      return this.players[index];
    }
  }
}
