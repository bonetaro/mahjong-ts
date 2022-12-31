type 萬子 = "manzu" | "m" | "萬";
type 筒子 = "pinzu" | "p" | "筒";
type 索子 = "souzu" | "s" | "索";

type 色 = 萬子 | 筒子 | 索子;

type 中張牌の数 = "2" | "3" | "4" | "5" | "6" | "7" | "8";
type 老頭牌の数 = "1" | "9";
type 数牌の数 = 中張牌の数 | 老頭牌の数;

type 萬子牌 = `${数牌の数}${萬子}`;
type 筒子牌 = `${数牌の数}${筒子}`;
type 索子牌 = `${数牌の数}${索子}`;

type 中張牌 = `${中張牌の数}${色}`;
type 老頭牌 = `${老頭牌の数}${色}`;
type 数牌 = 中張牌 | 老頭牌;

type 東 = "ton" | "東" | "EZ"; // EastZihai
type 南 = "nan" | "南" | "SZ"; // SouthZihai
type 西 = "sha" | "西" | "WZ"; // WestZihai
type 北 = "pei" | "北" | "NZ"; // NorthZihai
type 風牌 = 東 | 南 | 西 | 北;

type 白 = "haku" | "白" | "WD"; // WhiteDragon
type 發 = "hatsu" | "發" | "GD"; // GreenDragon
type 中 = "chun" | "中" | "RD"; // RedDragon
type 三元牌 = 白 | 發 | 中;

type 字牌 = 風牌 | 三元牌;
type 么九牌 = 老頭牌 | 字牌;

type 牌 = 数牌 | 字牌;

type 対子 = [牌, 牌]; // todo 同じ牌
type 刻子 = [牌, 牌, 牌]; // todo 同じ牌
type 槓子 = [牌, 牌, 牌, 牌]; // todo 同じ牌

type 塔子 = [数牌, 数牌]; // todo
type 順子 = [数牌, 数牌, 数牌]; // todo

type 雀頭 = [牌, 牌]; // todo 同じ牌
type 面子 = 順子 | 刻子 | 槓子;

type 配牌 = [
  牌, //1
  牌, //2
  牌, //3
  牌, //4
  牌, //5
  牌, //6
  牌, //7
  牌, //8
  牌, //9
  牌, //10
  牌, //11
  牌, //12
  牌 //13
];

type 七対子 = [対子, 対子, 対子, 対子, 対子, 対子, 対子];

type 国士無双 = [
  `1${萬子}`,
  `9${萬子}`,
  `1${筒子}`,
  `9${筒子}`,
  `1${索子}`,
  `9${索子}`,
  東,
  南,
  西,
  北,
  白,
  發,
  中,
  么九牌
];

type アガリ手牌 = [雀頭, 面子, 面子, 面子, 面子] | 七対子 | 国士無双;
