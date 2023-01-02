import { Game } from "./lib/Game";
import { Player } from "./lib/Player";

const game = new Game();

game.setPlayers([
  new Player("Aさん"),
  new Player("Bさん"),
  new Player("Cさん"),
  new Player("Dさん"),
]);

game.buildWalls();
game.start();
game.dealTilesToPlayers();

game.players.forEach((player) => player.sortHandTiles());
