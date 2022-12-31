export type 東 = "EZ"; // EastZihai
export type 南 = "SZ"; // SouthZihai
export type 西 = "WZ"; // WestZihai
export type 北 = "NZ"; // NorthZihai
export type 風牌 = 東 | 南 | 西 | 北; //Wins

export type 白 = "WD"; // WhiteDragon
export type 發 = "GD"; // GreenDragon
export type 中 = "RD"; // RedDragon
export type 三元牌 = 白 | 發 | 中; //Dragons

export type 字牌 = 風牌 | 三元牌;

export function isEast(value: unknown): value is 東 {
  return value.toString() === "EZ";
}

export function isSouth(value: unknown): value is 南 {
  return value.toString() === "SZ";
}

export function isWest(value: unknown): value is 西 {
  return value.toString() === "WZ";
}

export function isNorth(value: unknown): value is 北 {
  return value.toString() === "NZ";
}

export function isKazehai(value: unknown): value is 風牌 {
  return isEast(value) || isSouth(value) || isWest(value) || isNorth(value);
}

export function isHaku(value: unknown): value is 白 {
  return value.toString() === "WD";
}

export function isHatsu(value: unknown): value is 發 {
  return value.toString() === "GD";
}

export function isChun(value: unknown): value is 中 {
  return value.toString() === "RD";
}

export function isSangenpai(value: unknown): value is 三元牌 {
  return isHaku(value) || isHatsu(value) || isChun(value);
}

export function isHonours(value: unknown): value is 字牌 {
  return isKazehai(value) || isSangenpai(value);
}

export function ToEast(value: unknown): 東 {
  if (isEast(value)) return value;
  throw new Error(`${value} NOT 東`);
}

export function ToSouth(value: unknown): 南 {
  if (isSouth(value)) return value;
  throw new Error(`${value} NOT 南`);
}

export function ToWest(value: unknown): 西 {
  if (isWest(value)) return value;
  throw new Error(`${value} NOT 西`);
}

export function ToNorth(value: unknown): 北 {
  if (isNorth(value)) return value;
  throw new Error(`${value} NOT 北`);
}

export function ToKazehai(value: unknown): 風牌 {
  if (isKazehai(value)) return value;
  throw new Error(`${value} NOT 風牌`);
}

export function ToHaku(value: unknown): 白 {
  if (isHaku(value)) return value;
  throw new Error(`${value} NOT 白`);
}

export function ToHatsu(value: unknown): 發 {
  if (isHatsu(value)) return value;
  throw new Error(`${value} NOT 發`);
}

export function ToChun(value: unknown): 中 {
  if (isChun(value)) return value;
  throw new Error(`${value} NOT 中`);
}

export function ToSangenpai(value: unknown): 三元牌 {
  if (isSangenpai(value)) return value;
  throw new Error(`${value} NOT 三元牌`);
}

export function ToHonours(value: unknown): 字牌 {
  if (isHonours(value)) return value;
  throw new Error(`${value} NOT 字牌`);
}
