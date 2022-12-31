"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSuits = exports.toSouzu = exports.toPinzu = exports.toManzu = exports.isSuits = exports.isSouzu = exports.isPinzu = exports.isManzu = void 0;
function isManzu(value) {
    return new RegExp("^[1-9]m$", "g").test(value.toString());
}
exports.isManzu = isManzu;
function isPinzu(value) {
    return new RegExp("^[1-9]p$", "g").test(value.toString());
}
exports.isPinzu = isPinzu;
function isSouzu(value) {
    return new RegExp("^[1-9]s$", "g").test(value.toString());
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
//# sourceMappingURL=MahjongTypeSuits.js.map