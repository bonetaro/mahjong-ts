import { CommandType } from "./Types";
import { Hand, RoundHandPlayer } from "./models";

export class CommandTextCreator {
  createPlayerCommandText(commands: CommandType[], player?: RoundHandPlayer): string {
    const textList = this.createCommandTextList(commands);

    let commandText = textList.length > 1 ? `${textList.join("|")} > ` : "";

    if (player) {
      commandText = `${player.status}\n${commandText}`;
    }

    return commandText;
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
