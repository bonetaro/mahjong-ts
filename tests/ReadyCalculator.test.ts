import { ReadyCalculator } from "../src/lib/calculator/ReadyCalculator";
import { PlayerHand } from "../src/models/PlayerHand";

//（最悪=かぶりなし、ターツなしでも七対子としてみれば、最悪でも6シャンテン）
const worstTiles = "2m5m8m1p4p7p3s6s9sewswwwnw";

// test(`${worstTiles} is 6向聴`, () => {
//   const calculator = new ReadyCalculator(new PlayerHand(worstTiles));
//   expect(calculator.calculate()).toBe(6);
// });

const calculator = (tiles: string): ReadyCalculator => {
  return new ReadyCalculator(new PlayerHand(tiles));
};

const tiles = "3m4m5m2p4p7p1s1s1s7s8s9snw";
test(`${tiles} (2順子) is 1シャンテン`, () => {
  expect(calculator(tiles).calculate()).toBe(2);
});

test(`七対子`, () => {
  expect(calculator("3m4m5m2p4p7p1s1s1s7s8s9snw").calculateAsSevenPairs()).toBe(5);
  expect(calculator("3m3m2p2p4p4p1s1s7s7s9s9snw").calculateAsSevenPairs()).toBe(0);
});

test(`国士無双`, () => {
  expect(calculator("1m9m1p9p1s9sewswwwnwwdgdrd").calculateAsThirteenOrphans()).toBe(0); // 13面待ち
  expect(calculator("1m2m1p9p1s9sewswwwnwwdgdrd").calculateAsThirteenOrphans()).toBe(1);
  expect(calculator("1m1m1p9p1s9sewswwwnwwdgdrd").calculateAsThirteenOrphans()).toBe(0); // 雀頭あり
  expect(calculator("1m1m1p1p1s9sewswwwnwwdgdrd").calculateAsThirteenOrphans()).toBe(1); // 重複複数あり
});
