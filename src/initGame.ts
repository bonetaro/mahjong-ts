import { logger, LogEvent } from "./logging";
import { List } from "linqts";
import { 牌 } from "./lib/Types";
import { Validator } from "./lib/Validator";
import { toTile } from "./lib/Functions";
import { Hand } from "./lib/Hand";
import { Player } from "./lib/Player";
import { CheatTable } from "./lib/Table";
import { Game, CheatGame } from "./lib/Game";
import { Table } from "./lib/Table";
import { CheatGameRoundHand } from "./lib/GameRoundHand";

export const initGame = (players: Player[]): Game => {
  const game = new Game(players);
  game.init();

  return game;
};

export const initCheatGame = (players: Player[]): CheatGame => {
  const game = new CheatGame(players);
  game.init();

  game.players.map((player) => player.init());

  game.createGameRound();

  const cheatHand = new Hand(createCheatTiles().map((tile) => toTile(tile)));
  game.players[0].drawTiles(cheatHand.tiles);

  createCheatGameRoundHand(game, cheatHand);

  game.currentRoundHand.table.buildWalls();
  game.currentRoundHand.table.makeDeadWall();

  // チート配牌ずみなので、配牌分だけ牌を捨てる
  game.dealTiles(cheatHand.tiles.length);

  const otherPlayers = new List(game.players)
    .Where((player, index) => index > 0)
    .Select((player) => player)
    .ToArray();

  game.dealStartTilesToPlayers(otherPlayers);

  players.forEach((player) => player.sortHandTiles());

  logger.info("チート半荘開始");
  LogEvent(game.status());

  return game;
};

const createCheatTiles = (): string[] => {
  const tiles: string[] = [];
  tiles.push("1m"); // 1
  tiles.push("1m"); // 2
  tiles.push("1m"); // 3
  tiles.push("9m"); // 4
  tiles.push("2m"); // 5
  tiles.push("3m"); // 6
  tiles.push("1m"); // 7
  tiles.push("1p"); // 8
  tiles.push("4m"); // 9
  tiles.push("4m"); // 10
  tiles.push("4m"); // 11
  tiles.push("1s"); // 12
  tiles.push("2s"); // 13

  return tiles;
};

const createCheatGameRoundHand = (game: Game, hand: Hand): void => {
  const restTiles = createRestTiles(hand.tiles);
  const roundHand = new CheatGameRoundHand();
  roundHand.table = new CheatTable(hand.tiles.concat(restTiles));
  game.currentRound.hands.push(roundHand);
};

const reverse = (tiles: 牌[]): List<牌> => {
  const reversedTiles = new List(tiles)
    .Select((tile, index) => {
      return {
        tile: tile,
        index,
      };
    })
    .OrderByDescending((item) => item.index)
    .Select((item) => item.tile);

  return reversedTiles;
};

// 引数の牌を加えることで、全ての牌(1種の牌が4枚ずつ136枚)がそろうように残りの牌を生成する
const createRestTiles = (handTiles: 牌[]): 牌[] => {
  const suffleTiles = Table.shuffleTiles(Table.initializeTiles());

  // イカサマ牌を先頭に足して、逆順にする(末尾にイカサマ牌)
  const reversedTiles = reverse(handTiles.concat(suffleTiles));

  // 先頭から多すぎる牌を消していく
  while (true) {
    const group = reversedTiles.GroupBy((t) => t);
    const keys = new List(Object.keys(group)).Where(
      (key) => group[key].length !== 4
    );

    keys.ForEach((key) => reversedTiles.Remove(toTile(key)));

    if (Validator.isValidAllTiles(reversedTiles.ToArray())) {
      break;
    }
  }

  // handTiles以外の残りの牌
  const restTiles = reverse(reversedTiles.ToArray())
    .Take(reversedTiles.Count() - handTiles.length)
    .ToArray();

  return restTiles;
};
