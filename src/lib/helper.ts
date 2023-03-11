import { List } from "linqts";

export class Helper {
  static isRangeNumber = (input: string | number, max: number, min = 0) => min <= Number(input) && Number(input) <= max;

  static isInt = (x: unknown): boolean => !isNaN(Number(x)) && Number(x) % 1 === 0;

  static includes<T extends U, U>(arr: ReadonlyArray<T>, el: U): el is T {
    return arr.includes(el as T);
  }

  // 順列
  static permutation = (arr: unknown[], k: number): unknown[][] => {
    if (arr.length < k) {
      throw new Error();
    }

    const returnArray: unknown[][] = [];

    if (k === 1) {
      for (let i = 0; i < arr.length; i++) {
        returnArray[i] = [arr[i]];
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        const parts = arr.slice(0);
        parts.splice(i, 1)[0];

        const row = Helper.permutation(parts, k - 1);
        for (let j = 0; j < row.length; j++) {
          returnArray.push([arr[i]].concat(row[j]));
        }
      }
    }

    return returnArray;
  };

  // 組み合わせ
  static combination = (arr: unknown[], k: number): unknown[][] => {
    if (arr.length < k) {
      return [];
    }

    arr = new List(arr).Distinct().ToArray();

    const returnArray: unknown[][] = [];

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
