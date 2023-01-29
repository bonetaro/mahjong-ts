import inquirer from "inquirer";
import * as readline from "readline";
import { CommandTypeNames, logger } from ".";
import { Hand, Tile } from "../models";
import { CommandType, HandTilesIndex, isCommandType, isHandTilesIndex } from "../types";

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

// todo コマンドによって戻り値の型を変える
export const selectCommand = async (message: string, hand: Hand, commandTypeList: CommandType[]): Promise<CommandType | HandTilesIndex> => {
  // todo 食い替えを禁止する対応

  const tileChoices = commandTypeList.includes("discard")
    ? hand.tiles.map((tile, index) => {
        return {
          name: Tile.toEmojiMoji(tile),
          value: index.toString(),
        };
      })
    : [];

  const commandChoices = commandTypeList
    .filter((type) => type != "discard") // 捨てるコマンドは、牌の選択肢を表示するので不要
    .map((type) => {
      return {
        name: CommandTypeNames[type],
        value: type.toString(),
      };
    });

  const choice = await selectChoices(message, commandChoices.concat(tileChoices));

  if (isCommandType(choice) || isHandTilesIndex(choice)) {
    return choice;
  }
};

const selectChoices = async (message: string, choices: Array<{ name: string; value: string }>) => {
  const response = await inquirer.prompt({
    type: "list",
    name: "choice",
    message,
    choices,
    pageSize: choices.length,
  });

  return response.choice;
};

export default selectChoices;
