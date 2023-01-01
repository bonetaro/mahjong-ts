import { Game } from "./lib/Game";
import { Player } from "./lib/Player";

const game = new Game();
game.start();

console.log("game", game);

const player = new Player("player1");

for (let i = 0; i < 3; i++) {
  player.takeTiles(game.dealTiles(4));
}

player.takeTiles(game.dealTiles(1));
player.sortTiles();

console.log(player);
