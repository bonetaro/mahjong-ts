import { List } from "linqts";
import { CheatTable, Hand, Table } from "./models";
import { Validator } from "./Validator";
import { 牌 } from "./Types";
import { toTile, sortTiles } from "./Functions";
import { logger } from "./logging";

export class CheatTableBuilder {
  private _baseCheatTable: CheatTable;
  private _playerDrawTilesList: PlayerDrawTiles[];

  constructor() {
    this._baseCheatTable = new CheatTable(new Table().washedTiles);
    this._playerDrawTilesList = [...Array(4)].map(() => new PlayerDrawTiles());
  }

  build(): CheatTable {
    const playerDrawTilesList = this._playerDrawTilesList.map((item: PlayerDrawTiles, index: number) => this.fillDealedTiles(item, index > 1));

    if (!Validator.isValidPlayerDrawTiles(playerDrawTilesList)) {
      throw new Error();
    }

    // ここでthis._baseCheatTableが残り14枚（王牌分）になっているはず
    if (this._baseCheatTable.washedTiles.length != 14) {
      throw new Error(this._baseCheatTable.washedTiles.length.toString());
    }

    const kingsTiles = this._baseCheatTable.drawTiles(14); // 王牌
    const allPlayerDrawTiles = this.buildPlayerDrawTiles(playerDrawTilesList); // プレイヤーがツモる順番に牌を組み立てる
    const newTiles = kingsTiles.concat(allPlayerDrawTiles);

    if (!Validator.isValidAllTiles(newTiles)) {
      logger.error(newTiles.length.toString(), sortTiles(newTiles));
      throw new Error();
    }

    const table = new CheatTable(newTiles);
    return table;
  }

  private buildPlayerDrawTiles(playerDrawTilesList: PlayerDrawTiles[]) {
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

  set(playerDrawTiles: PlayerDrawTiles, playerIndex: number) {
    if (playerIndex < 0 || 3 < playerIndex) {
      throw new Error(playerIndex.toString());
    }

    // イカサマ配牌をテーブルの山から除く
    playerDrawTiles.hand.tiles.forEach((tile) => this._baseCheatTable.pickTile(toTile(tile)));

    // イカサマツモ牌をテーブルの山から除く
    playerDrawTiles.drawTiles.forEach((tile) => this._baseCheatTable.pickTile(toTile(tile)));

    this._playerDrawTilesList[playerIndex] = this.fillDealedTiles(playerDrawTiles, playerIndex >= 2);
  }

  // PlayerDealedTilesの不十分な牌を補う
  fillDealedTiles(playerDrawTiles: PlayerDrawTiles, less: boolean): PlayerDrawTiles {
    if (playerDrawTiles.hand.tiles.length == 0) {
      playerDrawTiles.hand = new Hand(this._baseCheatTable.drawTiles(13));
    }

    const drawTilesCount = less ? 17 : 18;

    if (playerDrawTiles.drawTiles.length != drawTilesCount) {
      if (playerDrawTiles.drawTiles.length < drawTilesCount) {
        playerDrawTiles.drawTiles = playerDrawTiles.drawTiles.concat(this._baseCheatTable.drawTiles(drawTilesCount - playerDrawTiles.drawTiles.length));
      } else {
        throw new Error("too match dealedTiles");
      }
    }

    return playerDrawTiles;
  }

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
}

export class PlayerDrawTiles {
  constructor(public hand?: Hand, public drawTiles?: 牌[]) {
    this.hand = hand ? hand : new Hand();
    this.drawTiles = typeof drawTiles != "undefined" ? drawTiles : [];
  }

  toTiles(): 牌[] {
    return this.hand.tiles.concat(this.drawTiles);
  }
}
