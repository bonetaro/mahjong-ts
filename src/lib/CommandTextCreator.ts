import { CommandType } from "./Constants";
import { RoundHandPlayer } from "./models/RoundHandPlayer";

export class CommandTextCreator {
  constructor(private commands: CommandType[]) {}

  createPlayerCommandText(player?: RoundHandPlayer): string {
    const textList = this.createCommandTextList();

    let commandText = textList.length > 1 ? `${textList.join("|")} > ` : "";

    if (player) {
      commandText = `${player.status}\n${commandText}`;
    }

    return commandText;
  }

  createCommandTextList(): string[] {
    const textList: string[] = [];

    if (this.commands.includes(CommandType.Discard)) {
      textList.push(`捨て牌選択`);
    }

    if (this.commands.includes(CommandType.Nothing)) {
      textList.push(`何もしない`);
    }

    this.commands.filter((c) => c != CommandType.Discard && c != CommandType.Nothing).forEach((c) => textList.push(CommandType.name(c)));

    return textList;
  }

  createOtherPlayersCommandText(): string {
    const textList: string[] = this.createCommandTextList();
    return textList.length > 1 ? `${textList.join("|")} > ` : "";
  }
}
