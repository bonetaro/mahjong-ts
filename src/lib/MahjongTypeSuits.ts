export type 萬子 = "m"; // Characters
export type 筒子 = "p"; // Wheels
export type 索子 = "s"; // Bamboo

export type 色 = 萬子 | 筒子 | 索子;

type 老頭牌の数 = "1" | "9";
type 中張牌の数 = "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type 数牌の数 = 中張牌の数 | 老頭牌の数;

export type 萬子牌 = `${数牌の数}${萬子}`;
export type 筒子牌 = `${数牌の数}${筒子}`;
export type 索子牌 = `${数牌の数}${索子}`;

export type 中張牌 = `${中張牌の数}${色}`;
export type 老頭牌 = `${老頭牌の数}${色}`;
export type 数牌 = 老頭牌 | 中張牌; //Suits

export function isManzu(value: unknown): value is 萬子牌 {
  return new RegExp("^[1-9]m$", "g").test(value.toString());
}

export function isPinzu(value: unknown): value is 筒子牌 {
  return new RegExp("^[1-9]p$", "g").test(value.toString());
}

export function isSouzu(value: unknown): value is 索子牌 {
  return new RegExp("^[1-9]s$", "g").test(value.toString());
}

export function isSuits(value: unknown): value is 数牌 {
  return isManzu(value) || isPinzu(value) || isSouzu(value);
}

export function toManzu(value: unknown): 萬子牌 {
  if (isManzu(value)) return value;
  throw new Error(`${value} NOT 萬子牌`);
}

export function toPinzu(value: unknown): 筒子牌 {
  if (isPinzu(value)) return value;
  throw new Error(`${value} NOT 筒子牌`);
}

export function toSouzu(value: unknown): 索子牌 {
  if (isSouzu(value)) return value;
  throw new Error(`${value} NOT 索子牌`);
}

export function toSuits(value: unknown): 数牌 {
  if (isSuits(value)) return value;
  throw new Error(`${value} NOT 数牌`);
}
