import { CheatOption, GameOption, PlayerHand, Player, PlayerDrawTiles } from "./models";
import { FourMembers } from "./types";

const players: FourMembers<Player> = [new Player("Aさん"), new Player("Bさん"), new Player("Cさん"), new Player("Dさん")];

// 東1局の配牌とツモる牌をイカサマ可能(鳴きが入った場合は、ツモる牌は保証されない)
const playerDrawTilesList: FourMembers<PlayerDrawTiles> = [
  new PlayerDrawTiles(new PlayerHand("1m1m1m1m9m2m3m1p3m4m4m2s4s"), ["2m"]),
  new PlayerDrawTiles(new PlayerHand("1s1s1s2s9s5s3s1p3p4p4p1p2p"), ["3m", "3m"]),
  new PlayerDrawTiles(new PlayerHand(), ["1s", "4m"]),
  new PlayerDrawTiles(new PlayerHand(), ["5m"]),
];

const gameOption = new GameOption(players, new CheatOption(playerDrawTilesList)); // チート半荘
// const gameOption = new GameOption(players); // 通常の半荘

export { gameOption };
