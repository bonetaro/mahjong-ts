"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTiles = void 0;
const MahjongTypeSuits_1 = require("./lib/MahjongTypeSuits");
const MahjongTypeHonours_1 = require("./lib/MahjongTypeHonours");
function initializeSuits(color) {
    const tiles = [...Array(9)]
        .map((_, i) => i + 1)
        .map((n) => {
        switch (color) {
            case "m":
                return (0, MahjongTypeSuits_1.toManzu)(n + color);
            case "p":
                return (0, MahjongTypeSuits_1.toPinzu)(n + color);
            case "s":
                return (0, MahjongTypeSuits_1.toSouzu)(n + color);
        }
    });
    return tiles.concat(tiles).concat(tiles).concat(tiles);
}
function initializeHonours() {
    const tiles = [];
    tiles.push(...["E", "S", "W", "N"].map((d) => {
        return (0, MahjongTypeHonours_1.ToHonours)(d + "Z");
    }));
    tiles.push(...["W", "G", "R"].map((c) => {
        return (0, MahjongTypeHonours_1.ToSangenpai)(c + "D");
    }));
    return tiles.concat(tiles).concat(tiles).concat(tiles);
}
exports.allTiles = [];
exports.allTiles.push(...initializeSuits("m")); // 萬子初期化
exports.allTiles.push(...initializeSuits("p")); // 筒子初期化
exports.allTiles.push(...initializeSuits("s")); // 索子初期化
exports.allTiles.push(...initializeHonours()); // 字牌初期化
//# sourceMappingURL=app.js.map