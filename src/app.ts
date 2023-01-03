import { LogEvent, logger } from "./logging";
import { Game } from "./lib/Game";
import { Player } from "./lib/Player";
import { askPlayerLoop, askOtherPlayersLoop } from "./lib/AskPlayer";

const gameRoundHandLoop = async (game: Game) => {
  let player = game.currentPlayer;
  player.drawTile(game.pickTile());

  while (true) {
    const playerResult = await askPlayerLoop(player);

    if (playerResult.tsumo) {
      game.currentRoundHand.TsumoEnd(player);
      return;
    }

    const otherPlayersResult = await askOtherPlayersLoop(
      game,
      playerResult.tile
    );

    if (otherPlayersResult.ron) {
      game.currentRoundHand.RonEnd(
        otherPlayersResult.Player,
        player,
        playerResult.tile
      );
      return;
    }

    if (!game.hasRestTiles()) {
      game.currentRoundHand.drawEnd();
      break;
    }

    player = game.nextPlayer;
    player.drawTile(game.pickTile());
  }
};

const game = new Game();

game.setPlayers([
  new Player("Aさん"),
  new Player("Bさん"),
  new Player("Cさん"),
  new Player("Dさん"),
]);

// 半荘開始
game.start();

// 東場第1局
game.startHand();

LogEvent(game.status());

// メインループ
const main = async (game: Game) => {
  while (true) {
    await gameRoundHandLoop(game); // 局のループ

    if (game.isLastRoundHand()) {
      break;
    }

    game.nextRoundHand();
  }
};

main(game);
