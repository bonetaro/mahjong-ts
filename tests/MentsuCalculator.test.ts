import { KanCalculator } from "../src/lib/calculator";
import { PlayerHand, Tile } from "../src/models";

test("canAnkan is 1", () => {
  const tiles: string[] = [];
  tiles.push("1m"); // 1
  tiles.push("1m"); // 2
  tiles.push("1m"); // 3
  tiles.push("1m"); // 4
  tiles.push("2m"); // 5
  tiles.push("3m"); // 6
  tiles.push("3m"); // 7
  tiles.push("1p"); // 8
  tiles.push("4m"); // 9
  tiles.push("4m"); // 10
  tiles.push("4m"); // 11
  tiles.push("1s"); // 12
  tiles.push("2s"); // 13

  const hand = new PlayerHand(tiles.map((t) => Tile.toTile(t)));
  const calc = new KanCalculator(hand);
  const candidateTiles = calc.getAnkanCandidateTiles();

  expect(candidateTiles.length).toBe(1);
});

test("canAnkan is 2", () => {
  const tiles: string[] = [];
  tiles.push("1m"); // 1
  tiles.push("1m"); // 2
  tiles.push("1m"); // 3
  tiles.push("1m"); // 4
  tiles.push("2m"); // 5
  tiles.push("3m"); // 6
  tiles.push("3m"); // 7
  tiles.push("1p"); // 8
  tiles.push("4m"); // 9
  tiles.push("4m"); // 10
  tiles.push("4m"); // 11
  tiles.push("4m"); // 12
  tiles.push("2s"); // 13

  const hand = new PlayerHand(tiles.map((t) => Tile.toTile(t)));
  const calc = new KanCalculator(hand);
  const result = calc.getAnkanCandidateTiles();

  expect(result.length).toBe(2);
});

test("canAnkan is 3", () => {
  const tiles: string[] = [];
  tiles.push("1m"); // 1
  tiles.push("1m"); // 2
  tiles.push("1m"); // 3
  tiles.push("1m"); // 4
  tiles.push("rd"); // 5
  tiles.push("rd"); // 6
  tiles.push("rd"); // 7
  tiles.push("1p"); // 8
  tiles.push("4m"); // 9
  tiles.push("4m"); // 10
  tiles.push("4m"); // 11
  tiles.push("4m"); // 12
  tiles.push("rd"); // 13

  const hand = new PlayerHand(tiles.map((t) => Tile.toTile(t)));
  const calc = new KanCalculator(hand);
  const candidateTiles = calc.getAnkanCandidateTiles();

  expect(candidateTiles.length).toBe(3);
});
