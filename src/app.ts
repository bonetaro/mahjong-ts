import { logger } from "./lib/logging";
import { Game } from "./lib/Game";
import { Player } from "./lib/Player";

const game = new Game();
game.start();

const player = new Player("player1");

for (let i = 0; i < 3; i++) {
  player.takeTiles(game.dealTiles(4));
  logger.info("プレイヤー１が牌を4枚とる", player.hand);
}

player.takeTiles(game.dealTiles(1));
logger.info("プレイヤー１が牌を1枚とる", player.hand);

player.sortTiles();
logger.info("プレイヤー１が牌を並び替える", player.hand);
