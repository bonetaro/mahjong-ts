import * as Constants from "./Constants";
import { 牌, 萬子牌, 筒子牌, 索子牌, 数牌, 東, 南, 西, 北, 風牌, 白, 發, 中, 三元牌, 字牌, FourMembers, 槓子 } from "./Types";
import { WindsSort, DragonsSort, PlayerDirection } from "./Constants";
import { Player } from "./models/Player";
import { typeSortMap } from "./Constants";
import { List } from "linqts";
import { PlayerCommandType } from ".";

export function toTile(value: unknown): 牌 {
  if (isTile(value)) return value;
}

export function isTile(value: unknown): value is 牌 {
  return isSuits(value) || isHonours(value);
}

export function isManzu(value: unknown): value is 萬子牌 {
  return new RegExp(`^[1-9]${Constants.ManduChar}$`, "g").test(value.toString());
}

export function isPinzu(value: unknown): value is 筒子牌 {
  return new RegExp(`^[1-9]${Constants.PinduChar}$`, "g").test(value.toString());
}

export function isSouzu(value: unknown): value is 索子牌 {
  return new RegExp(`^[1-9]${Constants.SouduChar}$`, "g").test(value.toString());
}

export function isKanMentsu(values: unknown[]): values is 槓子 {
  return values.every((v) => isTile(v)) && values.every((v) => v == values[0]);
}

export function isSuits(value: unknown): value is 数牌 {
  return isManzu(value) || isPinzu(value) || isSouzu(value);
}

export function toManzu(value: unknown): 萬子牌 {
  if (isManzu(value)) return value;
  throw new Error(`${value} NOT 萬子牌`);
}

export function toPinzu(value: unknown): 筒子牌 {
  if (isPinzu(value)) return value;
  throw new Error(`${value} NOT 筒子牌`);
}

export function toSouzu(value: unknown): 索子牌 {
  if (isSouzu(value)) return value;
  throw new Error(`${value} NOT 索子牌`);
}

export function toSuits(value: unknown): 数牌 {
  if (isSuits(value)) return value;
  throw new Error(`${value} NOT 数牌`);
}

export function isEast(value: unknown): value is 東 {
  return value.toString() === `${Constants.EastWindChar}${Constants.KazehaiChar}`;
}

export function isSouth(value: unknown): value is 南 {
  return value.toString() === `${Constants.SouduChar}${Constants.KazehaiChar}`;
}

export function isWest(value: unknown): value is 西 {
  return value.toString() === `${Constants.WestWindChar}${Constants.KazehaiChar}`;
}

export function isNorth(value: unknown): value is 北 {
  return value.toString() === `${Constants.NorthWindChar}${Constants.KazehaiChar}`;
}

export function isKazehai(value: unknown): value is 風牌 {
  return isEast(value) || isSouth(value) || isWest(value) || isNorth(value);
}

export function isHaku(value: unknown): value is 白 {
  return value.toString() === `${Constants.WhiteDragonChar}${Constants.SangenpaiChar}`;
}

export function isHatsu(value: unknown): value is 發 {
  return value.toString() === `${Constants.GreenDragonChar}${Constants.SangenpaiChar}`;
}

export function isChun(value: unknown): value is 中 {
  return value.toString() === `${Constants.RedDragonChar}${Constants.SangenpaiChar}`;
}

export function isSangenpai(value: unknown): value is 三元牌 {
  return isHaku(value) || isHatsu(value) || isChun(value);
}

export function isHonours(value: unknown): value is 字牌 {
  return isKazehai(value) || isSangenpai(value);
}

export function ToEast(value: unknown): 東 {
  if (isEast(value)) return value;
  throw new Error(`${value} NOT 東`);
}

export function ToSouth(value: unknown): 南 {
  if (isSouth(value)) return value;
  throw new Error(`${value} NOT 南`);
}

export function ToWest(value: unknown): 西 {
  if (isWest(value)) return value;
  throw new Error(`${value} NOT 西`);
}

export function ToNorth(value: unknown): 北 {
  if (isNorth(value)) return value;
  throw new Error(`${value} NOT 北`);
}

export function ToKazehai(value: unknown): 風牌 {
  if (isKazehai(value)) return value;
  throw new Error(`${value} NOT 風牌`);
}

export function ToHaku(value: unknown): 白 {
  if (isHaku(value)) return value;
  throw new Error(`${value} NOT 白`);
}

export function ToHatsu(value: unknown): 發 {
  if (isHatsu(value)) return value;
  throw new Error(`${value} NOT 發`);
}

export function ToChun(value: unknown): 中 {
  if (isChun(value)) return value;
  throw new Error(`${value} NOT 中`);
}

export function ToSangenpai(value: unknown): 三元牌 {
  if (isSangenpai(value)) return value;
  throw new Error(`${value} NOT 三元牌`);
}

