import { Table } from "../src/lib/Table";

test("table initialize tiles is 136", () => {
  const table = new Table();
  expect(table.initializeTiles().length).toBe(136);
});
