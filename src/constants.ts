export const ManduChar = "m"; // 萬子 Characters
export const PinduChar = "p"; // 筒子 Wheels
export const SouduChar = "s"; // 索子 Bamboos
export const KazehaiChar = "w"; // 風牌 Winds
export const SangenpaiChar = "d"; // 三元牌 Dragons

export const EastWindChar = "e"; // 東
export const SouthWindChar = "s"; // 南
export const WestWindChar = "w"; // 西
export const NorthWindChar = "n"; // 北

export const WhiteDragonChar = "w"; // 白 WhiteDragon
export const GreenDragonChar = "g"; // 發 GreenDragon
export const RedDragonChar = "r"; // 中 RedDragon

export const TerminalDigits = [1, 9] as const; // 老頭牌の数
export const SimpleDigits = [2, 3, 4, 5, 6, 7, 8] as const; // 断么九牌の数
export const Digits = [...TerminalDigits, ...SimpleDigits] as const;
export const HandTilesDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

export const WindChars = [EastWindChar, SouthWindChar, WestWindChar, NorthWindChar] as const;
export const WindNameList = ["東", "南", "西", "北"] as const;
export const DragonChars = [WhiteDragonChar, GreenDragonChar, RedDragonChar] as const;

// 手牌を並び替えするときの牌種順
export const TileTypeSort = [ManduChar, PinduChar, SouduChar, KazehaiChar, SangenpaiChar] as const;

export const RoundIndexList = [0, 1] as const;
export const RoundHandIndexList = [0, 1, 2, 3] as const;
export const PlayerIndexList = [0, 1, 2, 3] as const;
export const PlayerDirectionList = ["self", "toTheRight", "opposite", "toTheLeft"] as const;

export const MeldCommandTypeList = ["pon", "kan", "chi"] as const;
export const WinCommandTypeList = ["tsumo", "ron"] as const;
export const CommandTypeList = [...MeldCommandTypeList, ...WinCommandTypeList, "discard", "nothing"] as const;
