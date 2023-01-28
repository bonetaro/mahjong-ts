import { List } from "linqts";

// 順列
export class helper {
  static isRangeNumber = (input: string, max: number, min = 0) => input && min <= Number(input) && Number(input) <= max;

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

        const row = helper.permutation(parts, k - 1);
        for (let j = 0; j < row.length; j++) {
          ans.push([arr[i]].concat(row[j]));
        }
      }
    }

    return ans;
  };

  // 組み合わせ
  static combination = (arr: number[], k: number): number[][] => {
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
        const row = helper.combination(arr.slice(i + 1), k - 1);

        for (let j = 0; j < row.length; j++) {
          ans.push([arr[i]].concat(row[j]));
        }
      }
    }

    return ans;
  };
}
