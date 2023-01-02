import { Game } from "./lib/Game";
import { Player } from "./lib/Player";

const game = new Game();

game.setPlayers([
  new Player("Aさん"),
  new Player("Bさん"),
  new Player("Cさん"),
  new Player("Dさん"),
]);

game.buildWalls(); // 牌の山を積む
game.start(); // 半荘開始

game.dealTilesToPlayers(); // 配牌

game.players.forEach((player) => player.sortHandTiles());

game.dealer.drawTile(game.table.pickTile());
