import { FourMembers, PlayerDirections, PlayerIndexList } from "../";
import { PlayerDirection, PlayerIndex } from "../Types";
import { RoundHandPlayer } from "./RoundHandPlayer";

export class RoundHandMembers {
  constructor(public readonly players: FourMembers<RoundHandPlayer>) {}

  getPlayer(index: PlayerIndex): RoundHandPlayer {
    return this.players[index as number];
  }

  getPlayerOf(player: RoundHandPlayer, direction: PlayerDirection) {
    const isPlayerIndex = (num: number): num is PlayerIndex => PlayerIndexList.includes(num);

    const index = (player.index + PlayerDirections.indexOf(direction)) % PlayerDirections.length;
    if (isPlayerIndex(index)) {
      return this.players[index];
    }
  }
}
