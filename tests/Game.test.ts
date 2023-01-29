import { Player, GameOption, Game } from "../src/models";
import { FourMembers } from "../src/types/MahjongTypes";

const players = [new Player("player1"), new Player("player2"), new Player("player3"), new Player("player4")];
const option = new GameOption(players as FourMembers<Player>);

const game = new Game(option);
game.init();
game.startRoundHand();

const allTilesCount = 136;
const dealedTiles = 13 * 4;
const deadWallTiles = 7 * 2;

test(`tiles is ${allTilesCount - dealedTiles - deadWallTiles} after game started.`, () => {
  expect(game.currentRoundHand.table.restTilesCount).toBe(allTilesCount - dealedTiles - deadWallTiles);
});
