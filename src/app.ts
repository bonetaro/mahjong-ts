import { LogEvent, logger } from "./logging";
import { Game } from "./lib/Game";
import { Player } from "./lib/Player";
import { 牌 } from "./lib/Types";
import {
  askPlayer,
  askOtherPlayers,
  PlayerAskResult,
  OtherPlayersAskResult,
} from "./lib/AskPlayer";

const askPlayerLoop = async (player: Player): Promise<PlayerAskResult> => {
  let result: PlayerAskResult;

  while (true) {
    result = await askPlayer(player);
    if (result.isValid) {
      return result;
    }

    logger.error("無効な操作");
  }
};

const askOtherPlayersLoop = async (
  game: Game,
  discard: 牌
): Promise<OtherPlayersAskResult> => {
  let result: OtherPlayersAskResult;

  while (true) {
    result = await askOtherPlayers(game.otherPlayers, discard);

    if (result.ron) {
      return result;
    }

    if (result.chi) {
      // todo
    }
    if (result.pon) {
      // todo
    }
    if (result.kan) {
      // todo
    }
  }
};

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
