"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hand = void 0;
const linqts_1 = require("linqts");
const Constants_1 = require("./Constants");
const MahjongFunctions_1 = require("./MahjongFunctions");
const typeSortMap = new Map();
Constants_1.TileTypeSort.forEach((x, index) => typeSortMap.set(x, index));
const windSortMap = new Map();
Constants_1.WindsSort.forEach((x, index) => windSortMap.set(x, index));
const dragonSortMap = new Map();
Constants_1.DragonsSort.forEach((x, index) => dragonSortMap.set(x, index));
class Hand {
    constructor(tiles) {
        this.hand_of_tiles = tiles;
    }
    sort() {
        return new linqts_1.List(this.hand_of_tiles)
            .OrderBy((x) => typeSortMap.get(x[1]))
            .ThenBy((x) => {
            const sort = x[0];
            if ((0, MahjongFunctions_1.isSuits)(x))
                return sort;
            if ((0, MahjongFunctions_1.isKazehai)(x))
                return windSortMap.get(sort);
            if ((0, MahjongFunctions_1.isSangenpai)(x))
                return dragonSortMap.get(sort);
            throw new Error(x);
        })
            .ToArray();
    }
}
exports.Hand = Hand;
//# sourceMappingURL=Hand.js.map