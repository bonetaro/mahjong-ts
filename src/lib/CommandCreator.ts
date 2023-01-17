import { CommandType } from "./Constants";
import { Hand } from "./models/Hand";
import { RoundHandPlayer } from "./models/Player";

export class CommandCreator {
  createPlayerCommandText(commands: CommandType[], player?: RoundHandPlayer): string {
    const textList = this.createCommandTextList(commands);

    let commandText = textList.length > 1 ? `${textList.join("|")} > ` : "";

    if (player) {
      commandText = `${this.createPlayerStatusText(player)}\n${commandText}`;
    }

    return commandText;
  }

  createPlayerStatusText(player: RoundHandPlayer): string {
    return `${player.name}の手牌 ${player.hand.status} 捨牌 ${player.discardStatus}`;
  }

  createCommandTextList(commands: CommandType[]): string[] {
    const textList: string[] = [];

    if (commands.includes(CommandType.Discard)) {
      textList.push(`捨て牌選択`);
    }

    if (commands.includes(CommandType.Nothing)) {
      textList.push(`何もしない`);
    }

    commands.filter((c) => c != CommandType.Discard && c != CommandType.Nothing).forEach((c) => textList.push(CommandType.name(c)));

    return textList;
  }

  createOtherPlayersCommandText(commands: CommandType[], hand: Hand): string {
    const textList: string[] = this.createCommandTextList(commands);
    return textList.length > 1 ? `${textList.join("|")} > ` : "";
  }
}
