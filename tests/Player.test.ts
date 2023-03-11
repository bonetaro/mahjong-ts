import { GameRoundHandPlayer, Player } from "../src/models";
import { FourMembers } from "../src/types";
import { GameRoundHand } from "../src/models/GameRoundHand";

const players: FourMembers<Player> = [new Player("Aさん"), new Player("Bさん"), new Player("Cさん"), new Player("Dさん")];

const roundHandPlayers = players.map((player, index) => new GameRoundHandPlayer(player, index)) as FourMembers<GameRoundHandPlayer>;
const roundHand = new GameRoundHand(roundHandPlayers);

test("Aさんの上家はDさん", () => {
  const result = roundHandPlayers[3].isLeftPlayerOf(roundHandPlayers[0]);
  expect(result).toBe(true);

  const leftPlayer = roundHand.getPlayerByDirection(roundHand.players[0], "toTheLeft");
  expect(leftPlayer.id).toEqual(roundHand.players[3].id);
});

test("Aさんの下家はBさん", () => {
  const result = roundHandPlayers[1].isRightPlayerOf(roundHandPlayers[0]);
  expect(result).toBe(true);

  const rightPlayer = roundHand.getPlayerByDirection(roundHand.players[0], "toTheRight");
  expect(rightPlayer.id).toEqual(roundHand.players[1].id);
});

test("Aさんの対面はCさん", () => {
  const result = roundHandPlayers[2].isOppositePlayerOf(roundHandPlayers[0]);
  expect(result).toBe(true);

  const oppositePlayer = roundHand.getPlayerByDirection(roundHand.players[0], "opposite");
  expect(oppositePlayer.id).toEqual(roundHand.players[2].id);
});

test("Bさんの対面はDさん", () => {
  const result = roundHandPlayers[3].isOppositePlayerOf(roundHandPlayers[1]);
  expect(result).toBe(true);

  const oppositePlayer = roundHand.getPlayerByDirection(roundHand.players[1], "opposite");
  expect(oppositePlayer.id).toEqual(roundHand.players[3].id);
});
