"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const linqts_1 = require("linqts");
const Constants_1 = require("./Constants");
const Functions_1 = require("./Functions");
class Game {
    constructor() {
        this._wall = this.initializeTiles();
    }
    get wall() {
        return this._wall;
    }
    start() {
        this.washTiles();
    }
    //洗牌
    washTiles() {
        this._wall = new linqts_1.List(this.wall).OrderBy(() => Math.random()).ToArray();
    }
    //牌を配る
    dealTiles(num) {
        let tiles = [];
        for (let i = 0; i < num; i++) {
            tiles.push(this.dealTile());
        }
        return tiles;
    }
    dealTile() {
        const tile = this.wall.shift();
        return tile;
    }
    initializeTiles() {
        let tiles = new linqts_1.List();
        tiles.AddRange(this.initializeSuits(Constants_1.ManduChar));
        tiles.AddRange(this.initializeSuits(Constants_1.PinduChar));
        tiles.AddRange(this.initializeSuits(Constants_1.SouduChar));
        tiles.AddRange(this.initializeHonors());
        tiles = tiles.Concat(tiles).Concat(tiles).Concat(tiles);
        return tiles.ToArray();
    }
    // 数牌を初期化
    initializeSuits(color) {
        return linqts_1.Enumerable.Range(1, 9)
            .Select((n) => {
            switch (color) {
                case Constants_1.ManduChar:
                    return (0, Functions_1.toManzu)(n + color);
                case Constants_1.PinduChar:
                    return (0, Functions_1.toPinzu)(n + color);
                case Constants_1.SouduChar:
                    return (0, Functions_1.toSouzu)(n + color);
            }
        })
            .ToArray();
    }
    // 字牌を初期化
    initializeHonors() {
        const tiles = [];
        tiles.push(...this.initializeKazehai());
        tiles.push(...this.initializeSangenpai());
        return tiles;
    }
    initializeKazehai() {
        return new linqts_1.List(Constants_1.Winds)
            .Select((n) => {
            return (0, Functions_1.ToKazehai)(n);
        })
            .ToArray();
    }
    initializeSangenpai() {
        return new linqts_1.List(Constants_1.Dragons)
            .Select((n) => {
            return (0, Functions_1.ToSangenpai)(n);
        })
            .ToArray();
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map