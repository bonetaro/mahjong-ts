import { FixedLengthArray } from "./";
import * as Constants from "../constants";

export type 萬子 = `${typeof Constants.ManduChar}`; // 英語はCharacters
export type 筒子 = `${typeof Constants.PinduChar}`; // 英語はWheels,dots
export type 索子 = `${typeof Constants.SouduChar}`; // 英語はBamboos
export type 風 = `${typeof Constants.WindChar}`; // Wind
export type 元 = `${typeof Constants.DragonChar}`; // Dragon

export type 牌種 = 萬子 | 筒子 | 索子 | 風 | 元;

export type 数牌の数 = (typeof Constants.Digits)[number];
export type 数牌の色 = 萬子 | 筒子 | 索子;

export type 萬子牌 = `${数牌の数}${萬子}`;
export type 筒子牌 = `${数牌の数}${筒子}`;
export type 索子牌 = `${数牌の数}${索子}`;

type 老頭牌の数 = (typeof Constants.TerminalDigits)[number];
type 中張牌の数 = (typeof Constants.SimpleDigits)[number];

export type 老頭牌 = `${老頭牌の数}${数牌の色}`;
export type 中張牌 = `${中張牌の数}${数牌の色}`;

export type 数牌 = 萬子牌 | 筒子牌 | 索子牌; // Suits

export type typeof数牌の色<T extends 数牌> = T extends 萬子牌 ? 萬子 : T extends 筒子牌 ? 筒子 : T extends 索子牌 ? 索子 : never;

export type 東 = `${typeof Constants.EastWindChar}${風}`; // EastWind
export type 南 = `${typeof Constants.SouthWindChar}${風}`; // SouthWind
export type 西 = `${typeof Constants.WestWindChar}${風}`; // WestWind
export type 北 = `${typeof Constants.NorthWindChar}${風}`; // NorthWind

export type 四風牌 = 東 | 南 | 西 | 北; // Winds

export type 白 = `${typeof Constants.WhiteDragonChar}${元}`; // WhiteDragon
export type 發 = `${typeof Constants.GreenDragonChar}${元}`; // GreenDragon
export type 中 = `${typeof Constants.RedDragonChar}${元}`; // RedDragon

export type 三元牌 = 白 | 發 | 中;

export type 字牌 = 四風牌 | 三元牌;

export type 么九牌 = 老頭牌 | 字牌; // terminals and honors

export type 牌 = 数牌 | 字牌;

export type 対子like = [牌, 牌];
export type 刻子like = [牌, 牌, 牌];
export type 槓子like = [牌, 牌, 牌, 牌];

export type 塔子like = [数牌, 数牌];
export type 塔子<C extends 数牌の色> =
  | [`2${C}`, `3${C}`]
  | [`3${C}`, `4${C}`]
  | [`4${C}`, `5${C}`]
  | [`5${C}`, `6${C}`]
  | [`6${C}`, `7${C}`]
  | [`7${C}`, `8${C}`]
  | [`1${C}`, `3${C}`]
  | [`2${C}`, `4${C}`]
  | [`3${C}`, `5${C}`]
  | [`4${C}`, `6${C}`]
  | [`5${C}`, `7${C}`]
  | [`6${C}`, `8${C}`]
  | [`7${C}`, `9${C}`]
  | [`1${C}`, `2${C}`]
  | [`8${C}`, `9${C}`];

export type 順子like = [数牌, 数牌, 数牌];
export type 順子<C extends 数牌の色> =
  | [`1${C}`, `2${C}`, `3${C}`]
  | [`2${C}`, `3${C}`, `4${C}`]
  | [`3${C}`, `4${C}`, `5${C}`]
  | [`4${C}`, `5${C}`, `6${C}`]
  | [`5${C}`, `6${C}`, `7${C}`]
  | [`6${C}`, `7${C}`, `8${C}`]
  | [`7${C}`, `8${C}`, `9${C}`];

export type 雀頭like = [牌, 牌];
export type 面子like = 順子like | 刻子like | 槓子like;

export type 七対子like = [対子like, 対子like, 対子like, 対子like, 対子like, 対子like, 対子like];
export type 国士無双 = [`1${萬子}`, `9${萬子}`, `1${筒子}`, `9${筒子}`, `1${索子}`, `9${索子}`, 東, 南, 西, 北, 白, 發, 中, 么九牌];
export type アガリ牌姿 = {
  head: 雀頭like;
  body: [面子like, 面子like, 面子like, 面子like];
};
export type アガリ手牌 = アガリ牌姿 | 七対子like | 国士無双;

export type CommandType = (typeof Constants.CommandTypeList)[number];

// 牌をツモった人ができるコマンド
export type PlayerCommandType = CommandType & ("discard" | "kan" | "tsumo");

// 捨てられた牌に対してできるコマンド
export type OtherPlayersCommandType = CommandType & ("pon" | "kan" | "chi" | "ron" | "nothing");

// 鳴きのコマンド
export type MeldCommandType = (typeof Constants.MeldCommandTypeList)[number];

export type RoundIndex = (typeof Constants.RoundIndexList)[number];

export type RoundHandIndex = (typeof Constants.RoundHandIndexList)[number];

export type FourMembers<T> = FixedLengthArray<T, 4>;

export type PlayerIndex = (typeof Constants.PlayerIndexList)[number];

export type PlayerDirection = (typeof Constants.PlayerDirectionList)[number];
