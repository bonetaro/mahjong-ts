/* eslint-disable @typescript-eslint/ban-types */
import { List } from "linqts";
import { CommandType, 数牌の色, 順子like } from ".";
import * as Constants from "./Constants";
import { 三元牌, 中, 刻子like, 北, 南, 四風牌, 字牌, 数牌, 東, 槓子like, 牌, 發, 白, 筒子牌, 索子牌, 萬子牌, 西, 順子 } from "./Types";

export function toTile(value: unknown): 牌 {
  if (isTile(value)) return value;
}

export function isTile(value: unknown): value is 牌 {
  return isSuits(value) || isHonours(value);
}

export function isSameColor(tile: 数牌, tile2: 数牌): boolean {
  const color = tile[1];
  const color2 = tile2[1];

  return color == color2;
}

export function isManzu(value: unknown): value is 萬子牌 {
  return new RegExp(`^[1-9]${Constants.ManduChar}$`, "g").test(value.toString());
}

export function isPinzu(value: unknown): value is 筒子牌 {
  return new RegExp(`^[1-9]${Constants.PinduChar}$`, "g").test(value.toString());
}

export function isSouzu(value: unknown): value is 索子牌 {
  return new RegExp(`^[1-9]${Constants.SouduChar}$`, "g").test(value.toString());
}

export function isKanMentsu(values: unknown[]): values is 槓子like {
  return values.length === 4 && values.every((v) => isTile(v)) && values.every((v) => v == values[0]);
}

export function isKoutsuMentsu(values: unknown[]): values is 刻子like {
  return values.length === 3 && values.every((v) => isTile(v)) && values.every((v) => v == values[0]);
}

export function isSuits(value: unknown): value is 数牌 {
  return isManzu(value) || isPinzu(value) || isSouzu(value);
}

// 順子のメンツか。順子は英語でRun
export function isRunMentsu<T extends 数牌の色>(tiles: 順子like): tiles is 順子<T> {
  if (!tiles.every((tile) => isSameColor(tiles[0], tile))) {
    return false;
  }

  const sortedTiles = sortTiles(tiles);
  const firstTileNum = Number(sortedTiles[0][0]);

  return Number(sortedTiles[1][0]) == firstTileNum + 1 && Number(sortedTiles[2][0]) == firstTileNum + 2;
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
  return value.toString() === `${Constants.EastWindChar}${Constants.KazehaiChar}`;
}

export function isSouth(value: unknown): value is 南 {
  return value.toString() === `${Constants.SouduChar}${Constants.KazehaiChar}`;
}

export function isWest(value: unknown): value is 西 {
  return value.toString() === `${Constants.WestWindChar}${Constants.KazehaiChar}`;
}

export function isNorth(value: unknown): value is 北 {
  return value.toString() === `${Constants.NorthWindChar}${Constants.KazehaiChar}`;
}

export function isKazehai(value: unknown): value is 四風牌 {
  return isEast(value) || isSouth(value) || isWest(value) || isNorth(value);
}

export function isHaku(value: unknown): value is 白 {
  return value.toString() === `${Constants.WhiteDragonChar}${Constants.SangenpaiChar}`;
}

export function isHatsu(value: unknown): value is 發 {
  return value.toString() === `${Constants.GreenDragonChar}${Constants.SangenpaiChar}`;
}

export function isChun(value: unknown): value is 中 {
  return value.toString() === `${Constants.RedDragonChar}${Constants.SangenpaiChar}`;
}

export function isSangenpai(value: unknown): value is 三元牌 {
  return isHaku(value) || isHatsu(value) || isChun(value);
}

export function isHonours(value: unknown): value is 字牌 {
  return isKazehai(value) || isSangenpai(value);
}

export function toEast(value: unknown): 東 {
  if (isEast(value)) return value;
  throw new Error(`${value} NOT 東`);
}

export function toSouth(value: unknown): 南 {
  if (isSouth(value)) return value;
  throw new Error(`${value} NOT 南`);
}

export function toWest(value: unknown): 西 {
  if (isWest(value)) return value;
  throw new Error(`${value} NOT 西`);
}

