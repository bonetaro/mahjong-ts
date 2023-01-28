/* eslint-disable @typescript-eslint/ban-types */
import { List } from "linqts";
import { CommandType } from ".";
import * as Constants from "./Constants";
import { 牌 } from "./Types";
import { Tile } from "./models";

export function toEmojiArray(values: Array<牌>): string {
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

  if (Tile.isManzu(value)) {
    return manzuList[Number(value[0]) - 1];
  } else if (Tile.isPinzu(value)) {
    return pinzuList[Number(value[0]) - 1];
  } else if (Tile.isSouzu(value)) {
    return souzuList[Number(value[0]) - 1];
  } else if (Tile.isKazehai(value)) {
    return kazehaiList[value[0] as keyof typeof kazehaiList];
  } else if (Tile.isSangenpai(value)) {
    return sangenpaiList[value[0] as keyof typeof sangenpaiList];
  } else {
    return "?";
  }
}

export function toMojiArray(values: Array<牌>): string {
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

  if (Tile.isManzu(value)) {
    return manzuList[Number(value[0]) - 1];
  } else if (Tile.isPinzu(value)) {
    return pinzuList[Number(value[0]) - 1];
  } else if (Tile.isSouzu(value)) {
    return souzuList[Number(value[0]) - 1];
  } else if (Tile.isKazehai(value)) {
    return kazehaiList[value[0]];
  } else if (Tile.isSangenpai(value)) {
    return sangenpaiList[value[0]];
  } else {
    return "?";
  }
}

export function toEmojiMoji(value: 牌): string {
  return `${toEmoji(value)} (${toMoji(value)})`;
}

export const sortTiles = (tiles: 牌[]): 牌[] => {
  return new List(tiles)
    .OrderBy((x) => Constants.TileTypeSort.indexOf(new Tile(x).type)) // 2文字目で整列
    .ThenBy((x) => {
      const tile = new Tile(x);

      if (Tile.isSuits(x)) return tile.toSuitsTile().value;
      if (Tile.isKazehai(x)) return Constants.WindChars.indexOf(tile.toWindTile().value);
      if (Tile.isSangenpai(x)) return Constants.DragonChars.indexOf(tile.toDragonTile().value);
      throw new Error(x);
    })
    .ToArray();
};

export const isMeldCommandType = (type: CommandType): boolean => {
  return [CommandType.Pon, CommandType.Chi, CommandType.Kan].includes(type);
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
