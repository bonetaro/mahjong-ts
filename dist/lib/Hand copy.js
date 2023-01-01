"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hand = void 0;
const linqts_1 = require("linqts");
class Hand {
    constructor(tiles) {
        // todo sort
        this.hand_of_tiles = this.sort(tiles);
    }
    sort(tiles) {
        return new linqts_1.List(tiles)
            .OrderBy((x) => x[0])
            .OrderBy((x) => x[1])
            .ToArray();
    }
}
exports.Hand = Hand;
//# sourceMappingURL=Hand%20copy.js.map