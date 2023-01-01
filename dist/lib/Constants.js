"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragonsSort = exports.WindsSort = exports.Dragons = exports.Winds = exports.TileTypeSort = exports.RedDragonChar = exports.GreenDragonChar = exports.WhiteDragonChar = exports.SangenpaiChar = exports.NorthWindChar = exports.WestWindChar = exports.SouthWindChar = exports.EastWindChar = exports.KazehaiChar = exports.SouduChar = exports.PinduChar = exports.ManduChar = void 0;
exports.ManduChar = "m"; // 萬子 Characters
exports.PinduChar = "p"; // 筒子 Wheels
exports.SouduChar = "s"; // 索子 Bamboos
exports.KazehaiChar = "w"; // 風牌 Winds
exports.EastWindChar = "e"; // 東
exports.SouthWindChar = "s"; // 南
exports.WestWindChar = "w"; // 西
exports.NorthWindChar = "n"; // 北
exports.SangenpaiChar = "d"; // 三元牌 Dragons
exports.WhiteDragonChar = "w"; // 白 WhiteDragon
exports.GreenDragonChar = "g"; // 發 GreenDragon
exports.RedDragonChar = "r"; // 中 RedDragon
const manzu = exports.ManduChar;
const pinzu = exports.PinduChar;
const souzu = exports.SouduChar;
const ton = `${exports.EastWindChar}${exports.KazehaiChar}`;
const nan = `${exports.SouthWindChar}${exports.KazehaiChar}`;
const sha = `${exports.WestWindChar}${exports.KazehaiChar}`;
const pei = `${exports.NorthWindChar}${exports.KazehaiChar}`;
const haku = `${exports.WhiteDragonChar}${exports.SangenpaiChar}`;
const hatsu = `${exports.GreenDragonChar}${exports.SangenpaiChar}`;
const chun = `${exports.RedDragonChar}${exports.SangenpaiChar}`;
// 手牌を並び替えするときの牌種順
const TileTypeSort = [
    exports.ManduChar,
    exports.PinduChar,
    exports.SouduChar,
    exports.KazehaiChar,
    exports.SangenpaiChar,
];
exports.TileTypeSort = TileTypeSort;
const WindsSort = [
    exports.EastWindChar,
    exports.SouthWindChar,
    exports.WestWindChar,
    exports.NorthWindChar,
];
exports.WindsSort = WindsSort;
const Winds = WindsSort.map((c) => c + exports.KazehaiChar);
exports.Winds = Winds;
const DragonsSort = [
    exports.WhiteDragonChar,
    exports.GreenDragonChar,
    exports.RedDragonChar,
];
exports.DragonsSort = DragonsSort;
const Dragons = DragonsSort.map((c) => c + exports.SangenpaiChar);
exports.Dragons = Dragons;
//# sourceMappingURL=Constants.js.map