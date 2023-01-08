import { logger } from "../logging";
import { List } from "linqts";
import { readCommand } from "../readline";
import {
  isRangeNumber,
  toEmojiFromArray,
  calucatePlayerDirection,
} from "./Functions";
import { 牌 } from "./Types";
import { Player, RoundHandPlayer } from "./Player";
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
import { MinKouMentsu } from "./Mentsu";
import { KaKanCommand } from "./Command";

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

  parseAsPlayerCommand = (): Map<PlayerCommandType, 牌[]> => {
    const commandList: PlayerCommandType[] = [];
    const map = new Map<PlayerCommandType, 牌[]>();

    commandList.push(PlayerCommandType.Discard);
    map.set(PlayerCommandType.Discard, this._hand.tiles);

    // todo ツモ

    // 暗槓
    const ankanCandidateTiles = this._calculator.ankanCandidate();
    if (ankanCandidateTiles.length > 0) {
      commandList.push(PlayerCommandType.Kan);
      map.set(PlayerCommandType.Kan, ankanCandidateTiles);
    }

    // 加槓
    if (this._calculator.canKakan(this._hand.drawingTile.tile)) {
      commandList.push(PlayerCommandType.Kan);
      map.set(PlayerCommandType.Kan, [this._hand.drawingTile.tile]);
    }

    return map;
  };

  parseAsOtherPlayersCommand = (tile: 牌): Map<PlayerCommandType, 牌[]> => {
    const commandList: PlayerCommandType[] = [];
    const map = new Map<PlayerCommandType, 牌[]>();

    if (this._calculator.canPon(tile)) {
      commandList.push(PlayerCommandType.Pon);
      map.set(PlayerCommandType.Pon, [tile]);
    }

    commandList.push(PlayerCommandType.Nothing);
    map.set(PlayerCommandType.Nothing, []);

    return map;
  };
}

const askKan = async (
  kanCandidateTiles: 牌[],
  player: Player
): Promise<PlayerCommand> => {
  let kanTile: 牌;

  if (kanCandidateTiles.length === 1) {
    kanTile = kanCandidateTiles[0];
  } else {
    const answer = await readCommand(
      `${toEmojiFromArray(kanCandidateTiles)} どの牌を槓しますか？ [0-${
        kanCandidateTiles.length - 1
      }] >\n`,
      (input) =>
        input && 0 <= Number(input) && Number(input) < kanCandidateTiles.length
    );

    kanTile = kanCandidateTiles[Number(answer)];
  }

  if (player.hand.tiles.includes(kanTile)) {
    return new AnKanCommand(player, kanTile);
  } else if (
    new List(player.hand.openMentsuList)
      .Where((mentsu) => mentsu instanceof MinKouMentsu)
      .Any((mentsu) => mentsu.tiles.includes(kanTile))
  ) {
    return new KaKanCommand(player, kanTile);
  } else {
    throw new Error(kanTile);
  }
};

export const askPlayer = async (player: Player): Promise<PlayerCommand> => {
  const parsedPlayerCommand = new HandParser(
    player.hand
  ).parseAsPlayerCommand();

  const playerCommandTypeList = Array.from(parsedPlayerCommand.keys());
  const commandText = new CommandCreator().createPlayerCommandText(
    playerCommandTypeList,
    player.hand
  );

  const isDiscardTileNumber = (input: string) =>
    isRangeNumber(input, player.hand.tiles.length - 1);

  const answer = await readCommand(
    `${player.name}の手牌：${player.hand.status} 捨牌：${player.discardStatus}\n` +
      `${commandText} > `,
    (input) =>
      isDiscardTileNumber(input) ||
      playerCommandTypeList.map((k) => k.slice(0, 1)).includes(input)
  );

  if (isDiscardTileNumber(answer)) {
    return new DiscardCommand(player, player.hand.tiles[Number(answer)]);
  }

  switch (answer) {
    case PlayerCommandType.Tsumo[0]:
      return new TsumoCommand(player);
    case PlayerCommandType.Kan[0]:
      // 暗カン or 加カン
      return await askKan(
        parsedPlayerCommand.get(PlayerCommandType.Kan),
        player
      );
  }

  throw new Error(answer);
};

export const askOtherPlayers = async (
  players: Player[],
  tile: 牌,
  whom: Player
): Promise<OtherPlayersCommand> => {
  const otherPlayers = new List(players)
    .Select((p, index) => new RoundHandPlayer(p, index))
    .Where((p) => p.player != whom);

  logger.info(
    "ほかのプレイヤー\n" +
      otherPlayers
        .Select(
          (player, index) =>
            `${player.windName}:${player.player.name}(${index}) 手牌: ${player.player.hand.status} 捨牌: ${player.player.discardStatus}`
        )
        .ToArray()
        .join("\n")
  );

  players.forEach((player) =>
    logger.debug("debug:", player.hand.debugStatus())
  );

  const possibleCommandMap = new Map<Player, Map<PlayerCommandType, 牌[]>>();
  otherPlayers.ForEach((player) => {
    possibleCommandMap.set(
      player.player,
      new HandParser(player.player.hand).parseAsOtherPlayersCommand(tile)
    );
  });

  const possibleCommandTypeList = Array.from(
    possibleCommandMap.values()
  ).flatMap((value) => {
    return Array.from(value.keys());
  });

  const commandText = new CommandCreator().createOtherPlayersCommandText(
    new List(possibleCommandTypeList).Distinct().ToArray(),
    whom.hand
  );

  const action = await readCommand(
    // `> ロン[(r)on] ポン[(p)on] カン[(k)an] チー[(c)hi] 何もしない[rpkcq以外]\n`
    `${commandText} > `
  );

  let command: PlayerCommand = new NothingCommand(null, null, null);

  if (
    [
      PlayerCommandType.Pon[0],
      PlayerCommandType.Chi[0],
      PlayerCommandType.Kan[0],
      PlayerCommandType.Ron[0],
    ].includes(action.toLocaleLowerCase())
  ) {
    // どのコマンドかで、誰が主体かわかるはず（todo ロンは除く）
    const who = new List(Array.from(possibleCommandMap.keys())).Single((p) =>
      new List(Array.from(possibleCommandMap.get(p).keys())).Any(
        (c) => c[0] === action
      )
    );

    const playerDirection = calucatePlayerDirection(who, whom, players);
    switch (action.toLowerCase()) {
      case PlayerCommandType.Pon[0]:
        command = new PonCommand(who, playerDirection, tile);
        break;
      case PlayerCommandType.Kan[0]:
        command = new DaiMinKanCommand(who, playerDirection, tile);
        break;
      case PlayerCommandType.Chi[0]:
        command = new ChiCommand(who, playerDirection, tile);
        break;
      case PlayerCommandType.Ron[0]:
        command = new RonCommand(who, playerDirection, tile);
        break;
      default:
        throw new Error(action);
    }
  }

  return command as OtherPlayersCommand;
};
