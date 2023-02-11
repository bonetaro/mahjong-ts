import { FourMembers, PlayerIndex, PlayerDirection, isPlayerIndex } from "../types";
import { logger } from "../lib";
import { GameRoundHandPlayer } from ".";

export class GameRoundHandMembers {
  constructor(public readonly players: FourMembers<GameRoundHandPlayer>) {
    logger.info(players.map((p) => p.fullName).join(" | "));
  }

  getPlayer(index: PlayerIndex): GameRoundHandPlayer {
    return this.players[index];
  }

  getPlayerByDirection(player: GameRoundHandPlayer, direction: PlayerDirection): GameRoundHandPlayer {
    const index = player.calculateIndex(direction);

    if (isPlayerIndex(index)) {
      return this.players[index];
    }
  }
}