export function toNorth(value: unknown): 北 {
  if (isNorth(value)) return value;
  throw new Error(`${value} NOT 北`);
}

export function toKazehai(value: unknown): 四風牌 {
  if (isKazehai(value)) return value;
  throw new Error(`${value} NOT 風牌`);
}

export function toHaku(value: unknown): 白 {
  if (isHaku(value)) return value;
  throw new Error(`${value} NOT 白`);
}

export function toHatsu(value: unknown): 發 {
  if (isHatsu(value)) return value;
  throw new Error(`${value} NOT 發`);
}

export function toChun(value: unknown): 中 {
  if (isChun(value)) return value;
  throw new Error(`${value} NOT 中`);
}

export function toSangenpai(value: unknown): 三元牌 {
  if (isSangenpai(value)) return value;
  throw new Error(`${value} NOT 三元牌`);
}

export function toHonours(value: unknown): 字牌 {
  if (isHonours(value)) return value;
  throw new Error(`${value} NOT 字牌`);
}

export function toEmojiFromArray(values: Array<牌>): string {
  return values.map((v) => toEmoji(v)).join(" ");
}

export function toEmoji(value: 牌, hide = false): string {
  const manzuList = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"];
  const pinzuList = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];
  const souzuList = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"];
  const kazehaiList = { e: "🀀", s: "🀁", w: "🀂", n: "🀃" };
  const sangenpaiList = { w: "🀆", g: "🀅", r: "🀄" };
  const hideTile = "🀫";

  if (hide) {
    return hideTile;
  }

  if (isManzu(value)) {
    return manzuList[Number(value[0]) - 1];
  } else if (isPinzu(value)) {
    return pinzuList[Number(value[0]) - 1];
  } else if (isSouzu(value)) {
    return souzuList[Number(value[0]) - 1];
  } else if (isKazehai(value)) {
    return kazehaiList[value[0] as keyof typeof kazehaiList];
  } else if (isSangenpai(value)) {
    return sangenpaiList[value[0] as keyof typeof sangenpaiList];
  } else {
    return "?";
  }
}

export function toMojiFromArray(values: Array<牌>): string {
  return values.map((v) => toMoji(v)).join(" ");
}

