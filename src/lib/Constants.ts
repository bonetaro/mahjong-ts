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

// 手牌を並び替えするときの牌種順
const TileTypeSort = [ManduChar, PinduChar, SouduChar, KazehaiChar, SangenpaiChar] as const;

export const WindNames = ["東", "南", "西", "北"] as const;

const WindSorts = [EastWindChar, SouthWindChar, WestWindChar, NorthWindChar] as const;
const DragonSorts = [WhiteDragonChar, GreenDragonChar, RedDragonChar] as const;

const Winds: string[] = WindSorts.map((c) => c + KazehaiChar);
const Dragons: string[] = DragonSorts.map((c) => c + SangenpaiChar);

const typeSortMap = new Map<string, number>();
TileTypeSort.forEach((x, index) => typeSortMap.set(x, index));

const windSortMap = new Map<string, number>();
WindSorts.forEach((x, index) => windSortMap.set(x, index));

const dragonSortMap = new Map<string, number>();
DragonSorts.forEach((x, index) => dragonSortMap.set(x, index));

export { TileTypeSort, Winds, Dragons, WindSorts as WindsSort, DragonSorts as DragonsSort, typeSortMap, windSortMap, dragonSortMap };
