class Hand {
    constructor(tiles) {
        if (tiles.length != 13) {
            throw new Error("配牌エラー");
        }
        // todo sort
        this.hand_of_tiles = [
            tiles[0],
            tiles[1],
            tiles[2],
            tiles[3],
            tiles[4],
            tiles[5],
            tiles[6],
            tiles[7],
            tiles[8],
            tiles[9],
            tiles[10],
            tiles[11],
            tiles[12],
            null,
        ];
    }
}
class Player {
}
//# sourceMappingURL=MahjongClass.js.map