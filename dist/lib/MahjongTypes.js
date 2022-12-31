"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSouzu = exports.isPinzu = exports.toManzu = exports.isManzu = exports.isSuits = void 0;
function isSuits(value) {
    return new RegExp("^[1-9][mps]$", "g").test(value.toString());
}
exports.isSuits = isSuits;
function isManzu(value) {
    if (isSuits(value)) {
        return new RegExp("^[1-9]m$", "g").test(value);
    }
}
exports.isManzu = isManzu;
function toManzu(value) {
    if (isManzu(value)) {
        return value;
    }
    throw new Error("NOT 萬子牌");
}
exports.toManzu = toManzu;
function isPinzu(suits) {
    return new RegExp("^[1-9]p$", "g").test(suits);
}
exports.isPinzu = isPinzu;
function isSouzu(suits) {
    return new RegExp("^[1-9]s$", "g").test(suits);
}
exports.isSouzu = isSouzu;
//# sourceMappingURL=MahjongTypes.js.map