import { CheatTableBuilder } from "../src/lib/CheatTableBuilder";
import { PlayerDrawTiles, PlayerHand, Tile } from "../src/models";
import { FourMembers, 牌 } from "../src/types/MahjongTypes";

const playerDrawTilesList: FourMembers<PlayerDrawTiles> = [
  new PlayerDrawTiles(new PlayerHand("1m1m1m1m9m2m3m1p3m4m4m2s3s")),
  new PlayerDrawTiles(new PlayerHand("1s1s1s2s9s2s3s1p3p4p4p1p2p"), ["3m"]),
  new PlayerDrawTiles(new PlayerHand(), ["4m"]),
  new PlayerDrawTiles(new PlayerHand(), ["5m"]),
];

test("CheatTableBuilder constructor", () => {
  const builder = new CheatTableBuilder();
  expect(builder._baseCheatTable.washedTiles.length).toBe(136);
  expect(builder._playerDrawTilesList.length).toBe(4);
});

test("CheatTableBuilder fillPlayerDrawTilesHand", () => {
  const builder = new CheatTableBuilder();
  expect(builder._baseCheatTable.washedTiles.length).toBe(136);

  const originalTiles = Tile.sortTiles([...builder._baseCheatTable.washedTiles]);

  playerDrawTilesList.forEach((playerDealedTiles, index) => {
    builder.setPlayerDrawTiles(playerDealedTiles, index);
  });

  expect(builder._playerDrawTilesList[0].hand.tiles.length).toBe(13);
  expect(builder._playerDrawTilesList[0].drawTiles.length).toBe(0);
  expect(builder._playerDrawTilesList[1].hand.tiles.length).toBe(13);
  expect(builder._playerDrawTilesList[1].drawTiles.length).toBe(1);
  expect(builder._playerDrawTilesList[2].hand.tiles.length).toBe(0);
  expect(builder._playerDrawTilesList[2].drawTiles.length).toBe(1);
  expect(builder._playerDrawTilesList[3].hand.tiles.length).toBe(0);
  expect(builder._playerDrawTilesList[3].drawTiles.length).toBe(1);

  const restTiles = [...builder._baseCheatTable.washedTiles];

  let tiles: 牌[] = [];
  builder._playerDrawTilesList.map((playerDrawTiles) => {
    tiles = tiles.concat(playerDrawTiles.hand.tiles);
    tiles = tiles.concat(playerDrawTiles.drawTiles);
  });

  tiles = Tile.sortTiles(tiles.concat(restTiles));

  expect(tiles).toEqual(expect.arrayContaining(originalTiles));
});
