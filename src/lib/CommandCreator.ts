import { PlayerCommandType } from "./Constants";
import { Hand } from "./models/Hand";
import { Player } from "./models/Player";

export class CommandCreator {
  createPlayerCommandText(commands: PlayerCommandType[], hand: Hand, player?: Player): string {
    const textList = this.createCommandTextList(commands);

    let commandText = textList.length > 1 ? `${textList.join("|")} > ` : "";

    if (player) {
      commandText = `${this.createPlayerStatusText(player)}\n${commandText}`;
    }

    return commandText;
  }

  createPlayerStatusText(player: Player): string {
    return `${player.name}の手牌 ${player.hand.status} 捨牌 ${player.discardStatus}`;
  }

  createCommandTextList(commands: PlayerCommandType[]): string[] {
    const textList: string[] = [];

    if (commands.includes(PlayerCommandType.Discard)) {
      textList.push(`捨て牌選択`);
    }

    if (commands.includes(PlayerCommandType.Nothing)) {
      textList.push(`何もしない`);
    }

    commands.filter((c) => c != PlayerCommandType.Discard && c != PlayerCommandType.Nothing).forEach((c) => textList.push(PlayerCommandType.name(c)));

    return textList;
  }

  createOtherPlayersCommandText(commands: PlayerCommandType[], hand: Hand): string {
    const textList: string[] = this.createCommandTextList(commands);
    return textList.length > 1 ? `${textList.join("|")} > ` : "";
  }
}
