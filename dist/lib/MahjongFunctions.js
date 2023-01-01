"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToHonours = exports.ToSangenpai = exports.ToChun = exports.ToHatsu = exports.ToHaku = exports.ToKazehai = exports.ToNorth = exports.ToWest = exports.ToSouth = exports.ToEast = exports.isHonours = exports.isSangenpai = exports.isChun = exports.isHatsu = exports.isHaku = exports.isKazehai = exports.isNorth = exports.isWest = exports.isSouth = exports.isEast = exports.toSuits = exports.toSouzu = exports.toPinzu = exports.toManzu = exports.isSuits = exports.isSouzu = exports.isPinzu = exports.isManzu = exports.toTile = void 0;
const Constants_1 = require("./Constants");
function toTile(value) {
    if (isSuits(value) || isHonours(value))
        return value;
}
exports.toTile = toTile;
function isManzu(value) {
    return new RegExp(`^[1-9]${Constants_1.ManduChar}$`, "g").test(value.toString());
}
exports.isManzu = isManzu;
function isPinzu(value) {
    return new RegExp(`^[1-9]${Constants_1.PinduChar}$`, "g").test(value.toString());
}
exports.isPinzu = isPinzu;
function isSouzu(value) {
    return new RegExp(`^[1-9]${Constants_1.SouduChar}$`, "g").test(value.toString());
}
exports.isSouzu = isSouzu;
function isSuits(value) {
    return isManzu(value) || isPinzu(value) || isSouzu(value);
}
exports.isSuits = isSuits;
function toManzu(value) {
    if (isManzu(value))
        return value;
    throw new Error(`${value} NOT 萬子牌`);
}
exports.toManzu = toManzu;
function toPinzu(value) {
    if (isPinzu(value))
        return value;
    throw new Error(`${value} NOT 筒子牌`);
}
exports.toPinzu = toPinzu;
function toSouzu(value) {
    if (isSouzu(value))
        return value;
    throw new Error(`${value} NOT 索子牌`);
}
exports.toSouzu = toSouzu;
function toSuits(value) {
    if (isSuits(value))
        return value;
    throw new Error(`${value} NOT 数牌`);
}
exports.toSuits = toSuits;
function isEast(value) {
    return value.toString() === `${Constants_1.EastWindChar}${Constants_1.KazehaiChar}`;
}
exports.isEast = isEast;
function isSouth(value) {
    return value.toString() === `${Constants_1.SouduChar}${Constants_1.KazehaiChar}`;
}
exports.isSouth = isSouth;
function isWest(value) {
    return value.toString() === `${Constants_1.WestWindChar}${Constants_1.KazehaiChar}`;
}
exports.isWest = isWest;
function isNorth(value) {
    return value.toString() === `${Constants_1.NorthWindChar}${Constants_1.KazehaiChar}`;
}
exports.isNorth = isNorth;
function isKazehai(value) {
    return isEast(value) || isSouth(value) || isWest(value) || isNorth(value);
}
exports.isKazehai = isKazehai;
function isHaku(value) {
    return value.toString() === `${Constants_1.WhiteDragonChar}${Constants_1.SangenpaiChar}`;
}
exports.isHaku = isHaku;
function isHatsu(value) {
    return value.toString() === `${Constants_1.GreenDragonChar}${Constants_1.SangenpaiChar}`;
}
exports.isHatsu = isHatsu;
function isChun(value) {
    return value.toString() === `${Constants_1.RedDragonChar}${Constants_1.SangenpaiChar}`;
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
//# sourceMappingURL=MahjongFunctions.js.map