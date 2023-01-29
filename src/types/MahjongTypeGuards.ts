import { CommandTypeList, HandTilesDigits, MeldCommandTypeList, PlayerDirectionList, PlayerIndexList, WinCommandTypeList } from "../constants";
import { helper } from "../lib";
import { CommandType, FourMembers, HandTilesIndex, MeldCommandType, PlayerDirection, PlayerIndex } from "./";

export const isFourMembers = <T>(members: unknown[]): members is FourMembers<T> => members.length == 4;

export const isPlayerIndex = (num: unknown): num is PlayerIndex => helper.includes(PlayerIndexList, num);

export const isPlayerDirection = (direction: unknown): direction is PlayerDirection => helper.includes(PlayerDirectionList, direction);

// todo 手牌の長さに応じて動的にしたい
export const isHandTilesIndex = (index: unknown): index is HandTilesIndex => helper.includes(HandTilesDigits, index);

export const isCommandType = (type: unknown): type is CommandType => {
  return helper.includes(CommandTypeList, type);
};

export const isMeldCommandType = (type: unknown): type is MeldCommandType => {
  return helper.includes(MeldCommandTypeList, type);
};

export const isWinCommandType = (type: unknown): type is MeldCommandType => {
  return helper.includes(WinCommandTypeList, type);
};
