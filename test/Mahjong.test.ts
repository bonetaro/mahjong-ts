import { Winds, Dragons } from "../src/lib/Constants";
import {
  isSuits,
  isManzu,
  isPinzu,
  isSouzu,
  isKazehai,
  isSangenpai,
  nextTile,
} from "../src/lib/Functions";
import { Game } from "../src/lib/Game";
import { Player } from "../src/lib/Player";
import { Table } from "../src/lib/Table";

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

test("table initialize tiles is 136", () => {
  const table = new Table();
  expect(table.initializeTiles().length).toBe(136);
});

test("deal tiles is 13.", () => {
  const game = new Game();
  game.setPlayers([
    new Player("player1"),
    new Player("player2"),
    new Player("player3"),
    new Player("player4"),
  ]);

  game.buildWalls();
  const dealedTiles = game.dealTiles(13);

  expect(dealedTiles.length).toBe(13);
});

test("initialized tiles is 136.", () => {
  const game = new Game();
  game.setPlayers([
    new Player("player1"),
    new Player("player2"),
    new Player("player3"),
    new Player("player4"),
  ]);

  game.buildWalls();

  expect(game.table.restTilesCount).toBe(136);
});

test("rest tiles is 123 after deal 13 tiles.", () => {
  const game = new Game();
  game.setPlayers([
    new Player("player1"),
    new Player("player2"),
    new Player("player3"),
    new Player("player4"),
  ]);

  game.buildWalls();

  const dealedTilesCount = 13;
  const dealedTiles = game.dealTiles(dealedTilesCount);

  expect(game.restTilesCount).toBe(136 - dealedTilesCount);
});

test("The next of 1p is 2p.", () => {
  expect(nextTile("1p")).toBe("2p");
});

test("The next of 7s is 8s.", () => {
  expect(nextTile("7s")).toBe("8s");
});

test("The next of 9m is 1m.", () => {
  expect(nextTile("9m")).toBe("1m");
});

test("The next of 9s is 1s.", () => {
  expect(nextTile("9s")).toBe("1s");
});

test("The next of ew is sw.", () => {
  expect(nextTile("ew")).toBe("sw");
});

test("The next of nw is ew.", () => {
  expect(nextTile("nw")).toBe("ew");
});

test("The next of gd is rd.", () => {
  expect(nextTile("gd")).toBe("rd");
});

test("The next of rd is wd.", () => {
  expect(nextTile("rd")).toBe("wd");
});
