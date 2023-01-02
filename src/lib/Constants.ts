import { 萬子, 筒子, 索子, 東, 南, 西, 北, 白, 發, 中 } from "./Types";

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

export const WindsLabel = ["東", "南", "西", "北"];

const WindsSort: string[] = [
  EastWindChar,
  SouthWindChar,
  WestWindChar,
  NorthWindChar,
];
const DragonsSort: string[] = [WhiteDragonChar, GreenDragonChar, RedDragonChar];

const Winds: string[] = WindsSort.map((c) => c + KazehaiChar);
const Dragons: string[] = DragonsSort.map((c) => c + SangenpaiChar);

const typeSortMap = new Map<string, number>();
TileTypeSort.forEach((x, index) => typeSortMap.set(x, index));

const windSortMap = new Map<string, number>();
WindsSort.forEach((x, index) => windSortMap.set(x, index));

const dragonSortMap = new Map<string, number>();
DragonsSort.forEach((x, index) => dragonSortMap.set(x, index));

export {
  TileTypeSort,
  Winds,
  Dragons,
  WindsSort,
  DragonsSort,
  typeSortMap,
  windSortMap,
  dragonSortMap,
};
