import * as readline from "readline";
import prompts from "prompts";
import { logger } from "./logging";
import { Hand } from "./models/Hand";
import { toEmoji, toEmojiMoji } from "./Functions";
import { CommandType } from "./Types";

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

export const selectCommand = async (message: string, hand: Hand, commandTypeList: CommandType[]): Promise<string> => {
  // todo 食い替えを禁止する対応
  const tileChoices = commandTypeList.includes(CommandType.Discard)
    ? hand.tiles.map((tile, index) => {
        return {
          title: toEmojiMoji(tile),
          value: index.toString(),
        };
      })
    : [];

  const commandChoices = commandTypeList
    .filter((type) => type != CommandType.Discard) // 捨てるコマンドは、牌の選択肢を表示するので不要
    .map((type) => {
      return {
        title: CommandType.name(type),
        value: type.toString(),
      };
    });

  return await selectChoices(message, commandChoices.concat(tileChoices));
};

export const selectChoices = async (message: string, choices: Array<{ title: string; value: string }>) => {
  const response = await prompts({
    type: "select",
    name: "choice",
    message,
    choices,
  });

  return response.choice;
};
