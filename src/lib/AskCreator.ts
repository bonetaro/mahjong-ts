import { readCommand } from "../readline";
import { isRangeNumber } from "./Functions";
import { Player } from "./Player";
import { PlayerCommandType } from "./Constants";

export class AskCreator {
  static create(
    commandTypes: PlayerCommandType[],
    player: Player
  ): () => Promise<string> {
    const func = () => {
      return readCommand(
        this.createMessage(commandTypes, player),
        (input) => isRangeNumber(input, 13) || ["t", "k"].includes(input)
      );
    };

    return func;
  }

  static createMessage(
    commandTypes: PlayerCommandType[],
    player: Player
  ): string {
    const messageList: string[] = [];

    commandTypes.forEach((type) => {
      switch (type) {
        case PlayerCommandType.Discard:
          messageList.push("捨て牌選択");
          break;
      }
    });

    return messageList.join(" ");
  }
}
