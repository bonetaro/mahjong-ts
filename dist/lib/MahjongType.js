"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTile = void 0;
const MahjongTypeSuits_1 = require("./MahjongTypeSuits");
const MahjongTypeHonours_1 = require("./MahjongTypeHonours");
function toTile(value) {
    if ((0, MahjongTypeSuits_1.isSuits)(value) || (0, MahjongTypeHonours_1.isHonours)(value))
        return value;
}
exports.toTile = toTile;
//# sourceMappingURL=MahjongType.js.map