"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("./lib/Game");
const Player_1 = require("./lib/Player");
const game = new Game_1.Game();
game.start();
console.log("game", game);
const player = new Player_1.Player("player1");
for (let i = 0; i < 3; i++) {
    player.takeTiles(game.dealTiles(4));
}
player.takeTiles(game.dealTiles(1));
player.sortTiles();
console.log(player);
//# sourceMappingURL=app.js.map