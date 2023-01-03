import { Game } from "../src/lib/Game";
import { Player } from "../src/lib/Player";

const game = new Game();
game.setPlayers([
  new Player("player1"),
  new Player("player2"),
  new Player("player3"),
  new Player("player4"),
]);
game.start();
game.startHand();
game.buildWalls();

const allTilesCount = 136;

test(`initialized tiles is ${allTilesCount}.`, () => {
  expect(game.restTilesCount).toBe(136);
});

const dealedTilesCount = 13;
test(`deal tiles is ${dealedTilesCount}.`, () => {
  const dealedTiles = game.dealTiles(dealedTilesCount);
  expect(dealedTiles.length).toBe(dealedTilesCount);
});

test(`rest tiles is ${
  allTilesCount - dealedTilesCount
} after deal ${dealedTilesCount} tiles.`, () => {
  expect(game.restTilesCount).toBe(allTilesCount - dealedTilesCount);
});
