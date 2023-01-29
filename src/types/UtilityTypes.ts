export type FixedLengthArray<T, N extends number, R extends T[] = []> = number extends N ? T[] : R["length"] extends N ? R : FixedLengthArray<T, N, [T, ...R]>;

export type ValueOf<T> = T[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

export type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;

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
