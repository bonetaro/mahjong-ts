import { List } from "linqts";
import { MustInclude, NonEmptyArray } from "../types";

// 順列
export class Helper {
  static isRangeNumber = (input: string | number, max: number, min = 0) => min <= Number(input) && Number(input) <= max;

  static isInt = (x: unknown): boolean => !isNaN(Number(x)) && Number(x) % 1 === 0;

  static includes<T extends U, U>(arr: ReadonlyArray<T>, el: U): el is T {
    return arr.includes(el as T);
  }

  static stringUnionToArray<T>() {
    return <U extends NonEmptyArray<T>>(...elements: MustInclude<T, U>) => elements;
  }

  static permutation = (arr: number[], k: number): number[][] => {
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

        const row = Helper.permutation(parts, k - 1);
        for (let j = 0; j < row.length; j++) {
          ans.push([arr[i]].concat(row[j]));
        }
      }
    }

    return ans;
  };

  // 組み合わせ
  static combination = (arr: unknown[], k: number): unknown[][] => {
    arr = new List(arr).Distinct().ToArray();

    const returnArray: unknown[][] = [];

    if (arr.length < k) {
      return [];
    }

    if (k === 1) {
      for (let i = 0; i < arr.length; i++) {
        returnArray[i] = [arr[i]];
      }
    } else {
      for (let i = 0; i < arr.length - k + 1; i++) {
        const row = Helper.combination(arr.slice(i + 1), k - 1);

        for (let j = 0; j < row.length; j++) {
          returnArray.push([arr[i]].concat(row[j]));
        }
      }
    }

    return returnArray;
  };
}
