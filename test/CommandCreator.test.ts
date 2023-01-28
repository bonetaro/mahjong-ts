import { CommandType } from "../src/lib";
import { CommandTextCreator } from "../src/lib/CommandTextCreator";
import { Hand, Tile } from "../src/lib/models";

const commandList: CommandType[] = [CommandType.Discard];

const tiles: string[] = [];
tiles.push("1m"); // 1
tiles.push("1m"); // 2
tiles.push("1m"); // 3
tiles.push("9m"); // 4
tiles.push("2m"); // 5
tiles.push("3m"); // 6
tiles.push("1m"); // 7
tiles.push("1p"); // 8
tiles.push("4m"); // 9
tiles.push("4m"); // 10
tiles.push("4m"); // 11
tiles.push("1s"); // 12
tiles.push("2s"); // 13

test("コマンドが1つの時は空文字を返す", () => {
  const hand = new Hand(tiles.map((s) => Tile.toTile(s)));
  hand.tiles = hand.tiles.filter((tile, index) => index == 0); // 裸単騎
  const creator = new CommandTextCreator(commandList);
  const text = creator.createPlayerCommandText();

  expect(text).toBe("");
});

// test("捨て牌 [0-1]", () => {
//   const text = creator.createPlayerCommandText(
//     commandList,
//     new Hand(splitBy2Chars("1m2m").map((s) => toTile(s)))
//   );

//   expect(text).toBe("捨て牌[0-1]");
// });

// test("捨て牌 [0-1] ツモ(t)", () => {
//   commandList.push(PlayerCommandType.Tsumo);

//   const text = creator.createPlayerCommandText(
//     commandList,
//     new Hand(splitBy2Chars("1m2m").map((s) => toTile(s)))
//   );

//   expect(text).toBe("捨て牌[0-1] ツモ[t]");
// });

// test("捨て牌 [0-1] ツモ(t) カン(k)", () => {
//   commandList.push(PlayerCommandType.Tsumo);
//   commandList.push(PlayerCommandType.Kan);

//   const text = creator.createPlayerCommandText(
//     commandList,
//     new Hand(splitBy2Chars("1m2m").map((s) => toTile(s)))
//   );

//   expect(text).toBe("捨て牌[0-1] ツモ[t] カン[k]");
// });
