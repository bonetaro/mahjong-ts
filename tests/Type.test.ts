import * as Constants from "../src/constants";
import { Tile } from "../src/models";
import { 対子like, 牌, 刻子like, 槓子like } from "../src/types/MahjongTypes";

test("1m is Suits", () => {
  expect(Tile.isSuits("1m")).toBe(true);
});

test("1p is Suits", () => {
  expect(Tile.isSuits("1p")).toBe(true);
});

test("1s is Suits", () => {
  expect(Tile.isSuits("1s")).toBe(true);
});

test("1n is NOT Suits", () => {
  expect(Tile.isSuits("1n")).toBe(false);
});

test("0m is NOT Suits", () => {
  expect(Tile.isSuits("0m")).toBe(false);
});

test("s is NOT Suits", () => {
  expect(Tile.isSuits("s")).toBe(false);
});

test("3m is Manzu", () => {
  expect(Tile.isManzu("3m")).toBe(true);
});

test("5p is Pinzu", () => {
  expect(Tile.isPinzu("5p")).toBe(true);
});

test("9s is Souzu", () => {
  expect(Tile.isSouzu("9s")).toBe(true);
});

test(`${Constants.WindChars.join(" ")} is 東南西北`, () => {
  const result = Constants.WindChars.every((c) => Tile.isKazehai(`${c}${Constants.KazehaiChar}`));
  expect(result).toBe(true);
});

test(`${Constants.DragonChars.join(" ")} is 白發中`, () => {
  const result = Constants.DragonChars.every((c) => Tile.isSangenpai(`${c}${Constants.SangenpaiChar}`));
  expect(result).toBe(true);
});

test("The next of 1p is 2p.", () => {
  expect(Tile.nextTile("1p")).toBe("2p");
});

test("The next of 7s is 8s.", () => {
  expect(Tile.nextTile("7s")).toBe("8s");
});

test("The next of 9m is 1m.", () => {
  expect(Tile.nextTile("9m")).toBe("1m");
});

test("The next of 9s is 1s.", () => {
  expect(Tile.nextTile("9s")).toBe("1s");
});

test("The next of ew is sw.", () => {
  expect(Tile.nextTile("ew")).toBe("sw");
});

test("The next of nw is ew.", () => {
  expect(Tile.nextTile("nw")).toBe("ew");
});

test("The next of gd is rd.", () => {
  expect(Tile.nextTile("gd")).toBe("rd");
});

test("The next of rd is wd.", () => {
  expect(Tile.nextTile("rd")).toBe("wd");
});

// ここから実験コード
type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Rest<T extends string> = T extends `${Digits}${infer U}` ? U : never;
type First<T extends string> = T extends `${infer U}${Rest<T>}` ? U : never;

type notNumber = First<"abc">;
type firstNumber = First<"123">;
type RestNumber = Rest<"123">;

const arrToObj = <T extends string>(arr: Array<T>): { [K in T]: K } =>
  arr.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));

/** Create a K:V */
const Direction = arrToObj(["North", "South", "East", "West"]);
type Direction = keyof typeof Direction;

// ------------
type FirstElementInTwo<T extends 対子like> = T extends [infer U, 牌] ? U : unknown;
type SecondElementInTwo<T extends 対子like> = T extends [牌, infer U] ? U : unknown;

type firstInTwo = FirstElementInTwo<["3m", "2m"]>;
type first2InTwo = FirstElementInTwo<["2m", "1m"]>;
type secondInTwo = SecondElementInTwo<["1m", "3m"]>;
type second2InTwo = SecondElementInTwo<["3m", "2m"]>;

export type is対子Func<T extends 対子like> = FirstElementInTwo<T> extends SecondElementInTwo<T>
  ? SecondElementInTwo<T> extends 牌
    ? (values: unknown[]) => boolean
    : (values: unknown[]) => false
  : (values: unknown[]) => false;

type funcReturnBoolean = is対子Func<["2m", "2m"]>;
type funcReturnFalse = is対子Func<["2m", "1m"]>;

// const isToitsu: is対子Func<["2m", "2m"]> = (tiles: ["2m", "2m"]): boolean => isToitsuTiles<["2m", "2m"]>(tiles);
const isToitsuTiles = <T extends 牌[]>(tiles: string[]): tiles is 対子like => Tile.isSuits(tiles[0]) && tiles[0] == tiles[1];

test("is対子", () => {
  const twoStrings = ["3m", "sz"];
  let twoTiles: [牌, 牌];

  if (isToitsuTiles(twoStrings)) {
    twoTiles = twoStrings;
  }
});

const furnitureObj = { chair: 1, table: 1, lamp: 1 };
type Furniture = keyof typeof furnitureObj;
const furniture = Object.keys(furnitureObj) as Furniture[];

// ------------
type FirstElementInThree<T extends 刻子like> = T extends [infer U, 牌, 牌] ? U : unknown;
type SecondElementInThree<T extends 刻子like> = T extends [牌, infer U, 牌] ? U : unknown;
type ThirdElementInThree<T extends 刻子like> = T extends [牌, 牌, infer U] ? U : unknown;

type firstInThree = FirstElementInThree<["3m", "2m", "1m"]>;
type first2InThree = FirstElementInThree<["2m", "1m", "3m"]>;
type secondInThree = SecondElementInThree<["1m", "3m", "2m"]>;
type thirdInThree = ThirdElementInThree<["3m", "2m", "1m"]>;

export type is刻子Func<T extends 刻子like> = FirstElementInThree<T> extends SecondElementInThree<T>
  ? SecondElementInThree<T> extends ThirdElementInThree<T>
    ? ThirdElementInThree<T> extends 牌
      ? (values: unknown[]) => boolean
      : (values: unknown[]) => false
    : (values: unknown[]) => false
  : (values: unknown[]) => false;

// ------------
type FirstElementInFour<T extends 槓子like> = T extends [infer U, 牌, 牌, 牌] ? U : unknown;
type SecondElementInFour<T extends 槓子like> = T extends [牌, infer U, 牌, 牌] ? U : unknown;
type ThirdElementInFour<T extends 槓子like> = T extends [牌, 牌, infer U, 牌] ? U : unknown;
type FourthElementInFour<T extends 槓子like> = T extends [牌, 牌, 牌, infer U] ? U : unknown;

type firstInFour = FirstElementInFour<["4m", "3m", "2m", "1m"]>;
type first2InFour = FirstElementInFour<["2m", "4m", "1m", "3m"]>;
type secondInFour = SecondElementInFour<["1m", "3m", "4m", "2m"]>;
type second2InFour = SecondElementInFour<["3m", "4m", "2m", "1m"]>;

export type is槓子Func<T extends 槓子like> = FirstElementInFour<T> extends SecondElementInFour<T>
  ? SecondElementInFour<T> extends ThirdElementInFour<T>
    ? ThirdElementInFour<T> extends FourthElementInFour<T>
      ? FourthElementInFour<T> extends 牌
        ? (values: unknown[]) => boolean
        : (values: unknown[]) => false
      : (values: unknown[]) => false
    : (values: unknown[]) => false
  : (values: unknown[]) => false;
