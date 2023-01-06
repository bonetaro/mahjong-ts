import { List } from "linqts";
import { Table } from "../src/lib/Table";

test("table initialize tiles is 136", () => {
  expect(Table.initializeTiles().length).toBe(136);
});

test("table initialize tiles is 34 types ", () => {
  const tiles = Table.initializeTiles();
  const group = new List(tiles).GroupBy((t) => t);

  expect(Object.keys(group).length).toBe(34);
});

test("table initialize tiles is 4 tiles each type ", () => {
  const tiles = Table.initializeTiles();
  const group = new List(tiles).GroupBy((t) => t);

  expect(Object.keys(group).every((key) => group[key].length == 4)).toBe(true);
});
