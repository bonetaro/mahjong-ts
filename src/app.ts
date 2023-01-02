import { Game } from "./lib/Game";
import { Player } from "./lib/Player";

const game = new Game();

game.setPlayers([
  new Player("Aさん"),
  new Player("Bさん"),
  new Player("Cさん"),
  new Player("Dさん"),
]);

game.start(); // 半荘開始
game.startHand(); // 東場第1局

game.showStatus();

// 親の第1ツモ
game.dealer.drawTile(game.table.pickTile());
