import { PlayerCommandType } from "./Constants";
import { Hand } from "./Hand";

export class CommandCreator {
  createText(commands: PlayerCommandType[], hand: Hand): string {
    const textList: string[] = [];

    if (commands.includes(PlayerCommandType.Discard)) {
      if (hand.tiles.length === 1) {
        textList.push(`捨て牌[0]`);
        // todo 最大14枚でいいのか？
      } else if (1 < hand.tiles.length && hand.tiles.length <= 14) {
        textList.push(`捨て牌[0-${hand.tiles.length - 1}]`);
      } else {
        throw new Error(hand.tiles.length.toString());
      }
    }

    if (commands.includes(PlayerCommandType.Tsumo)) {
      textList.push(`ツモ[${PlayerCommandType.Tsumo[0].toLowerCase()}]`);
    }

    if (commands.includes(PlayerCommandType.Kan)) {
      textList.push(`カン[${PlayerCommandType.Kan[0].toLowerCase()}]`);
    }

    return `${hand.status}\n${textList.join(" ")}`;
  }
}
