/* eslint-disable no-constant-condition */
import { logger, LogEvent } from "./logging";
import { 牌 } from "./lib/Types";
import { toTile } from "./lib/Functions";
import { Player } from "./lib/Player";
import { Game, CheatGame } from "./lib/Game";
import { Table } from "./lib/Table";
import { CheatGameRoundHand } from "./lib/GameRoundHand";
import { CheatTableBuilder, PlayerDealedTiles } from "./lib/CheatTableBuilder";
import { Hand } from "./lib/Hand";

export const initGame = (players: Player[]): Game => {
  const game = new Game(players);
  game.init();

  return game;
};

export const initCheatGame = (players: Player[]): CheatGame => {
  const game = new CheatGame(players);
  game.init();
  game.players.map((player) => player.init());

  // 東場作成
  game.createGameRound();

  const builder = new CheatTableBuilder();
  builder.set(new PlayerDealedTiles(new Hand(createCheatTiles()), []), 0);
  builder.set(new PlayerDealedTiles(new Hand(), ["3m"]), 1);

  const roundHand = new CheatGameRoundHand(game.players);
  roundHand.table = new Table(builder.createCheatTable().washedTiles);
  game.currentRound.hands.push(roundHand);

  game.currentRoundHand.table.buildWalls();
  game.currentRoundHand.table.makeDeadWall();

  game.dealStartTilesToPlayers(game.players);
  players.forEach((player) => player.sortHandTiles());

  logger.info("チート半荘開始");
  LogEvent(game.status());

  return game;
};

const createCheatTiles = (): 牌[] => {
  const tiles: string[] = [];
  tiles.push("1m"); // 1
  tiles.push("1m"); // 2
  tiles.push("1m"); // 3
  tiles.push("9m"); // 4
  tiles.push("2m"); // 5
  tiles.push("3m"); // 6
  tiles.push("1m"); // 7
  tiles.push("1p"); // 8
  tiles.push("3m"); // 9
  tiles.push("4m"); // 10
  tiles.push("4m"); // 11
  tiles.push("1s"); // 12
  tiles.push("2s"); // 13

  return tiles.map((tile) => toTile(tile));
};
