import { Game } from "./lib/Game";
import { Player } from "./lib/Player";

const main = async (players: Player[]) => {
  const game = new Game(players);
  game.start();

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

main([
  new Player("Aさん"),
  new Player("Bさん"),
  new Player("Cさん"),
  new Player("Dさん"),
]);
