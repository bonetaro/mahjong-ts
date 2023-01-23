import { FourMembers } from "./lib";
import { CheatOption, GameOption, Hand, Player, PlayerDrawTiles } from "./lib/models";

const players: FourMembers<Player> = [new Player("Aさん"), new Player("Bさん"), new Player("Cさん"), new Player("Dさん")];

// 東1局の配牌とツモる牌をイカサマ可能(鳴きが入った場合は、ツモる牌は保証されない)
const playerDrawTilesList: FourMembers<PlayerDrawTiles> = [
  new PlayerDrawTiles(new Hand("1m1m1m1m9m2m3m1p3m4m4m2s4s"), ["2m"]),
  new PlayerDrawTiles(new Hand("1s1s1s2s9s5s3s1p3p4p4p1p2p"), ["3m", "3m"]),
  new PlayerDrawTiles(new Hand(), ["4m"]),
  new PlayerDrawTiles(new Hand(), ["5m"]),
];

const cheatOption = new CheatOption(playerDrawTilesList);
const gameOption = new GameOption(players, cheatOption); // チート半荘
// const gameOption = new GameOption(players); // 通常の半荘

export { gameOption };
