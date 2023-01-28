/* eslint-disable no-case-declarations */
import { List } from "linqts";
import {
  CommandTextCreator,
  CommandType,
  FourMembers,
  PlayerDirection,
  isMeldCommandType,
  logger,
  readCommand,
  selectCommand,
  toEmojiArray,
  塔子like,
  牌,
} from ".";
import { CustomError } from "./CustomError";
import { HandParser } from "./HandParser";
import { helper } from "./helper";
import { MinKouMentsu } from "./models";
import * as Commands from "./models/Command";
import { RoundHandPlayer } from "./models/RoundHandPlayer";
import selectChoices from "./readline";

export const askAnyKey = async (msg: string): Promise<string> => {
  return readCommand(`${msg} [press any key]`);
};

export const askOtherPlayersWhetherDoChankanIfPossible = (command: Commands.PlayerCommand): Commands.ChankanRonCommand | null => {
  // todo
  return null;
};

const askPlayerWhatTileOnKanCommand = async (player: RoundHandPlayer, kanCandidateTiles: 牌[]): Promise<Commands.PlayerCommand> => {
  let kanTile: 牌;

  if (kanCandidateTiles.length === 1) {
    kanTile = kanCandidateTiles[0];
  } else {
    const answer = await readCommand(
      `${toEmojiArray(kanCandidateTiles)} どの牌をカンしますか？ [0-${kanCandidateTiles.length - 1}] >\n`,
      (input) => 0 <= Number(input) && Number(input) < kanCandidateTiles.length
    );

    kanTile = kanCandidateTiles[Number(answer)];
  }

  if (player.hand.openMentsuList.filter((mentsu) => mentsu instanceof MinKouMentsu).some((mentsu) => mentsu.tiles.includes(kanTile))) {
    return new Commands.KaKanCommand(player, kanTile);
  } else if (player.hand.tiles.includes(kanTile)) {
    return new Commands.AnKanCommand(player, kanTile);
  } else {
    throw new CustomError(kanTile);
  }
};

export const askPlayerWhatCommand = async (player: RoundHandPlayer): Promise<Commands.PlayerCommand> => {
  const playerCommandMap = new HandParser(player.hand).parseAsPlayerCommand();

  const playerCommandTypeList = Array.from(playerCommandMap.keys());
  const commandText = new CommandTextCreator(playerCommandTypeList).createPlayerCommandText(player);

  const answer = await selectCommand(commandText, player.hand, playerCommandTypeList);

  const isDiscardTileNumber = (input: string) => helper.isRangeNumber(input, player.hand.tiles.length);
  if (isDiscardTileNumber(answer)) {
    return new Commands.DiscardCommand(player, player.hand.tiles[Number(answer)]);
  }

  switch (answer) {
    case CommandType.Tsumo:
      return new Commands.TsumoCommand(player);
    case CommandType.Kan:
      // 暗カン or 加カン
      return await askPlayerWhatTileOnKanCommand(player, playerCommandMap.get(CommandType.Kan));
  }

  throw new CustomError(answer);
};

export const askOtherPlayersWhatCommand = async (
  players: FourMembers<RoundHandPlayer>,
  discardTile: 牌,
  whom: RoundHandPlayer
): Promise<Commands.BaseCommand> => {
  const otherPlayers = players.filter((player) => player.id != whom.id);
  const possiblePlayerCommandMap = calculatePossiblePlayerCommandMap(otherPlayers, whom);

  const commandTypeList = new List(Array.from(possiblePlayerCommandMap.values()).flatMap((value) => Array.from(value.keys()))).Distinct().ToArray();
  const commandText = new CommandTextCreator(commandTypeList).createOtherPlayersCommandText();

  logger.info("ほかのプレイヤー\n" + otherPlayers.map((player) => `${player.windName}(${player.index}) ${player.status}`).join("\n"));

  // 実行したいコマンドを選ぶ
  const answer = await selectCommand(commandText, null, commandTypeList);

  return await makeOtherPlayersCommand(answer, possiblePlayerCommandMap, whom, discardTile);

  function calculatePossiblePlayerCommandMap(otherPlayers: RoundHandPlayer[], whom: RoundHandPlayer) {
    const otherPlayersCommandMap = new Map<RoundHandPlayer, Map<CommandType, 牌[][]>>();
    otherPlayers.forEach((player) => {
      otherPlayersCommandMap.set(player, new HandParser(player.hand).parseAsOtherPlayersCommand(discardTile, whom.isLeftPlayer(player)));
    });

    return otherPlayersCommandMap;
  }

  async function makeOtherPlayersCommand(
    answer: string,
    possiblePlayerCommandMap: Map<RoundHandPlayer, Map<CommandType, 牌[][]>>,
    whom: RoundHandPlayer,
    tile: 牌
  ) {
    let command: Commands.BaseCommand;

    if (isMeldCommandType(answer as CommandType)) {
      // どのコマンドかで、誰が主体かわかるはず
      const possiblePlayers = Array.from(possiblePlayerCommandMap.keys());
      const who = new List(possiblePlayers).Single((p) => {
        possiblePlayerCommandMap.get(p);
        const commandTypes = Array.from(possiblePlayerCommandMap.get(p).keys());
        return new List(commandTypes).Any((type) => type === answer);
      });

      const playerDirection = whom.getPlayerDirectionOf(who);

      switch (answer) {
        case CommandType.Pon:
          command = new Commands.PonCommand(who, playerDirection, tile);
          break;
        case CommandType.Kan:
          command = new Commands.DaiMinKanCommand(who, playerDirection, tile);
          break;
        case CommandType.Chi:
          command = await createChiCommand(who, playerDirection, tile, possiblePlayerCommandMap.get(who).get(CommandType.Chi));
          break;
        default:
          throw new CustomError(answer);
      }
    } else if ((answer as CommandType) == CommandType.Ron) {
      // todo ダブロンの可能性があるので、誰がロンするかは自動判定できない
      // command = new Command.RonCommand(who, playerDirection, tile);
      throw new CustomError("not implementation");
    } else {
      command = new Commands.NothingCommand();
    }

    return command;
  }
};

const createChiCommand = async (who: RoundHandPlayer, playerDirection: PlayerDirection, tile: 牌, candidatesList: 牌[][]) => {
  const tarts: 塔子like = await selectTarts();
  const command = new Commands.ChiCommand(who, playerDirection, tile, tarts);

  return command;

  async function selectTarts(): Promise<塔子like> {
    if (candidatesList.length > 1) {
      const index = await selectChoices(
        "どの塔子でチーしますか",
        candidatesList.map((values, index) => {
          return { name: toEmojiArray(values), value: index.toString() };
        })
      );

      return candidatesList[Number(index)] as 塔子like;
    } else {
      return candidatesList[0] as 塔子like;
    }
  }
};
