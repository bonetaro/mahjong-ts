import { 萬子, 筒子, 索子, 老頭牌, 数牌, isSuits } from "./MahjongTypeSuits";
import {
  字牌,
  風牌,
  三元牌,
  東,
  南,
  西,
  北,
  白,
  發,
  中,
  isHonours,
} from "./MahjongTypeHonours";

export type 么九牌 = 老頭牌 | 字牌;

export type 牌 = 数牌 | 字牌;

export type 対子 = [牌, 牌]; // todo 同じ牌
export type 刻子 = [牌, 牌, 牌]; // todo 同じ牌
export type 槓子 = [牌, 牌, 牌, 牌]; // todo 同じ牌

export type 塔子 = [数牌, 数牌]; // todo
export type 順子 = [数牌, 数牌, 数牌]; // todo

export type 雀頭 = [牌, 牌]; // todo 同じ牌
export type 面子 = 順子 | 刻子 | 槓子;

export type 配牌 = [
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

export type 七対子 = [対子, 対子, 対子, 対子, 対子, 対子, 対子];

export type 国士無双 = [
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

export type アガリ手牌 = [雀頭, 面子, 面子, 面子, 面子] | 七対子 | 国士無双;

export function toTile(value: unknown): 牌 {
  if (isSuits(value) || isHonours(value)) return value;
}
