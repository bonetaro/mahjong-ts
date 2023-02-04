import { CommandType } from "../types";
import { GameRoundHandPlayer } from "../models";
import { CommandTypeNames } from "../constants";

export class CommandTextCreator {
  constructor(private commands: CommandType[]) {}

  createPlayerCommandText(player?: GameRoundHandPlayer): string {
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