export function toMoji(value: 牌): string {
  // const manzuList = ["一萬", "二萬", "三萬", "四萬", "五萬", "六萬", "七萬", "八萬", "九萬"];
  // const manzuList = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const manzuList = [...Array(9).keys()].map((i) => i + 1).map((i) => `${i}m`);
  // const pinzuList = ["1", "二筒", "三筒", "四筒", "五筒", "六筒", "七筒", "八筒", "九筒"];
  // const pinzuList = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const pinzuList = [...Array(9).keys()].map((i) => i + 1).map((i) => `${i}p`);
  // const souzuList = ["一索", "二索", "三索", "四索", "五索", "六索", "七索", "八索", "九索"];
  // const souzuList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  const souzuList = [...Array(9).keys()].map((i) => i + 1).map((i) => `${i}s`);
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

export function toEmojiMoji(value: 牌): string {
  return `${toEmoji(value)} (${toMoji(value)})`;
}

export function nextTile(tile: 牌): 牌 {
  if (isSuits(tile)) {
    const nextNumber = Number(tile[0]) + 1;
    return toSuits(`${nextNumber == 10 ? 1 : nextNumber}${tile[1]}`);
  } else if (isKazehai(tile)) {
    return toKazehai(`${Constants.WindsSort[(Number(Constants.windSortMap.get(tile[0])) + 1) % 4]}${Constants.KazehaiChar}`);
  } else if (isSangenpai(tile)) {
    return toSangenpai(`${Constants.DragonsSort[(Number(Constants.dragonSortMap.get(tile[0])) + 1) % 3]}${Constants.SangenpaiChar}`);
  } else {
    throw new Error(tile);
  }
}

export const isRangeNumber = (input: string, max: number, min = 0) => input && min <= Number(input) && Number(input) <= max;

export const splitBy2Chars = (text: string): string[] => {
  return text.match(/.{2}/g);
};

export const sortTiles = (tiles: 牌[]): 牌[] => {
  return new List(tiles)
    .OrderBy((x) => Constants.typeSortMap.get(x[1])) // 2文字目で整列
    .ThenBy((x) => {
      const key = x[0]; // 1文字目で整列

      if (isSuits(x)) return key;
      if (isKazehai(x)) return Constants.windSortMap.get(key);
      if (isSangenpai(x)) return Constants.dragonSortMap.get(key);
      throw new Error(x);
    })
    .ToArray();
};

export const isMeldCommandType = (type: CommandType): boolean => {
  switch (type) {
    case CommandType.Pon:
    case CommandType.Chi:
    case CommandType.Kan:
      return true;
    default:
      return false;
  }
};

// 順列
export const permutation = (arr: number[], k: number): number[][] => {
  const ans: number[][] = [];

  if (arr.length < k) {
    throw new Error();
  }

  if (k === 1) {
    for (let i = 0; i < arr.length; i++) {
      ans[i] = [arr[i]];
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      const parts = arr.slice(0);
      parts.splice(i, 1)[0];

      const row = permutation(parts, k - 1);
      for (let j = 0; j < row.length; j++) {
        ans.push([arr[i]].concat(row[j]));
      }
    }
  }

  return ans;
};

// 組み合わせ
export const combination = (arr: number[], k: number): number[][] => {
  arr = new List(arr).Distinct().ToArray();

  const ans: number[][] = [];

  if (arr.length < k) {
    return [];
  }

  if (k === 1) {
    for (let i = 0; i < arr.length; i++) {
      ans[i] = [arr[i]];
    }
  } else {
    for (let i = 0; i < arr.length - k + 1; i++) {
      const row = combination(arr.slice(i + 1), k - 1);

      for (let j = 0; j < row.length; j++) {
        ans.push([arr[i]].concat(row[j]));
      }
    }
  }

  return ans;
};

// conditional typeを利用して、指定した型の追跡が可能になります。
type S<T, K> = T extends K ? T : K;

// 型判定用の定義ですが、定義自体は必須ではありません。
const typeOf = {
  isArray: <T>(array: T): boolean => typeof array === "object" && Array.isArray(array),
  isObject: <T>(obj: T): boolean => typeof obj === "object" && !Array.isArray(obj) && obj != null,
  isString: <T>(value: T): boolean => typeof value === "string",
  isUndefined: <T>(value: T): boolean => value === undefined,
};

/**
 * NOTE: 型ガード用の関数定義（exportなし）
 */
const isTypeGuardOf = {
  isArray: <T>(array: unknown): array is T => typeOf.isArray(array),
  isObject: <T>(obj: unknown): obj is T => typeOf.isObject(obj),
  isString: <T>(value: unknown): value is T => typeOf.isString(value),
  isUndefined: (value: unknown): value is undefined => typeOf.isUndefined(value),
};

/**
 * 型ガード用の汎用関数
 * guard${Type}<T>(arg)を利用することで、Tで指定した型が戻り値であることを担保しながら型ガードを行えます。
 */
const typeGuardOf = {
  /**
   *  型ガードをしつつ、引数が必ずArrayであること担保します。
   *  また、返却する[]がundefined[]型である理由は、unknwon[]を返却してしまうと、array[0]: unknownとなってしまい、実態と乖離してしまうためです。
   */
  guardArray: <T>(array: unknown): S<T, T | undefined[]> | undefined[] => (isTypeGuardOf.isArray<S<T, []>>(array) ? array : []),
  /**
   * 型ガードをしつつ、引数が必ずObjectであること担保します。
   */
  guardObject: <T>(obj: unknown): S<T, Object & Record<keyof T, T[keyof T]>> | Object =>
    isTypeGuardOf.isObject<S<T, Object & Record<keyof T, T[keyof T]>>>(obj) ? obj : ({} as Object),
  /**
   * KeySignatureの場合は、string型であることも同時に示せるようになります。
   */
  guardString: <T>(value: unknown): S<T, T & string> | "" => (isTypeGuardOf.isString<S<T, T & string>>(value) ? value : ""),
  guardUndefind: <T>(value: unknown): T | undefined => (isTypeGuardOf.isUndefined(value) ? value : undefined),
};

export { typeOf, typeGuardOf, isTypeGuardOf };
