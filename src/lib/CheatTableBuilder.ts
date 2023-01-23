import { List } from "linqts";
import { Validator, sortTiles, throwErrorAndLogging, toTile, 牌 } from ".";
import { CheatTable, Hand, PlayerDrawTiles, Table } from "./models";
import { FourMembers, PlayerIndex } from "./Types";

export class CheatTableBuilder {
  public _baseCheatTable: CheatTable;
  public _playerDrawTilesList: FourMembers<PlayerDrawTiles>;

  constructor() {
    this._baseCheatTable = new CheatTable(new Table().washedTiles);

    if (!Validator.isValidAllTiles(this._baseCheatTable.washedTiles)) {
      throwErrorAndLogging(this._baseCheatTable);
    }

    this._playerDrawTilesList = [new PlayerDrawTiles(), new PlayerDrawTiles(), new PlayerDrawTiles(), new PlayerDrawTiles()];
  }

  build(): CheatTable {
    const playerDrawTilesList = this._playerDrawTilesList.map((item: PlayerDrawTiles, index: number) => this.fillPlayerDrawTiles(item, index > 1));

    if (!Validator.isValidPlayerDrawTilesList(playerDrawTilesList, this._baseCheatTable.washedTiles)) {
      throwErrorAndLogging(playerDrawTilesList);
    }

    // ここでthis._baseCheatTableが残り14枚（王牌分）になっているはず
    if (this._baseCheatTable.washedTiles.length != 14) {
      throwErrorAndLogging(this._baseCheatTable.washedTiles);
    }

    const kingsTiles = this._baseCheatTable.drawTiles(14); // 王牌
    const allPlayerDrawTiles = this.aggretateAllPlayerDrawTiles(playerDrawTilesList); // プレイヤーがツモる順番に牌を
    const allTiles = kingsTiles.concat(allPlayerDrawTiles);

    if (!Validator.isValidAllTiles(allTiles)) {
      throwErrorAndLogging({ length: allTiles.length.toString(), sortTiles: sortTiles(allTiles) });
    }

    const table = new CheatTable(allTiles);
    return table;
  }

  private aggretateAllPlayerDrawTiles(playerDrawTilesList: PlayerDrawTiles[]) {
    const tiles: 牌[] = [];

    // 配牌時の4つずつ取ってくるツモ
    [...Array(3).keys()].forEach((count: number) => {
      playerDrawTilesList.forEach((playerDrawTiles) => {
        // 4枚とる処理
        [...Array(4).keys()].forEach((i: number) => {
          tiles.push(playerDrawTiles.hand.tiles[i + count * 4]);
        });
      });
    });

    // 配牌時の最後のツモ
    playerDrawTilesList.forEach((playerDrawTiles) => {
      tiles.push(playerDrawTiles.hand.tiles[12]);
    });

    // 配牌が終わった後の順番にツモってくる牌
    for (let i = 0; i < 18; i++) {
      playerDrawTilesList.forEach((playerDrawTiles, index) => {
        // playserDrawTilesList[2] playserDrawTilesList[3]は、drawTilesが17枚なので判定する
        if (i == 17 && index > 1) {
          return;
        }

        tiles.push(playerDrawTiles.drawTiles[i]);
      });
    }

    return tiles;
  }

  setPlayerDrawTiles(playerDrawTiles: PlayerDrawTiles, playerIndex: PlayerIndex) {
    this._playerDrawTilesList[playerIndex] = playerDrawTiles;

    // イカサマ配牌とツモ牌をテーブルの山から除く
    playerDrawTiles.hand.tiles.forEach((tile) => this._baseCheatTable.removeTile(tile));
    playerDrawTiles.drawTiles.forEach((tile) => this._baseCheatTable.removeTile(tile));
  }

  // PlayerDealedTilesの不十分な牌を補う
  fillPlayerDrawTiles(playerDrawTiles: PlayerDrawTiles, less: boolean): PlayerDrawTiles {
    this.fillHandOfPlayerDrawTiles(playerDrawTiles);
    this.fillDrawTilesOfPlayerDrawTiles(playerDrawTiles, less);

    if (!Validator.isValidPlayerDrawTiles(playerDrawTiles, less)) {
      throwErrorAndLogging(playerDrawTiles);
    }

    return playerDrawTiles;
  }

  fillHandOfPlayerDrawTiles = (playerDrawTiles: PlayerDrawTiles) => {
    if (playerDrawTiles.hand.tiles.length == 0) {
      playerDrawTiles.hand = new Hand(this._baseCheatTable.drawTiles(13));
    } else if (playerDrawTiles.hand.tiles.length != 13) {
      throwErrorAndLogging(playerDrawTiles);
    }
  };

  // 引数の牌を加えることで、全ての牌(1種の牌が4枚ずつ136枚)がそろうように残りの牌を生成する
  createRestTiles = (handTiles: 牌[]): 牌[] => {
    const suffleTiles = Table.shuffleTiles(Table.initializeTiles());

    // イカサマ牌を先頭に足して、逆順にする(末尾にイカサマ牌を末尾にもってくる)
    const reversedTiles = new List(handTiles.concat(suffleTiles)).Reverse();

    // todo パフォーマンス改善
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const group = reversedTiles.GroupBy((tile) => tile);

      // 4つより多い牌を先頭から消していく
      Object.keys(group)
        .filter((key) => group[key].length !== 4)
        .forEach((key) => reversedTiles.Remove(toTile(key)));

      if (Validator.isValidAllTiles(reversedTiles.ToArray())) {
        break;
      }
    }

    // handTiles以外の残りの牌
    const restTiles = reversedTiles.Reverse().Skip(handTiles.length).ToArray();
    return restTiles;
  };

  private fillDrawTilesOfPlayerDrawTiles(playerDrawTiles: PlayerDrawTiles, less: boolean) {
    const drawTilesCount = less ? 17 : 18;

    if (playerDrawTiles.drawTiles.length != drawTilesCount) {
      if (playerDrawTiles.drawTiles.length > drawTilesCount) {
        throwErrorAndLogging("too match dealedTiles");
      } else {
        playerDrawTiles.drawTiles = playerDrawTiles.drawTiles.concat(this._baseCheatTable.drawTiles(drawTilesCount - playerDrawTiles.drawTiles.length));
      }
    }
  }
}
