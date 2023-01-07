import { initCheatGame, initGame } from "./initGame";
import { GameOption } from "./lib/GameOption";
import { Player } from "./lib/Player";

const main = async (players: Player[], option?: GameOption) => {
  const game = option?.cheat ? initCheatGame(players) : initGame(players);
  game.start();

  game.startRoundHand();

  while (true) {
    await game.roundHandLoop();

    game.endRoundHand();

    if (game.isLastRoundHand()) {
      break;
    }

    await game.nextRoundHand();
  }

  game.end();
};

const players = [
  new Player("Aさん"),
  new Player("Bさん"),
  new Player("Cさん"),
  new Player("Dさん"),
];

const option: GameOption = new GameOption();
option.debug = true;
option.cheat = true;

main(players, option);
