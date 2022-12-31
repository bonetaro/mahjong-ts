"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToHonours = exports.ToSangenpai = exports.ToChun = exports.ToHatsu = exports.ToHaku = exports.ToKazehai = exports.ToNorth = exports.ToWest = exports.ToSouth = exports.ToEast = exports.isHonours = exports.isSangenpai = exports.isChun = exports.isHatsu = exports.isHaku = exports.isKazehai = exports.isNorth = exports.isWest = exports.isSouth = exports.isEast = void 0;
function isEast(value) {
    return value.toString() === "EZ";
}
exports.isEast = isEast;
function isSouth(value) {
    return value.toString() === "SZ";
}
exports.isSouth = isSouth;
function isWest(value) {
    return value.toString() === "WZ";
}
exports.isWest = isWest;
function isNorth(value) {
    return value.toString() === "NZ";
}
exports.isNorth = isNorth;
function isKazehai(value) {
    return isEast(value) || isSouth(value) || isWest(value) || isNorth(value);
}
exports.isKazehai = isKazehai;
function isHaku(value) {
    return value.toString() === "WD";
}
exports.isHaku = isHaku;
function isHatsu(value) {
    return value.toString() === "GD";
}
exports.isHatsu = isHatsu;
function isChun(value) {
    return value.toString() === "RD";
}
exports.isChun = isChun;
function isSangenpai(value) {
    return isHaku(value) || isHatsu(value) || isChun(value);
}
exports.isSangenpai = isSangenpai;
function isHonours(value) {
    return isKazehai(value) || isSangenpai(value);
}
exports.isHonours = isHonours;
function ToEast(value) {
    if (isEast(value))
        return value;
    throw new Error(`${value} NOT 東`);
}
exports.ToEast = ToEast;
function ToSouth(value) {
    if (isSouth(value))
        return value;
    throw new Error(`${value} NOT 南`);
}
exports.ToSouth = ToSouth;
function ToWest(value) {
    if (isWest(value))
        return value;
    throw new Error(`${value} NOT 西`);
}
exports.ToWest = ToWest;
function ToNorth(value) {
    if (isNorth(value))
        return value;
    throw new Error(`${value} NOT 北`);
}
exports.ToNorth = ToNorth;
function ToKazehai(value) {
    if (isKazehai(value))
        return value;
    throw new Error(`${value} NOT 風牌`);
}
exports.ToKazehai = ToKazehai;
function ToHaku(value) {
    if (isHaku(value))
        return value;
    throw new Error(`${value} NOT 白`);
}
exports.ToHaku = ToHaku;
function ToHatsu(value) {
    if (isHatsu(value))
        return value;
    throw new Error(`${value} NOT 發`);
}
exports.ToHatsu = ToHatsu;
function ToChun(value) {
    if (isChun(value))
        return value;
    throw new Error(`${value} NOT 中`);
}
exports.ToChun = ToChun;
function ToSangenpai(value) {
    if (isSangenpai(value))
        return value;
    throw new Error(`${value} NOT 三元牌`);
}
exports.ToSangenpai = ToSangenpai;
function ToHonours(value) {
    if (isHonours(value))
        return value;
    throw new Error(`${value} NOT 字牌`);
}
exports.ToHonours = ToHonours;
//# sourceMappingURL=MahjongTypeHonours.js.map