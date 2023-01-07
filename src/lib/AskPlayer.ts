import { logger } from "../logging";
import { readCommand } from "../readline";
import { isRangeNumber, toEmojiFromArray } from "./Functions";
import { 牌 } from "./Types";
import { Player } from "./Player";
import {
  ChiCommand,
  DiscardCommand,
  DaiMinKanCommand,
  NothingCommand,
  OtherPlayersCommand,
  PlayerCommand,
  PonCommand,
  RonCommand,
  TsumoCommand,
  AnKanCommand,
} from "./Command";
import { MentsuCalculator } from "./MetsuCalculator";
import { PlayerCommandType } from "./Constants";
import { CommandCreator } from "./CommandCreator";
import { Hand } from "./Hand";

export const anyKeyAsk = async (msg: string): Promise<string> => {
  return readCommand(`${msg} [press any key]`);
};

class HandParser {
  private _hand: Hand;
  private _calculator: MentsuCalculator;

  constructor(hand: Hand) {
    this._hand = hand;
    this._calculator = new MentsuCalculator(this._hand);
  }

  calculate(): MentsuCalculator {
    return this._calculator;
  }

  parse = (): Map<PlayerCommandType, 牌[]> => {
    const commandList: PlayerCommandType[] = [];
    const map = new Map<PlayerCommandType, 牌[]>();

    commandList.push(PlayerCommandType.Discard);
    map.set(PlayerCommandType.Discard, this._hand.tiles);

    // todo ツモ

    const ankanCandidateTiles = this._calculator.ankanCandidate();
    if (ankanCandidateTiles.length > 0) {
      commandList.push(PlayerCommandType.Kan);
      map.set(PlayerCommandType.Kan, ankanCandidateTiles);
    }

    // todo 加槓

    return map;
  };
}

const askKan = async (ankanCandidateTiles: 牌[]): Promise<牌> => {
  let ankanTile: 牌;

  if (ankanCandidateTiles.length === 1) {
    ankanTile = ankanCandidateTiles[0];
  } else {
    const answer = await readCommand(
      `${toEmojiFromArray(ankanCandidateTiles)} どの牌を槓しますか？ [0-${
        ankanCandidateTiles.length - 1
      }] >\n`,
      (input) =>
        input &&
        0 <= Number(input) &&
        Number(input) < ankanCandidateTiles.length
    );

    ankanTile = ankanCandidateTiles[Number(answer)];
  }

  return ankanTile;
};

export const askPlayer = async (player: Player): Promise<PlayerCommand> => {
  const parsedCommand = new HandParser(player.hand).parse();
  const commandText = new CommandCreator().createText(
    Array.from(parsedCommand.keys()),
    player.hand
  );

  const answer = await readCommand(
    `${player.name}の手牌：${player.hand.status}\n${commandText} > `,
    (input) =>
      isRangeNumber(input, 13) ||
      Array.from(parsedCommand.keys())
        .map((k) => k.slice(0, 1))
        .includes(input)
  );

  if (isRangeNumber(answer, 13)) {
    const discardTile = player.doDiscard(Number(answer));
    return new DiscardCommand(player, discardTile);
  }

  switch (answer) {
    case "t":
      return new TsumoCommand(player);
    case "k":
      // 暗カン or 加カン
      const ankanTile = await askKan(parsedCommand.get(PlayerCommandType.Kan));
      return new AnKanCommand(player, ankanTile);
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
        break;
      case "k":
        command = new DaiMinKanCommand(player, players[Number(whoNum)], tile);
        break;
      case "c":
        command = new ChiCommand(player, players[Number(whoNum)], tile);
        break;
      case "r":
        command = new RonCommand(player, players[Number(whoNum)], tile);
        break;
      default:
        throw new Error(action);
    }

    command.execute();
  }

  return command;
};
