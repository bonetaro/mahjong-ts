/* eslint-disable no-case-declarations */
import { FourMembers } from "MahjongTypes";
import { List } from "linqts";
import { CommandParser, CommandTextCreator, CustomError, Helper, logger, readCommand, selectCommand } from ".";
import { GameRoundHandPlayer, Tile } from "../models";
import * as Commands from "../models/Command";
import { OtherPlayersCommandType, PlayerDirection, isMeldCommandType, 塔子like, 牌 } from "../types";
import { KanCalculator } from "./calculator";
import selectChoices from "./readline";

export const askAnyKey = async (msg: string): Promise<string> => {
  return readCommand(`${msg} [press any key]`);
};

export const askOtherPlayersWhetherDoChankanIfPossible = (command: Commands.PlayerCommand): Commands.ChankanRonCommand => {
  // todo
  return null;
};

const askPlayerWhatTileOnKanCommand = async (player: GameRoundHandPlayer, candidateTiles: 牌[]): Promise<Commands.PlayerCommand> => {
  let tile: 牌;

  if (candidateTiles.length === 1) {
    tile = candidateTiles[0];
  } else {
    const answer = await readCommand(
      `${Tile.toEmojiArray(candidateTiles)} どの牌をカンしますか？ [0-${candidateTiles.length - 1}] >\n`,
      (input) => 0 <= Number(input) && Number(input) < candidateTiles.length
    );

    tile = candidateTiles[Number(answer)];
  }

  const calculator = new KanCalculator(player.hand);

  if (calculator.canKakan(tile)) {
    return new Commands.KaKanCommand(player, tile);
  }

  if (calculator.getAnkanCandidateTiles().includes(tile)) {
    return new Commands.AnKanCommand(player, tile);
  }

  throw new CustomError(tile);
};

export const askPlayerWhatCommand = async (player: GameRoundHandPlayer): Promise<Commands.PlayerCommand> => {
  const playerCommandMap = new CommandParser(player.hand).parseAsPlayerCommand();

  const playerCommandTypeList = Array.from(playerCommandMap.keys());
  const commandText = new CommandTextCreator(playerCommandTypeList).createPlayerCommandText(player);

  const answer = await selectCommand(commandText, player.hand, playerCommandTypeList);
  switch (answer) {
    case "tsumo":
      return new Commands.TsumoCommand(player);
    case "kan":
      // 暗カン or 加カン。暗槓できる状態で、加槓できる牌を持ってくる場合もあるため
      return await askPlayerWhatTileOnKanCommand(player, playerCommandMap.get("kan"));
    default:
      if (Helper.isRangeNumber(answer, player.hand.tiles.length - 1)) {
        return new Commands.DiscardCommand(player, player.hand.tiles[Number(answer)]);
      }
  }

  throw new CustomError(answer);
};

export const askOtherPlayersWhatCommand = async (
  players: FourMembers<GameRoundHandPlayer>,
  discardTile: 牌,
  currentPlayer: GameRoundHandPlayer
): Promise<Commands.OtherPlayersCommand> => {
  const otherPlayers = players.filter((player) => player.id != currentPlayer.id);
  const possiblePlayerCommandMap = calculatePossibleOtherPlayersCommandMap(otherPlayers, currentPlayer);

  const commandTypeList = new List(Array.from(possiblePlayerCommandMap.values()).flatMap((value) => Array.from(value.keys()))).Distinct().ToArray();
  const commandText = new CommandTextCreator(commandTypeList).createOtherPlayersCommandText();

  logger.info("ほかのプレイヤー\n" + otherPlayers.map((player) => `${player.windName}(${player.index}) ${player.status}`).join("\n"));

  // 実行したいコマンドを選ぶ
  const answer = await selectCommand(commandText, null, commandTypeList);

  if (Helper.includes(commandTypeList, answer)) {
    return await makeOtherPlayersCommand(answer, possiblePlayerCommandMap, currentPlayer, discardTile);
  }

  function calculatePossibleOtherPlayersCommandMap(otherPlayers: GameRoundHandPlayer[], currentPlayer: GameRoundHandPlayer) {
    const otherPlayersCommandMap = new Map<GameRoundHandPlayer, Map<OtherPlayersCommandType, 牌[][]>>();
    otherPlayers.forEach((player) => {
      otherPlayersCommandMap.set(player, new CommandParser(player.hand).parseAsOtherPlayersCommand(discardTile, currentPlayer.isLeftPlayerOf(player)));
    });

    return otherPlayersCommandMap;
  }

  async function makeOtherPlayersCommand(
    answer: OtherPlayersCommandType,
    possiblePlayerCommandMap: Map<GameRoundHandPlayer, Map<OtherPlayersCommandType, 牌[][]>>,
    whom: GameRoundHandPlayer,
    tile: 牌
  ): Promise<Commands.OtherPlayersCommand> {
    let command: Commands.OtherPlayersCommand;

    if (isMeldCommandType(answer)) {
      // どのコマンドかで、誰が主体かわかるはず
      const possiblePlayers = Array.from(possiblePlayerCommandMap.keys());

      const who = new List(possiblePlayers).Single((p) => {
        const commandTypes = Array.from(possiblePlayerCommandMap.get(p).keys());
        return new List(commandTypes).Any((type) => type === answer);
      });

      const playerDirection = whom.getDirectionOf(who);

      switch (answer) {
        case "pon":
          command = new Commands.PonCommand(who, playerDirection, tile);
          break;
        case "kan":
          command = new Commands.DaiMinKanCommand(who, playerDirection, tile);
          break;
        case "chi":
          command = await createChiCommand(who, playerDirection, tile, possiblePlayerCommandMap.get(who).get("chi"));
          break;
        default:
          throw new CustomError(answer);
      }
    } else if (answer == "ron") {
      // todo ダブロンの可能性があるので、誰がロンするかは自動判定できない
      // command = new Command.RonCommand(who, playerDirection, tile);
      throw new CustomError("not implementation");
    } else {
      command = new Commands.NothingCommand();
    }

    return command;
  }
};

const createChiCommand = async (who: GameRoundHandPlayer, playerDirection: PlayerDirection, tile: 牌, candidatesList: 牌[][]): Promise<Commands.ChiCommand> => {
  const tarts: 塔子like = await selectTarts();
  const command = new Commands.ChiCommand(who, playerDirection, tile, tarts);

  return command;

  async function selectTarts(): Promise<塔子like> {
    if (candidatesList.length > 1) {
      const index = await selectChoices(
        "どの塔子でチーしますか",
        candidatesList.map((values, index) => {
          return { name: Tile.toEmojiArray(values), value: index.toString() };
        })
      );

      return candidatesList[Number(index)] as 塔子like;
    } else {
      return candidatesList[0] as 塔子like;
    }
  }
};
