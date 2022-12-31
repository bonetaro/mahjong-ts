import { 牌 } from "./MahjongType";
import { 色 } from "./MahjongTypeSuits";
import { toManzu, toPinzu, toSouzu } from "./MahjongTypeSuits";
import { ToHonours, ToSangenpai } from "./MahjongTypeHonours";

function initializeSuits(color: 色): Array<牌> {
  return [...Array(9)]
    .map((_, i) => i + 1)
    .map((n) => {
      switch (color) {
        case "m":
          return toManzu(n + color);
        case "p":
          return toPinzu(n + color);
        case "s":
          return toSouzu(n + color);
      }
    });
}

function initializeHonours(): Array<牌> {
  const tiles: Array<牌> = [];

  tiles.push(
    ...["E", "S", "W", "N"].map((d) => {
      return ToHonours(d + "Z");
    })
  );

  tiles.push(
    ...["W", "G", "R"].map((c) => {
      return ToSangenpai(c + "D");
    })
  );

  return tiles;
}

export const allTiles: Array<牌> = [];
allTiles.push(...initializeSuits("m")); // 萬子初期化
allTiles.push(...initializeSuits("p")); // 筒子初期化
allTiles.push(...initializeSuits("s")); // 索子初期化
allTiles.push(...initializeHonours()); // 字牌初期化

allTiles.concat(allTiles).concat(allTiles).concat(allTiles);
