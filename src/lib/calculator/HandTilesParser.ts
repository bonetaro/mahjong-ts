import { List } from "linqts";
import { Mentsu, PlayerHand, Tile } from "../../models";
import { 刻子like, 塔子like, 対子like, 牌, 順子like } from "../../types/MahjongTypes";
import { Helper } from "../Helper";
import { TileType } from "../../models/TileType";

export class HandTilesParser {
  public shuntsuList: 順子like[] = [];
  public koutsuList: 刻子like[] = [];
  public pairsList: 対子like[] = [];
  public tatsuList: 塔子like[] = [];

  constructor(protected hand: PlayerHand) {
    this.parse();
  }

  // 取りうるブロック（刻子、順子、対子、塔子）を解析する
  // 牌は重複して利用する（使いまわす）。あくまで取りうるブロックを全部列挙する
  parse(): void {
    // 牌種(tile[1])ごとにgrouping
    const groupByType = new List(Tile.sortTiles(this.hand.rawTiles)).GroupBy((tile) => tile[1]);

    this.parseShuntsu(groupByType);
    this.parseKoutsu(groupByType);
    this.parsePair(groupByType);
    this.parseTatsu(groupByType);
  }

  parseTatsu(groupByType: { [key: string]: 牌[] }): void {
    for (const type in groupByType) {
      if (TileType.isSuitsType(type)) {
        const tiles = Helper.combination(
          groupByType[type].map((tile) => tile),
          2
        );

        for (let i = 0; i < tiles.length; i++) {
          const tatsu = tiles[i] as 塔子like;
          if (Mentsu.isTatsu(tatsu)) {
            this.tatsuList.push(tatsu);
          }
        }
      }
    }
  }

  parsePair(groupByType: { [key: string]: 牌[] }): void {
    for (const type in groupByType) {
      const groupByTile = new List(groupByType[type]).GroupBy((tile) => tile);
      for (const tile in groupByTile) {
        if (groupByTile[tile].length >= 2) {
          const tiles = [...groupByTile[tile]];
          this.pairsList.push(tiles.splice(0, 2) as 対子like);
        }
      }
    }
  }

  parseKoutsu(groupType: { [key: string]: 牌[] }): void {
    for (const type in groupType) {
      const groupByTile = new List(groupType[type]).GroupBy((tile) => tile);
      for (const tile in groupByTile) {
        if (groupByTile[tile].length >= 3) {
          const tiles = [...groupByTile[tile]];
          if (tiles.length > 3) {
            tiles.pop(); // 槓子
          }

          this.koutsuList.push(tiles as 刻子like);
        }
      }
    }
  }

  parseShuntsu(groupByType: { [key: string]: 牌[] }): void {
    for (const type in groupByType) {
      if (TileType.isSuitsType(type)) {
        const combinationArray = Helper.combination(groupByType[type], 3);

        for (let i = 0; i < combinationArray.length; i++) {
          const mentsu = combinationArray[i] as 順子like;
          if (Mentsu.isRunMentsu(mentsu)) {
            this.shuntsuList.push(mentsu);
          }
        }
      }
    }
  }
}
