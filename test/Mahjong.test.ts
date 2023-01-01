import { Winds, Dragons } from "../src/lib/Constants";
import {
  isSuits,
  isManzu,
  isPinzu,
  isSouzu,
  isKazehai,
  isSangenpai,
} from "../src/lib/Functions";
import { Game } from "../src/lib/Game";

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

test(`${Winds.join(" ")} is 東南西北`, () => {
  const result = Winds.every((tile) => isKazehai(tile));
  expect(result).toBe(true);
});

test(`${Dragons.join(" ")} is 白發中`, () => {
  const result = Dragons.every((tile) => isSangenpai(tile));
  expect(result).toBe(true);
});

test("wall tiles is 136", () => {
  const game = new Game();
  const wall = game.initializeTiles();

  expect(wall.length).toBe(136);
});

test("deal tiles is 13. rest tiles 123", () => {
  const game = new Game();
  const dealedTiles = game.dealTiles(13);

  expect(dealedTiles.length).toBe(13);
  expect(game.wall.length).toBe(136 - 13);
});
