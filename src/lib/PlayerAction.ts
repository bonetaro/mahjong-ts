import { rl } from "../readline";
import { 牌 } from "./Types";
import { Player } from "./Player";
import {
  PlayerAskResult,
  askOtherPlayers,
  OtherPlayersAskResult,
} from "./AskPlayer";

const isSelectNumber = (s: string) => {
  const num = Number(s);
  return 0 <= num && num <= 13;
};

export const playerAction = (
  player: Player,
  answer: string,
  resolve: (value: PlayerAskResult | Promise<PlayerAskResult>) => void,
  reject: (reason?: any) => void
) => {
  const result = new PlayerAskResult();

  if (isSelectNumber(answer)) {
    result.discard = player.discard(Number(answer));
    resolve(result);
  }

  const tile = player.hand.tiles[Number(answer)];
  switch (answer.toLowerCase()) {
    case "k":
      result.kan = tile;
      break;
    case "t":
      result.tsumo = tile;
      break;
    default:
      resolve(result);
      break;
  }
};

// todo 鳴き　要実装
const meldAction = (players: Player[], answer: string, action: string): 牌 => {
  const num = Number(answer);
  let tile = players[num].meld(num, action);
  return tile;
};

export const otherPlayersAction = (
  players: Player[],
  answer: string,
  tile: 牌,
  resolve: (
    value: OtherPlayersAskResult | Promise<OtherPlayersAskResult>
  ) => void,
  reject: (reason?: any) => void
) => {
  const result = new OtherPlayersAskResult();
  switch (answer.toLowerCase()) {
    case "p":
      rl.question(`> 誰が?[0-3]\n`, (answer) => {
        result.doPon(tile, players[Number(answer)]);
        resolve(askOtherPlayers(players, meldAction(players, answer, "p")));
      });
      break;
    case "k":
      rl.question(`> 誰が?[0-3]\n`, (answer) => {
        result.doKan(tile, players[Number(answer)]);
        resolve(askOtherPlayers(players, meldAction(players, answer, "k")));
      });
      break;
    case "c":
      rl.question(`> 誰が?[0-3]\n`, (answer) => {
        result.doChi(tile, players[Number(answer)]);
        resolve(askOtherPlayers(players, meldAction(players, answer, "c")));
      });
      break;
    case "r":
      rl.question(`> 誰が?[0-3]\n`, (answer) => {
        result.doRon(tile, players[Number(answer)]);
        resolve(result);
      });
      break;
    default:
      resolve(result);
      break;
  }
};
