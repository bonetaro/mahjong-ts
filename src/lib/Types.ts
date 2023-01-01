export type 萬子 = "m"; // Characters
export type 筒子 = "p"; // Wheels
export type 索子 = "s"; // Bamboos

export type 東 = "ew"; // EastWind
export type 南 = "sw"; // SouthWind
export type 西 = "ww"; // WestWind
export type 北 = "nw"; // NorthWind

export type 白 = "wd"; // WhiteDragon
export type 發 = "gd"; // GreenDragon
export type 中 = "rd"; // RedDragon

type 老頭牌の数 = "1" | "9";
type 中張牌の数 = "2" | "3" | "4" | "5" | "6" | "7" | "8";

export type 色 = 萬子 | 筒子 | 索子;
export type 数牌の数 = 中張牌の数 | 老頭牌の数;

export type 萬子牌 = `${数牌の数}${萬子}`;
export type 筒子牌 = `${数牌の数}${筒子}`;
export type 索子牌 = `${数牌の数}${索子}`;

export type 中張牌 = `${中張牌の数}${色}`;
export type 老頭牌 = `${老頭牌の数}${色}`;
export type 数牌 = 老頭牌 | 中張牌; // Suits

export type 風牌 = 東 | 南 | 西 | 北; // Winds
export type 三元牌 = 白 | 發 | 中; // Dragons
export type 字牌 = 風牌 | 三元牌; // Honours

export type 么九牌 = 老頭牌 | 字牌;

export type 牌 = 数牌 | 字牌;

export type 対子 = [牌, 牌];
export type 刻子 = [牌, 牌, 牌];
export type 槓子 = [牌, 牌, 牌, 牌];

export type 塔子 = [数牌, 数牌];
export type 順子 = [数牌, 数牌, 数牌];

export type 雀頭 = [牌, 牌];
export type 面子 = 順子 | 刻子 | 槓子;

export type 七対子 = [対子, 対子, 対子, 対子, 対子, 対子, 対子];

export type 国士無双 = [
  `1${萬子}`,
  `9${萬子}`,
  `1${筒子}`,
  `9${筒子}`,
  `1${索子}`,
  `9${索子}`,
  東,
  南,
  西,
  北,
  白,
  發,
  中,
  么九牌
];

export type アガリ手牌 = [雀頭, 面子, 面子, 面子, 面子] | 七対子 | 国士無双;
