"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Hand_1 = require("./Hand");
class Player {
    constructor(name) {
        this.tiles = [];
        this.name = name;
    }
    takeTiles(tiles) {
        this.tiles.push(...tiles);
    }
    sortTiles() {
        this.tiles = new Hand_1.Hand(this.tiles).sort();
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map