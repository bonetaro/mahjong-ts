/* eslint-disable no-case-declarations */
import { List } from "linqts";
import * as Command from "./models/Command";
import { MinKouMentsu, RoundHandPlayer } from "./models";
import {
  CommandTextCreator,
  FourMembers,
  CommandType,
  isRangeNumber,
  logger,
  selectCommand,
  readCommand,
  toEmojiFromArray,
  牌,
  isMeldCommandType,
  塔子like,
  selectChoices,
  PlayerDirection,
} from ".";
import { HandParser } from "./HandParser";
import { throwErrorAndLogging } from "./error";

export const askAnyKey = async (msg: string): Promise<string> => {
  return readCommand(`${msg} [press any key]`);
};

const askPlayerWhatTileOnKanCommand = async (player: RoundHandPlayer, kanCandidateTiles: 牌[]): Promise<Command.PlayerCommand> => {
  let kanTile: 牌;

  if (kanCandidateTiles.length === 1) {
    kanTile = kanCandidateTiles[0];
  } else {
    const answer = await readCommand(
      `${toEmojiFromArray(kanCandidateTiles)} どの牌を槓しますか？ [0-${kanCandidateTiles.length - 1}] >\n`,
      (input) => input && 0 <= Number(input) && Number(input) < kanCandidateTiles.length
    );

    kanTile = kanCandidateTiles[Number(answer)];
  }

  if (player.hand.tiles.includes(kanTile)) {
    return new Command.AnKanCommand(player, kanTile);
  } else if (player.hand.openMentsuList.filter((mentsu) => mentsu instanceof MinKouMentsu).some((mentsu) => mentsu.tiles.includes(kanTile))) {
    return new Command.KaKanCommand(player, kanTile);
  } else {
    throwErrorAndLogging(kanTile);
  }
};

export const askPlayerWhatCommand = async (player: RoundHandPlayer): Promise<Command.PlayerCommand> => {
  const playerCommandMap = new HandParser(player.hand).parseAsPlayerCommand();

  const playerCommandTypeList = Array.from(playerCommandMap.keys());
  const commandText = new CommandTextCreator().createPlayerCommandText(playerCommandTypeList, player);

  const answer = await selectCommand(commandText, player.hand, playerCommandTypeList);

  const isDiscardTileNumber = (input: string) => isRangeNumber(input, player.hand.tiles.length);
  if (isDiscardTileNumber(answer)) {
    return new Command.DiscardCommand(player, player.hand.tiles[Number(answer)]);
  }

  switch (answer) {
    case CommandType.Tsumo:
      return new Command.TsumoCommand(player);
    case CommandType.Kan:
      // 暗カン or 加カン
      return await askPlayerWhatTileOnKanCommand(player, playerCommandMap.get(CommandType.Kan));
  }

  throwErrorAndLogging(answer);
};

export const askOtherPlayersWhatCommand = async (
  players: FourMembers<RoundHandPlayer>,
  discardTile: 牌,
  whom: RoundHandPlayer
): Promise<Command.BaseCommand> => {
  const otherPlayers = players.filter((player) => player.id != whom.id);
  const possiblePlayerCommandMap = calculatePossiblePlayerCommandMap(otherPlayers, whom);

  const commandTypeList = new List(Array.from(possiblePlayerCommandMap.values()).flatMap((value) => Array.from(value.keys()))).Distinct().ToArray();
  const commandText = new CommandTextCreator().createOtherPlayersCommandText(commandTypeList, whom.hand);

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
    let command: Command.BaseCommand;

    if (isMeldCommandType(answer as CommandType)) {
      // どのコマンドかで、誰が主体かわかるはず
      const possiblePlayers = Array.from(possiblePlayerCommandMap.keys());
      const who = new List(possiblePlayers).Single((p) => {
        const commandTypes = Array.from(possiblePlayerCommandMap.get(p).keys());
        return new List(commandTypes).Any((type) => type === answer);
      });

      const playerDirection = whom.getPlayerDirectionOf(who);

      switch (answer) {
        case CommandType.Pon:
          command = new Command.PonCommand(who, playerDirection, tile);
          break;
        case CommandType.Kan:
          command = new Command.DaiMinKanCommand(who, playerDirection, tile);
          break;
        case CommandType.Chi:
          command = await createChiCommand(who, playerDirection, tile, possiblePlayerCommandMap.get(who).get(CommandType.Chi));
          break;
        default:
          throwErrorAndLogging(answer);
      }
    } else if ((answer as CommandType) == CommandType.Ron) {
      // todo ダブロンの可能性があるので、誰がロンするかは自動判定できない
      // command = new Command.RonCommand(who, playerDirection, tile);
    } else {
      command = new Command.NothingCommand();
    }

    return command;
  }
};

const createChiCommand = async (who: RoundHandPlayer, playerDirection: PlayerDirection, tile: 牌, candidatesList: 牌[][]) => {
  const tarts: 塔子like = await selectTarts();
  const command = new Command.ChiCommand(who, playerDirection, tile, tarts);

  return command;

  async function selectTarts(): Promise<塔子like> {
    if (candidatesList.length > 1) {
      const index = await selectChoices(
        "どの塔子でチーしますか",
        candidatesList.map((c, index) => {
          return { title: toEmojiFromArray(c), value: index.toString() };
        })
      );

      return candidatesList[Number(index)] as 塔子like;
    } else {
      return candidatesList[0] as 塔子like;
    }
  }
};
