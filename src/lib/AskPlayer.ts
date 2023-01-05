import { logger } from "../logging";
import { readCommand } from "../readline";
import { isRangeNumber } from "./Functions";
import { 牌 } from "./Types";
import { Player } from "./Player";
import {
  AnKanCommand,
  ChiCommand,
  DiscardCommand,
  KaKanCommand,
  DaiMinKanCommand,
  NothingCommand,
  OtherPlayersCommand,
  PlayerCommand,
  PonCommand,
  RonCommand,
  TsumoCommand,
} from "./Command";

export const anyKeyAsk = async (msg: string): Promise<string> => {
  return readCommand(`${msg} [press any key]`);
};

export const askPlayer = async (player: Player): Promise<PlayerCommand> => {
  const answer = await readCommand(
    `${player.name} 捨て牌選択[0-13] ツモ[(t)umo] カン[(k)an] >\n`,
    (input) => isRangeNumber(input, 13) || ["t", "k"].includes(input)
  );

  if (isRangeNumber(answer, 13)) {
    const discardTile = player.discard(Number(answer));
    return new DiscardCommand(player, discardTile);
  }

  switch (answer) {
    case "t":
      return new TsumoCommand(player);
    case "k":
      // 暗カン or 加カン
      const answer = await readCommand(
        `${player.name} 選択[0-3] >\n`,
        (input) => isRangeNumber(input, 3)
      );
  }

  throw new Error(answer);
};

export const askOtherPlayers = async (
  players: Player[],
  tile: 牌,
  player: Player
): Promise<OtherPlayersCommand> => {
  logger.info(
    "ほかのプレイヤーたち\n" +
      players
        .map(
          (player, index) =>
            `${player.name}(${index}) 手牌: ${player.handStatus} 捨牌: ${player.discardStatus}`
        )
        .join("\n")
  );

  const action = await readCommand(
    `> ロン[(r)on] ポン[(p)on] カン[(k)an] チー[(c)hi] 何もしない[rpkcq以外]\n`
  );

  let command = new NothingCommand();

  if (["p", "k", "c", "r"].includes(action)) {
    const whoNum = await readCommand(`> 誰が?[0-3]\n`, (input) =>
      isRangeNumber(input, 3)
    );

    switch (action.toLowerCase()) {
      case "p":
        command = new PonCommand(player, players[Number(whoNum)], tile);
      case "k":
        command = new DaiMinKanCommand(player, players[Number(whoNum)], tile);
      case "c":
        command = new ChiCommand(player, players[Number(whoNum)], tile);
      case "r":
        command = new RonCommand(player, players[Number(whoNum)], tile);
      default:
        throw new Error(action);
    }
  }

  return command;
};
