import {
  ManduChar,
  PinduChar,
  SouduChar,
  KazehaiChar,
  SangenpaiChar,
  EastWindChar,
  WestWindChar,
  NorthWindChar,
  WhiteDragonChar,
  GreenDragonChar,
  RedDragonChar,
} from "./Constants";
import {
  牌,
  萬子牌,
  筒子牌,
  索子牌,
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
} from "./Types";

export function toTile(value: unknown): 牌 {
  if (isSuits(value) || isHonours(value)) return value;
}

export function isManzu(value: unknown): value is 萬子牌 {
  return new RegExp(`^[1-9]${ManduChar}$`, "g").test(value.toString());
}

export function isPinzu(value: unknown): value is 筒子牌 {
  return new RegExp(`^[1-9]${PinduChar}$`, "g").test(value.toString());
}

export function isSouzu(value: unknown): value is 索子牌 {
  return new RegExp(`^[1-9]${SouduChar}$`, "g").test(value.toString());
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

export function isEast(value: unknown): value is 東 {
  return value.toString() === `${EastWindChar}${KazehaiChar}`;
}

export function isSouth(value: unknown): value is 南 {
  return value.toString() === `${SouduChar}${KazehaiChar}`;
}

export function isWest(value: unknown): value is 西 {
  return value.toString() === `${WestWindChar}${KazehaiChar}`;
}

export function isNorth(value: unknown): value is 北 {
  return value.toString() === `${NorthWindChar}${KazehaiChar}`;
}

export function isKazehai(value: unknown): value is 風牌 {
  return isEast(value) || isSouth(value) || isWest(value) || isNorth(value);
}

export function isHaku(value: unknown): value is 白 {
  return value.toString() === `${WhiteDragonChar}${SangenpaiChar}`;
}

export function isHatsu(value: unknown): value is 發 {
  return value.toString() === `${GreenDragonChar}${SangenpaiChar}`;
}

export function isChun(value: unknown): value is 中 {
  return value.toString() === `${RedDragonChar}${SangenpaiChar}`;
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

export function toVisualFromArray(values: Array<牌>): string {
  return values.map((v) => toVisual(v)).join("");
}

export function toVisual(value: 牌): string {
  const manzuList = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"];
  const pinzuList = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];
  const souzuList = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"];
  const kazehaiList: any = { e: "🀀", s: "🀁", w: "🀂", n: "🀃" };
  const sangenpaiList: any = { w: "🀆", g: "🀅", r: "🀄" };

  if (isManzu(value)) {
    return manzuList[Number(value[0]) - 1];
  } else if (isPinzu(value)) {
    return pinzuList[Number(value[0]) - 1];
  } else if (isSouzu(value)) {
    return souzuList[Number(value[0]) - 1];
  } else if (isKazehai(value)) {
    return kazehaiList[value[0]];
  } else if (isSangenpai(value)) {
    return sangenpaiList[value[0]];
  } else {
    return "?";
  }
}

export function toKanjiFromArray(values: Array<牌>): string {
  return values.map((v) => toKanji(v)).join("");
}

export function toKanji(value: 牌): string {
  const manzuList = [
    "一萬",
    "二萬",
    "三萬",
    "四萬",
    "五萬",
    "六萬",
    "七萬",
    "八萬",
    "九萬",
  ];
  const pinzuList = [
    "一筒",
    "二筒",
    "三筒",
    "四筒",
    "五筒",
    "六筒",
    "七筒",
    "八筒",
    "九筒",
  ];
  const souzuList = [
    "一索",
    "二索",
    "三索",
    "四索",
    "五索",
    "六索",
    "七索",
    "八索",
    "九索",
  ];
  const kazehaiList: any = { e: "東", s: "南", w: "西", n: "北" };
  const sangenpaiList: any = { w: "白", g: "發", r: "中" };

  if (isManzu(value)) {
    return manzuList[Number(value[0]) - 1];
  } else if (isPinzu(value)) {
    return pinzuList[Number(value[0]) - 1];
  } else if (isSouzu(value)) {
    return souzuList[Number(value[0]) - 1];
  } else if (isKazehai(value)) {
    return kazehaiList[value[0]];
  } else if (isSangenpai(value)) {
    return sangenpaiList[value[0]];
  } else {
    return "?";
  }
}