export function ToHonours(value: unknown): 字牌 {
  if (isHonours(value)) return value;
  throw new Error(`${value} NOT 字牌`);
}

export function toEmojiFromArray(values: Array<牌>): string {
  return values.map((v) => toEmoji(v)).join(" ");
}

export function toEmoji(value: 牌, hide = false): string {
  const manzuList = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"];
  const pinzuList = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];
  const souzuList = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"];
  const kazehaiList = { e: "🀀", s: "🀁", w: "🀂", n: "🀃" };
  const sangenpaiList = { w: "🀆", g: "🀅", r: "🀄" };
  const hideTile = "🀫";

  if (hide) {
    return hideTile;
  }

  if (isManzu(value)) {
    return manzuList[Number(value[0]) - 1];
  } else if (isPinzu(value)) {
    return pinzuList[Number(value[0]) - 1];
  } else if (isSouzu(value)) {
    return souzuList[Number(value[0]) - 1];
  } else if (isKazehai(value)) {
    return kazehaiList[value[0] as keyof typeof kazehaiList];
  } else if (isSangenpai(value)) {
    return sangenpaiList[value[0] as keyof typeof sangenpaiList];
  } else {
    return "?";
  }
}

export function toKanjiFromArray(values: Array<牌>): string {
  return values.map((v) => toKanji(v)).join(" ");
}

export function toKanji(value: 牌): string {
  const manzuList = ["一萬", "二萬", "三萬", "四萬", "五萬", "六萬", "七萬", "八萬", "九萬"];
  const pinzuList = ["一筒", "二筒", "三筒", "四筒", "五筒", "六筒", "七筒", "八筒", "九筒"];
  const souzuList = ["一索", "二索", "三索", "四索", "五索", "六索", "七索", "八索", "九索"];
  const kazehaiList: any = { e: "東", s: "南", w: "西", n: "北" };
  const sangenpaiList: any = { w: "白", g: "發", r: "中" };

  if (isManzu(value)) {
    return manzuList[Number(value[0]) - 1];
  } else if (isPinzu(value)) {
    return pinzuList[Number(value[0]) - 1];
  } else if (isSouzu(value)) {
    return souzuList[Number(value[0]) - 1];
  } else if (isKazehai(value)) {
    return kazehaiList[value[0]];
  } else if (isSangenpai(value)) {
    return sangenpaiList[value[0]];
  } else {
    return "?";
  }
}

export function toMoji(value: 牌): string {
  return `${toEmoji(value)} (${toKanji(value)})`;
}

export function nextTile(tile: 牌): 牌 {
  if (isSuits(tile)) {
    const nextNumber = Number(tile[0]) + 1;
    return toSuits(`${nextNumber == 10 ? 1 : nextNumber}${tile[1]}`);
  } else if (isKazehai(tile)) {
    return ToKazehai(`${WindsSort[(Number(Constants.windSortMap.get(tile[0])) + 1) % 4]}${Constants.KazehaiChar}`);
  } else if (isSangenpai(tile)) {
    return ToSangenpai(`${DragonsSort[(Number(Constants.dragonSortMap.get(tile[0])) + 1) % 3]}${Constants.SangenpaiChar}`);
  } else {
    throw new Error(tile);
  }
}

export const isRangeNumber = (input: string, max: number, min = 0) => input && min <= Number(input) && Number(input) <= max;

export const splitBy2Chars = (text: string): string[] => {
  return text.match(/.{2}/g);
};

export const calucatePlayerDirection = (who: Player, whom: Player, players: FourMembers<Player>): PlayerDirection => {
  const whoIndex = players.findIndex((player) => player.id == who.id);
  const whomIndex = players.findIndex((player) => player.id == whom.id);

  if (whomIndex == whoIndex - 1) {
    return PlayerDirection.ToTheLeft;
  } else if (whoIndex == whoIndex + 1) {
    return PlayerDirection.ToTheRight;
  } else {
    return PlayerDirection.Opposite;
  }
};

export const sortTiles = (tiles: 牌[]): 牌[] => {
  return new List(tiles)
    .OrderBy((x) => typeSortMap.get(x[1])) // 2文字目で整列
    .ThenBy((x) => {
      const key = x[0]; // 1文字目で整列

      if (isSuits(x)) return key;
      if (isKazehai(x)) return Constants.windSortMap.get(key);
      if (isSangenpai(x)) return Constants.dragonSortMap.get(key);
      throw new Error(x);
    })
    .ToArray();
};

export const isMeldCommandType = (type: PlayerCommandType): boolean => {
  switch (type) {
    case PlayerCommandType.Pon:
    case PlayerCommandType.Chi:
    case PlayerCommandType.Kan:
      return true;
    default:
      return false;
  }
};
