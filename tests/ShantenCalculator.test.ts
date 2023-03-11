import { CalculatorType, IShantenCalculator, ReadyCalculatorFactory, SevenPairsCalculator, TerminalsAndHonorsCalculator } from "../src/lib/calculator";
import { AnKanMentsu, DrawTile, PlayerHand } from "../src/models";
import { SubShantenCalculator } from "../src/lib/calculator";

const calculator = (key: CalculatorType, tiles: string): IShantenCalculator => {
  return ReadyCalculatorFactory.factory(key, new PlayerHand(tiles));
};

const calcTest = (tiles: string, num: number) => {
  expect(calculator("sub", tiles).calculateShanten()).toBe(num);
  expect(calculator("add", tiles).calculateShanten()).toBe(num);
};

const sevenPairsCalculator = (tiles: string): SevenPairsCalculator => {
  return new SevenPairsCalculator(new PlayerHand(tiles));
};

const terminalsAndHonorsCalculator = (tiles: string): SevenPairsCalculator => {
  return new TerminalsAndHonorsCalculator(new PlayerHand(tiles));
};

test(`七対子`, () => {
  expect(sevenPairsCalculator("3m4m5m2p4p7p1s1s1s7s8s9snw").calculateShanten()).toBe(5);
  expect(sevenPairsCalculator("3m3m5m2p2p7p1s1s7s7s7s7snw").calculateShanten()).toBe(2);
  expect(sevenPairsCalculator("3m3m2p2p4p4p1s1s7s7s9sewnw").calculateShanten()).toBe(1);
  expect(sevenPairsCalculator("3m3m2p2p4p4p1s1s7s7s9s9snw").calculateShanten()).toBe(0);
});

test(`国士無双`, () => {
  expect(terminalsAndHonorsCalculator("1m9m1p9p1s9sewswwwnwwdgdrd").calculateShanten()).toBe(0); // 13面待ち
  expect(terminalsAndHonorsCalculator("1m2m1p9p1s9sewswwwnwwdgdrd").calculateShanten()).toBe(1);
  expect(terminalsAndHonorsCalculator("1m1m1p9p1s9sewswwwnwwdgdrd").calculateShanten()).toBe(0); // 雀頭あり
  expect(terminalsAndHonorsCalculator("1m1m1p1p1s9sewswwwnwwdgdrd").calculateShanten()).toBe(1); // 重複複数あり
});

test(`シャンテン`, () => {
  // 面子としては8シャンテン(面子、ターツ何もなし)だが、国士として6シャンテン
  calcTest("1m4m7m1p4p7p1s4s7snwswwdrd", 6);
});

test(`シャンテン2`, () => {
  calcTest("1m2m3m1p3p4s4s4snwnwswwdrd", 2);
});

test(`シャンテン3`, () => {
  calcTest("3m4m5m2p4p7p1s1s1s7s8s9snw", 1);
});

test(`シャンテン4`, () => {
  calcTest("2m2m4m6m8m1p1p3p6s7srdrdrd", 2);
});

test(`シャンテン5`, () => {
  calcTest("2m5m6m8m8m1p3p5p6p7p1s5s6s", 2);
});

test(`シャンテン6`, () => {
  calcTest("1m2m2m3m8m8m5p6p7p9p7s8sew", 2);
});

test(`シャンテン7`, () => {
  calcTest("1m1m1m4m5m6m7m8m2p3p4p5p9p", 1);
});

test(`シャンテン8`, () => {
  calcTest("1m1m1m2m3m4m4m4m5m6m6m7m9m", 1);
});

test(`シャンテン9`, () => {
  calcTest("4m5m6m9m9m1p6p6p7p9p2s6s9s", 3);
});

test(`シャンテン10`, () => {
  calcTest("1m1m1m2m3m4m5m6m7m8m9m9m9m", 0);
});

test(`シャンテン11`, () => {
  calcTest("3m4m8m8m2p4p7p8p9p1s2s6s7s", 2);
});

test(`シャンテン12`, () => {
  calcTest("3m4m7m8m2p4p7p8p9p1s2s6s7s", 3);
});

test(`シャンテン13`, () => {
  calcTest("3m4m7m8m2p4p7p8p9p1s4s9sew", 3);
});

test(`シャンテン14`, () => {
  calcTest("1m1m1m1m2m3m3m4m4m9m1p2s4s", 2);
});

test(`シャンテン15`, () => {
  calcTest("2m3m3m2p3p1s2s3snwnwwdwdwd", 1);
});

test(`シャンテン16`, () => {
  calcTest("2m3m4m4m4m5m6m1s2s3snwnwnw", 0);
});

test(`シャンテン17`, () => {
  calcTest("1m1m1m2m3m4m1s2s3sewnwnwnw", 0);
});

test(`シャンテン18`, () => {
  calcTest("1m3m4m5m1s2s3s1p2p3pnwnwnw", 0);
});

test(`シャンテン19`, () => {
  const hand = new PlayerHand("1m1m1m1m2m3m3m4m4m9m1p2s4s");
  expect(new SubShantenCalculator(hand).calculateShanten()).toBe(2);

  hand.removeTiles(["1m", "1m", "1m", "1m"]);
  hand.openMentsuList.push(new AnKanMentsu("1m"));
  hand.drawingTile = new DrawTile("2m");
  expect(new SubShantenCalculator(hand).calculateShanten()).toBe(1);
});

test(`シャンテン20`, () => {
  const hand = new PlayerHand("1m1m1m1m2m2m3m3m4m4m2s4s6s");
  hand.removeTiles(["1m", "1m", "1m", "1m"]);
  hand.openMentsuList.push(new AnKanMentsu("1m"));
  hand.drawingTile = new DrawTile("2s");
  expect(new SubShantenCalculator(hand).calculateShanten()).toBe(0);
});
