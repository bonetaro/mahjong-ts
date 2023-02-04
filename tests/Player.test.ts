import { GameRoundHandPlayer, Player } from "../src/models";
import { FourMembers } from "../src/types";
import { GameRoundHandMembers } from "../src/models/GameRoundHandMembers";

const players: FourMembers<Player> = [new Player("Aさん"), new Player("Bさん"), new Player("Cさん"), new Player("Dさん")];

const roundHandPlayers = players.map((player, index) => new GameRoundHandPlayer(index, player)) as FourMembers<GameRoundHandPlayer>;
const roundHandMembers = new GameRoundHandMembers(roundHandPlayers);

test("Aさんの上家はDさん", () => {
  const result = roundHandPlayers[3].isLeftPlayerOf(roundHandPlayers[0]);
  expect(result).toBe(true);

  const leftPlayer = roundHandMembers.getPlayerByDirection(roundHandMembers.players[0], "toTheLeft");
  expect(leftPlayer.id).toEqual(roundHandMembers.players[3].id);
});

test("Aさんの下家はBさん", () => {
  const result = roundHandPlayers[1].isRightPlayerOf(roundHandPlayers[0]);
  expect(result).toBe(true);

  const rightPlayer = roundHandMembers.getPlayerByDirection(roundHandMembers.players[0], "toTheRight");
  expect(rightPlayer.id).toEqual(roundHandMembers.players[1].id);
});

test("Aさんの対面はCさん", () => {
  const result = roundHandPlayers[2].isOppositePlayerOf(roundHandPlayers[0]);
  expect(result).toBe(true);

  const oppositePlayer = roundHandMembers.getPlayerByDirection(roundHandMembers.players[0], "opposite");
  expect(oppositePlayer.id).toEqual(roundHandMembers.players[2].id);
});

test("Bさんの対面はDさん", () => {
  const result = roundHandPlayers[3].isOppositePlayerOf(roundHandPlayers[1]);
  expect(result).toBe(true);

  const oppositePlayer = roundHandMembers.getPlayerByDirection(roundHandMembers.players[1], "opposite");
  expect(oppositePlayer.id).toEqual(roundHandMembers.players[3].id);
});
