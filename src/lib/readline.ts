import * as readline from "readline";
import { logger } from "./logging";
import { Hand } from "./Hand";
import { toEmoji, toKanji } from "./Functions";
import inquirer from "inquirer";
import { PlayerCommandType } from "./Constants";

const readInput = async (message: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    rl.question(message, (ans) => {
      resolve(ans);
      rl.close();
    });
  });
};

export const readCommand = async (message: string, condition?: (input: string) => boolean): Promise<string> => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ans = await readInput(message);

    if (!condition || condition(ans)) {
      return ans;
    }

    logger.error(`無効です。もう一度入力してください。`);
  }
};

export const readChoices = async (message: string, hand: Hand, commandTypeList: PlayerCommandType[]): Promise<string> => {
  const tileChoices = commandTypeList.includes(PlayerCommandType.Discard)
    ? hand.tiles.map((tile, index) => {
        return {
          key: tile.toString(),
          name: `${toEmoji(tile)} (${toKanji(tile)})`,
          value: index.toString(),
        };
      })
    : [];

  const commandChoices = commandTypeList
    .filter((type) => type != PlayerCommandType.Discard) // 捨てるコマンドは、そもそも牌の選択肢を表示するので不要
    .map((type) => {
      return {
        key: type.toString(),
        name: PlayerCommandType.name(type),
        value: type.toString(),
      };
    });

  return inquirer
    .prompt([
      {
        type: "list",
        name: "answer",
        message,
        choices: tileChoices.concat(commandChoices),
        pageSize: tileChoices.concat(commandChoices).length + 1,
      },
    ])
    .then((input: any) => {
      return input.answer as string;
    });
};
