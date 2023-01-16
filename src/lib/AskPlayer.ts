import { List } from "linqts";
import * as Command from "./models/Command";
import { MinKouMentsu, RoundHandPlayer } from "./models";
import {
  CommandCreator,
  FourMembers,
  PlayerCommandType,
  calucatePlayerDirection,
  isRangeNumber,
  logger,
  readChoices,
  readCommand,
  toEmojiFromArray,
  牌,
} from ".";
import { HandParser } from "./HandParser";
import { isMeldCommandType } from "./Functions";

export const askAnyKey = async (msg: string): Promise<string> => {
  return readCommand(`${msg} [press any key]`);
};

const askAnkanOrKakan = async (kanCandidateTiles: 牌[], player: RoundHandPlayer): Promise<Command.PlayerCommand> => {
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
  } else if (new List(player.hand.openMentsuList).Where((mentsu) => mentsu instanceof MinKouMentsu).Any((mentsu) => mentsu.tiles.includes(kanTile))) {
    return new Command.KaKanCommand(player, kanTile);
  } else {
    throw new Error(kanTile);
  }
};

export const askPlayerCommand = async (player: RoundHandPlayer): Promise<Command.PlayerCommand> => {
  const parsedPlayerCommand = new HandParser(player.hand).parseAsPlayerCommand();

  const playerCommandTypeList = Array.from(parsedPlayerCommand.keys());
  const commandText = new CommandCreator().createPlayerCommandText(playerCommandTypeList, player.hand, player);

  const answer = await readChoices(commandText, player.hand, playerCommandTypeList);

  const isDiscardTileNumber = (input: string) => isRangeNumber(input, player.hand.tiles.length);
  if (isDiscardTileNumber(answer)) {
    return new Command.DiscardCommand(player, player.hand.tiles[Number(answer)]);
  }

  switch (answer) {
    case PlayerCommandType.Tsumo:
      return new Command.TsumoCommand(player);
    case PlayerCommandType.Kan:
      // 暗カン or 加カン
      return await askAnkanOrKakan(parsedPlayerCommand.get(PlayerCommandType.Kan), player);
  }

  throw new Error(answer);
};

export const askOtherPlayers = async (players: FourMembers<RoundHandPlayer>, tile: 牌, whom: RoundHandPlayer): Promise<Command.BaseCommand> => {
  const otherPlayers = players.filter((player) => player.id != whom.id);

  const possiblePlayerCommandMap = calculatePossiblePlayerCommandMap(otherPlayers);
  const possibleCommandTypeList = Array.from(possiblePlayerCommandMap.values()).flatMap((value) => Array.from(value.keys()));

  const commandTypeList = new List(possibleCommandTypeList).Distinct().ToArray();
  const commandText = new CommandCreator().createOtherPlayersCommandText(commandTypeList, whom.hand);

  logger.info(
    "ほかのプレイヤー\n" + otherPlayers.map((player) => `${player.windName}(${player.index}) ${new CommandCreator().createPlayerStatusText(player)}`).join("\n")
  );
  // 実行したいコマンドを選ぶ
  const answer = await readChoices(commandText, null, commandTypeList);

  return generateOtherPlayersCommand(answer, possiblePlayerCommandMap, whom, players, tile);

  function calculatePossiblePlayerCommandMap(otherPlayers: RoundHandPlayer[]) {
    const map = new Map<RoundHandPlayer, Map<PlayerCommandType, 牌[]>>();
    otherPlayers.forEach((player) => {
      map.set(player, new HandParser(player.hand).parseAsOtherPlayersCommand(tile));
    });

    return map;
  }

  function generateOtherPlayersCommand(
    answer: string,
    possiblePlayerCommandMap: Map<RoundHandPlayer, Map<PlayerCommandType, 牌[]>>,
    whom: RoundHandPlayer,
    players: FourMembers<RoundHandPlayer>,
    tile: 牌
  ) {
    let command: Command.BaseCommand;

    if (isMeldCommandType(answer as PlayerCommandType)) {
      // どのコマンドかで、誰が主体かわかるはず
      const possiblePlayers = Array.from(possiblePlayerCommandMap.keys());
      const who = new List(possiblePlayers).Single((p) => {
        const commandTypes = Array.from(possiblePlayerCommandMap.get(p).keys());
        return new List(commandTypes).Any((type) => type === answer);
      });

      const playerDirection = calucatePlayerDirection(who, whom, players);
      switch (answer) {
        case PlayerCommandType.Pon:
          command = new Command.PonCommand(who, playerDirection, tile);
          break;
        case PlayerCommandType.Kan:
          command = new Command.DaiMinKanCommand(who, playerDirection, tile);
          break;
        case PlayerCommandType.Chi:
          command = new Command.ChiCommand(who, playerDirection, tile);
          break;
        default:
          throw new Error(answer);
      }
    } else if ((answer as PlayerCommandType) == PlayerCommandType.Ron) {
      // todo ダブロンの可能性があるので、誰がロンするかは自動判定できない場合がある
      // command = new Command.RonCommand(who, playerDirection, tile);
    } else {
      command = new Command.NothingCommand();
    }

    return command;
  }
};
