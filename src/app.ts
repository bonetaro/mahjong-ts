import { gameOption } from "./config";
import { CheatGame, Game, GameOption } from "./lib/models";

const main = async (option: GameOption) => {
  const game = option.cheat ? new CheatGame(option) : new Game(option);
  game.init();

  do {
    game.startRoundHand();
    await game.roundHandLoop();
  } while (await game.nextRoundHand());

  game.end();
};

// main();
main(gameOption);
