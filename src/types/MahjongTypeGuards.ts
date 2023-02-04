import { CommandTypeList, MeldCommandTypeList, PlayerDirectionList, PlayerIndexList, WinCommandTypeList } from "../constants";
import { Helper } from "../lib";
import { CommandType, FourMembers, MeldCommandType, PlayerDirection, PlayerIndex } from "./";

export const isFourMembers = <T>(members: unknown[]): members is FourMembers<T> => members.length == 4;

export const isPlayerIndex = (num: unknown): num is PlayerIndex => Helper.includes(PlayerIndexList, num);

export const isPlayerDirection = (direction: unknown): direction is PlayerDirection => Helper.includes(PlayerDirectionList, direction);

export const isCommandType = (type: unknown): type is CommandType => {
  return Helper.includes(CommandTypeList, type);
};

export const isMeldCommandType = (type: unknown): type is MeldCommandType => {
  return Helper.includes(MeldCommandTypeList, type);
};

export const isWinCommandType = (type: unknown): type is MeldCommandType => {
  return Helper.includes(WinCommandTypeList, type);
};
