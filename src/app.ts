import { Game } from "./lib/Game";
import { Player } from "./lib/Player";
import { askPlayerLoop, askOtherPlayersLoop } from "./lib/AskPlayer";

const gameRoundHandLoop = async (game: Game) => {
  let player = game.currentPlayer;

  // 親の第1ツモ
  player.drawTile(game.pickTile());

  while (true) {
    // 牌をツモったプレイヤーのターン
    const playerResult = await askPlayerLoop(player);
    if (playerResult.tsumo) {
      game.currentRoundHand.tsumoEnd(player);
      return;
    }

    // 牌をツモったプレイヤー以外のプレイヤーのターン
    const otherPlayersResult = await askOtherPlayersLoop(
      game,
      playerResult.dicardTile
    );
    if (otherPlayersResult.ron) {
      game.currentRoundHand.ronEnd(
        otherPlayersResult.Player,
        player,
        playerResult.dicardTile
      );
      return;
    }

    if (!game.hasRestTiles()) {
      game.currentRoundHand.end();
      break;
    }

    player = game.nextPlayer;
    player.drawTile(game.pickTile());
  }
};

const main = async (players: Player[]) => {
  const game = new Game(players);
  game.start();

  while (true) {
    await gameRoundHandLoop(game);

    if (game.isLastRoundHand()) {
      break;
    }
    game.nextRoundHand();
  }

  game.end();
};

main([
  new Player("Aさん"),
  new Player("Bさん"),
  new Player("Cさん"),
  new Player("Dさん"),
]);
