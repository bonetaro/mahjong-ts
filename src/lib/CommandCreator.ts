import { PlayerCommandType } from "./Constants";
import { Hand } from "./Hand";
import { Player } from "./Player";

export class CommandCreator {
  createPlayerCommandText(commands: PlayerCommandType[], hand: Hand, player?: Player): string {
    let textList: string[] = [];

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

    textList = textList.concat(this.createCommandTextList(commands));

    let commandText = `${textList.join(" ")}> `;

    if (player) {
      commandText = `${player.name}の手牌：${player.hand.status} 捨牌：${player.discardStatus}\n${commandText}`;
    }

    return commandText;
  }

  createCommandTextList(commands: PlayerCommandType[]): string[] {
    const textList: string[] = [];

    if (commands.includes(PlayerCommandType.Tsumo)) {
      textList.push(`ツモ[${PlayerCommandType.Tsumo[0].toLowerCase()}]`);
    }

    if (commands.includes(PlayerCommandType.Ron)) {
      textList.push(`ロン[${PlayerCommandType.Ron[0].toLowerCase()}]`);
    }

    if (commands.includes(PlayerCommandType.Chi)) {
      textList.push(`チー[${PlayerCommandType.Chi[0].toLowerCase()}]`);
    }

    if (commands.includes(PlayerCommandType.Pon)) {
      textList.push(`ポン[${PlayerCommandType.Pon[0].toLowerCase()}]`);
    }

    if (commands.includes(PlayerCommandType.Kan)) {
      textList.push(`カン[${PlayerCommandType.Kan[0].toLowerCase()}]`);
    }

    if (commands.includes(PlayerCommandType.Nothing)) {
      textList.push(`何もしない${commands.length > 1 ? "[その他のキー]}" : ""}`);
    }

    return textList;
  }

  createOtherPlayersCommandText(commands: PlayerCommandType[], hand: Hand): string {
    const textList: string[] = this.createCommandTextList(commands);
    return textList.join(" ");
  }
}
