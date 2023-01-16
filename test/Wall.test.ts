import { splitBy2Chars, toTile } from "../src/lib/Functions";
import { Wall } from "../src/lib/models";
import { KingsWall } from "../src/lib/models/KingsWall";

const tile = "1m2m3m4m";
const tile2 = "1m2m3m4m5m";

test(`${tile} is 4 tiles`, () => {
  const wall = new Wall(splitBy2Chars(tile).map((t) => toTile(t)));
  expect(wall.tilesCount).toBe(4);
});

test(`${tile2} is 5 tiles`, () => {
  const wall = new Wall(splitBy2Chars(tile2).map((t) => toTile(t)));
  expect(wall.tilesCount).toBe(5);
});

test(`${tile} half first element is 1m2m`, () => {
  const tiles = splitBy2Chars(tile).map((t) => toTile(t));
  const wall = new Wall(tiles);
  const result = wall.splitHalf(tiles);
  expect(result[0].join("")).toBe("1m2m");
});

test(`${tile} half second element is 3m4m`, () => {
  const tiles = splitBy2Chars(tile).map((t) => toTile(t));
  const wall = new Wall(tiles);
  const result = wall.splitHalf(tiles);
  expect(result[1].join("")).toBe("3m4m");
});

test(`${tile2} half first element is 1m2m`, () => {
  const tiles = splitBy2Chars(tile2).map((t) => toTile(t));
  const wall = new Wall(tiles);
  const result = wall.splitHalf(tiles);
  expect(result[0].join("")).toBe("1m2m");
});

test(`${tile2} half second element is 3m4m5m`, () => {
  const tiles = splitBy2Chars(tile2).map((t) => toTile(t));
  const wall = new Wall(tiles);
  const result = wall.splitHalf(tiles);
  expect(result[1].join("")).toBe("3m4m5m");
});

test(`${tile} pickup is 1m`, () => {
  const tiles = splitBy2Chars(tile).map((t) => toTile(t));
  const wall = new Wall(tiles);
  expect(wall.pickTile()).toBe("1m");
});

test(`rest is 2m3m4m after ${tile} pickup`, () => {
  const tiles = splitBy2Chars(tile).map((t) => toTile(t));
  const wall = new Wall(tiles);
  wall.pickTile();
  expect(wall.tiles.join("")).toBe("2m3m4m");
});

test(`${tile} push 5m`, () => {
  const tiles = splitBy2Chars(tile).map((t) => toTile(t));
  const wall = new Wall(tiles);
  wall.pushTile("5m");
  expect(wall.tiles.join("")).toBe("1m2m3m4m5m");
});

const deadWallTile = "1m2m3m4m5m6m7m1p2p3p4p5p6p7p";

test(`${deadWallTile} dora is 6m`, () => {
  const tiles = splitBy2Chars(deadWallTile).map((t) => toTile(t));
  const deadWall = new KingsWall(new Wall(tiles));
  expect(deadWall.doras[0]).toBe("6m"); // 5mが表示牌
});

test(`kan tile from ${deadWallTile} deadWall is 1m`, () => {
  const tiles = splitBy2Chars(deadWallTile).map((t) => toTile(t));
  const deadWall = new KingsWall(new Wall(tiles));
  expect(deadWall.pickupTileByKan("1s")).toBe("1m");
});

test(`dora tiles after do kan from ${deadWallTile} deadWall is 6m8m`, () => {
  const tiles = splitBy2Chars(deadWallTile).map((t) => toTile(t));
  const deadWall = new KingsWall(new Wall(tiles));
  deadWall.pickupTileByKan("1s");
  expect(deadWall.doras.join("")).toBe("6m8m");
});
