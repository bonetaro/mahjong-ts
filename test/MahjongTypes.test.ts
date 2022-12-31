import {
  isSuits,
  isManzu,
  isPinzu,
  isSouzu,
} from "../src/lib/MahjongTypeSuits";
import { isKazehai, isSangenpai, isWest } from "../src/lib/MahjongTypeHonours";

test("1m is Suits", () => {
  expect(isSuits("1m")).toBe(true);
});

test("1p is Suits", () => {
  expect(isSuits("1p")).toBe(true);
});

test("1s is Suits", () => {
  expect(isSuits("1s")).toBe(true);
});

test("1n is NOT Suits", () => {
  expect(isSuits("1n")).toBe(false);
});

test("0m is NOT Suits", () => {
  expect(isSuits("0m")).toBe(false);
});

test("s is NOT Suits", () => {
  expect(isSuits("s")).toBe(false);
});

test("3m is Manzu", () => {
  expect(isManzu("3m")).toBe(true);
});

test("5p is Pinzu", () => {
  expect(isPinzu("5p")).toBe(true);
});

test("9s is Souzu", () => {
  expect(isSouzu("9s")).toBe(true);
});

test("EZ SZ WZ NZ is 東南西北", () => {
  const result = ["EZ", "SZ", "WZ", "NZ"].every((tile) => isKazehai(tile));
  expect(result).toBe(true);
});

test("WD GD RD is 白發中", () => {
  const result = ["WD", "GD", "RD"].every((tile) => isSangenpai(tile));
  expect(result).toBe(true);
});
