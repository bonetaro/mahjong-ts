import { CommandType, CommandTypeNames } from "../types";
import { RoundHandPlayer } from "../models";

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
    return this.commands.map((c) => CommandTypeNames[c]);
  }

  createOtherPlayersCommandText(): string {
    const textList: string[] = this.createCommandTextList();
    return textList.length > 1 ? `${textList.join("|")} > ` : "";
  }
}
