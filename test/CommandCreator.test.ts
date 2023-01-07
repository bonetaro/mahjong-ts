import { CommandCreator } from "../src/lib/CommandCreator";
import { PlayerCommandType } from "../src/lib/Constants";
import { splitBy2Chars, toTile } from "../src/lib/Functions";
import { Hand } from "../src/lib/Hand";

const creator = new CommandCreator();
const commandList: PlayerCommandType[] = [PlayerCommandType.Discard];

test("捨て牌 [0]", () => {
  const text = creator.createText(
    commandList,
    new Hand(splitBy2Chars("1m").map((s) => toTile(s)))
  );

  expect(text).toBe("捨て牌[0]");
});

test("捨て牌 [0-1]", () => {
  const text = creator.createText(
    commandList,
    new Hand(splitBy2Chars("1m2m").map((s) => toTile(s)))
  );

  expect(text).toBe("捨て牌[0-1]");
});

test("捨て牌 [0-1] ツモ(t)", () => {
  commandList.push(PlayerCommandType.Tsumo);

  const text = creator.createText(
    commandList,
    new Hand(splitBy2Chars("1m2m").map((s) => toTile(s)))
  );

  expect(text).toBe("捨て牌[0-1] ツモ[t]");
});

test("捨て牌 [0-1] ツモ(t) カン(k)", () => {
  commandList.push(PlayerCommandType.Tsumo);
  commandList.push(PlayerCommandType.Kan);

  const text = creator.createText(
    commandList,
    new Hand(splitBy2Chars("1m2m").map((s) => toTile(s)))
  );

  expect(text).toBe("捨て牌[0-1] ツモ[t] カン[k]");
});
