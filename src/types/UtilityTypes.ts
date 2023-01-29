export type FixedLengthArray<T, N extends number, R extends T[] = []> = number extends N ? T[] : R["length"] extends N ? R : FixedLengthArray<T, N, [T, ...R]>;

export type ValueOf<T> = T[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

export type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;
