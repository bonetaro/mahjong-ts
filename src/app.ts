import { gameOption } from "./config";
import { Game, GameOption } from "./models";

const main = async (option: GameOption) => {
  const game = new Game(option);
  game.init();

  do {
    game.startRoundHand();
    await game.roundHandLoop();
  } while (await game.nextRoundHand());

  game.end();
};

main(gameOption);
