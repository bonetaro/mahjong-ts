import { Game } from "../src/lib/Game";
import { Player } from "../src/lib/Player";

const players = [
  new Player("player1"),
  new Player("player2"),
  new Player("player3"),
  new Player("player4"),
];

const game = new Game(players);
game.start();

const allTilesCount = 136;
const dealedTiles = 13 * 4;
const deadWallTiles = 7 * 2;

test(`tiles is ${
  allTilesCount - dealedTiles - deadWallTiles
} after game started.`, () => {
  expect(game.restTilesCount).toBe(allTilesCount - dealedTiles - deadWallTiles);
});
