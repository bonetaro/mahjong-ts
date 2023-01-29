/* eslint-disable @typescript-eslint/ban-types */
import { 牌 } from "../types";
import { Tile } from "../models";
import { WindChars, KazehaiChar, DragonChars, SangenpaiChar } from "../constants";

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
  const tile = new Tile(value);
  if (Tile.isSuits(value)) {
    return value;
  } else if (Tile.isKazehai(value)) {
    const index = WindChars.indexOf(tile.toWindTile().value);
    return `${WindChars[index]}${KazehaiChar}`;
  } else if (Tile.isSangenpai(value)) {
    const index = DragonChars.indexOf(tile.toDragonTile().value);
    return `${DragonChars[index]}${SangenpaiChar}`;
  } else {
    return "?";
  }
}

export function toEmojiMoji(tile: 牌): string {
  return `${toEmoji(tile)} (${toMoji(tile)})`;
}

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
