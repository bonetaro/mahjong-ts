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
//# sourceMappingURL=Hand.js.map