import { CheatTableBuilder } from "../src/lib/CheatTableBuilder";
import { PlayerDrawTiles } from "../src/lib/models";
import { FourMembers, PlayerIndex, sortTiles, 牌 } from "../src/lib";
import { Hand } from "../src/lib/models";

const playerDrawTilesList: FourMembers<PlayerDrawTiles> = [
  new PlayerDrawTiles(new Hand("1m1m1m1m9m2m3m1p3m4m4m2s3s")),
  new PlayerDrawTiles(new Hand("1s1s1s2s9s2s3s1p3p4p4p1p2p"), ["3m"]),
  new PlayerDrawTiles(new Hand(), ["4m"]),
  new PlayerDrawTiles(new Hand(), ["5m"]),
];

test("CheatTableBuilder constructor", () => {
  const builder = new CheatTableBuilder();
  expect(builder._baseCheatTable.washedTiles.length).toBe(136);
  expect(builder._playerDrawTilesList.length).toBe(4);
});

test("CheatTableBuilder fillPlayerDrawTilesHand", () => {
  const builder = new CheatTableBuilder();
  expect(builder._baseCheatTable.washedTiles.length).toBe(136);

  const originalTiles = sortTiles([...builder._baseCheatTable.washedTiles]);

  playerDrawTilesList.forEach((playerDealedTiles, index) => {
    builder.setPlayerDrawTiles(playerDealedTiles, index as PlayerIndex);
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

  tiles = sortTiles(tiles.concat(restTiles));

  expect(tiles).toEqual(expect.arrayContaining(originalTiles));
});
