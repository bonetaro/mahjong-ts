"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hand = void 0;
class Hand {
    constructor(tiles) {
        // todo sort
        this.hand_of_tiles = tiles;
    }
    static parse(text) {
        const textArray = text.match(/.{2}/g);
        if (textArray instanceof (Array)) {
            return textArray;
        }
        throw new Error("parse Error");
    }
}
exports.Hand = Hand;
//# sourceMappingURL=Hand.js.map