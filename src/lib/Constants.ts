import {
  牌,
  萬子,
  筒子,
  索子,
  数牌,
  東,
  南,
  西,
  北,
  風牌,
  白,
  發,
  中,
  三元牌,
  字牌,
} from "./MahjongTypes";

export const ManduChar = "m"; // 萬子 Characters
export const PinduChar = "p"; // 筒子 Wheels
export const SouduChar = "s"; // 索子 Bamboos

export const KazehaiChar = "w"; // 風牌 Winds

export const EastWindChar = "e"; // 東
export const SouthWindChar = "s"; // 南
export const WestWindChar = "w"; // 西
export const NorthWindChar = "n"; // 北

export const SangenpaiChar = "d"; // 三元牌 Dragons

export const WhiteDragonChar = "w"; // 白 WhiteDragon
export const GreenDragonChar = "g"; // 發 GreenDragon
export const RedDragonChar = "r"; // 中 RedDragon

const manzu: 萬子 = ManduChar;
const pinzu: 筒子 = PinduChar;
const souzu: 索子 = SouduChar;

const ton: 東 = `${EastWindChar}${KazehaiChar}`;
const nan: 南 = `${SouthWindChar}${KazehaiChar}`;
const sha: 西 = `${WestWindChar}${KazehaiChar}`;
const pei: 北 = `${NorthWindChar}${KazehaiChar}`;

const haku: 白 = `${WhiteDragonChar}${SangenpaiChar}`;
const hatsu: 發 = `${GreenDragonChar}${SangenpaiChar}`;
const chun: 中 = `${RedDragonChar}${SangenpaiChar}`;

// 手牌を並び替えするときの牌種順
const TileTypeSort = [
  ManduChar,
  PinduChar,
  SouduChar,
  KazehaiChar,
  SangenpaiChar,
];

const WindsSort: readonly string[] = [
  EastWindChar,
  SouthWindChar,
  WestWindChar,
  NorthWindChar,
];
const Winds: string[] = WindsSort.map((c) => c + KazehaiChar);

const DragonsSort: readonly string[] = [
  WhiteDragonChar,
  GreenDragonChar,
  RedDragonChar,
];
const Dragons: string[] = DragonsSort.map((c) => c + SangenpaiChar);

export { TileTypeSort, Winds, Dragons, WindsSort, DragonsSort };
