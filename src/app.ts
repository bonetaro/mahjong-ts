import { initCheatGame, initGame } from "./initGame";
import { GameOption } from "./lib/models/GameOption";
import { Player } from "./lib/models/Player";

const main = async (players: Player[], option?: GameOption) => {
  const game = option?.cheat ? initCheatGame(players) : initGame(players);

  game.start();

  let roundHand = game.currentRoundHand;
  // eslint-disable-next-line no-constant-condition
  do {
    game.startRoundHand(roundHand);

    await roundHand.mainLoop();

    game.endRoundHand(roundHand);
  } while ((roundHand = await game.nextRoundHand()));

  game.end();
};

const players = [new Player("Aさん"), new Player("Bさん"), new Player("Cさん"), new Player("Dさん")];

const option: GameOption = new GameOption();
option.debug = true;
option.cheat = true;

main(players, option);
