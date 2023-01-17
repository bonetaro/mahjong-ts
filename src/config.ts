import { FourMembers, PlayerDrawTiles } from "./lib";
import { CheatOption, GameOption, Hand, Player } from "./lib/models";

const players: FourMembers<Player> = [new Player("Aさん"), new Player("Bさん"), new Player("Cさん"), new Player("Dさん")];

// 東1局の配牌とツモる牌をイカサマ可能
const playerDrawTilesList: FourMembers<PlayerDrawTiles> = [
  new PlayerDrawTiles(new Hand("1m1m1m1m9m2m3m1p3m4m4m2s3s")),
  new PlayerDrawTiles(new Hand("1s1s1s2s9s2s3s1p3p4p4p1p2p"), ["3m"]),
  new PlayerDrawTiles(new Hand(), ["4m"]),
  new PlayerDrawTiles(new Hand(), ["5m"]),
];

const cheatOption = new CheatOption(playerDrawTilesList);
const gameOption = new GameOption(players, cheatOption); // チート半荘
// const gameOption = new GameOption(players); // 通常の半荘

export { gameOption };
