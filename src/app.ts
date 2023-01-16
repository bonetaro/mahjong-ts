import { PlayerDrawTiles } from "./lib/CheatTableBuilder";
import { FourMembers } from "./lib/Types";
import { CheatOption, Game, GameOption, Hand, Player } from "./lib/models";
import { CheatGame } from "./lib/models/Game";

const main = async (players: FourMembers<Player>, option?: GameOption) => {
  const game = option?.cheat ? new CheatGame(players, option) : new Game(players, option);

  game.start();

  let roundHand = game.currentRoundHand;
  do {
    game.startRoundHand(roundHand);

    await roundHand.mainLoop();

    game.endRoundHand(roundHand);
  } while ((roundHand = await game.nextRoundHand()));

  game.end();
};

const players: FourMembers<Player> = [new Player("Aさん"), new Player("Bさん"), new Player("Cさん"), new Player("Dさん")];

// 現状は、東1局の配牌とツモる牌のみイカサマ可能
const playerDealedTilesList: FourMembers<PlayerDrawTiles> = [
  new PlayerDrawTiles(new Hand("1m1m1m1m9m2m3m1p3m4m4m1s2s")),
  new PlayerDrawTiles(new Hand(), ["3m"]),
  new PlayerDrawTiles(new Hand(), ["4m"]),
  new PlayerDrawTiles(new Hand(), ["5m"]),
];

const cheatOption = new CheatOption(playerDealedTilesList);
const gameOption = new GameOption(cheatOption);

main(players, gameOption);
