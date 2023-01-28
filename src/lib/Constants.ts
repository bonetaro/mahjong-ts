export const ManduChar = "m"; // 萬子 Characters
export const PinduChar = "p"; // 筒子 Wheels
export const SouduChar = "s"; // 索子 Bamboos
export const KazehaiChar = "w"; // 風牌 Winds
export const SangenpaiChar = "d"; // 三元牌 Dragons

export const EastWindChar = "e"; // 東
export const SouthWindChar = "s"; // 南
export const WestWindChar = "w"; // 西
export const NorthWindChar = "n"; // 北

export const WhiteDragonChar = "w"; // 白 WhiteDragon
export const GreenDragonChar = "g"; // 發 GreenDragon
export const RedDragonChar = "r"; // 中 RedDragon

export const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const WindChars = [EastWindChar, SouthWindChar, WestWindChar, NorthWindChar] as const;
export const WindNames = ["東", "南", "西", "北"] as const;

export const DragonChars = [WhiteDragonChar, GreenDragonChar, RedDragonChar] as const;
export const DragonNames = ["白", "發", "中"] as const;

// 手牌を並び替えするときの牌種順
export const TileTypeSort = [ManduChar, PinduChar, SouduChar, KazehaiChar, SangenpaiChar] as const;

export const RoundIndexList = [0, 1];

export const RoundHandIndexList = [0, 1, 2, 3];

export const PlayerIndexList = [0, 1, 2, 3];

export const PlayerDirections = ["self", "toTheRight", "opposite", "toTheLeft"] as const;

enum CommandType {
  Discard = "discard", // 牌を捨てる
  Pon = "pon",
  Kan = "kan",
  Chi = "chi",
  Tsumo = "tsumo",
  Ron = "ron",
  Nothing = "nothing",
}

// 牌をツモった人ができるコマンド
type PlayerCommandType = CommandType.Discard | CommandType.Kan | CommandType.Tsumo;

// 捨てられた牌に対してできるコマンド
type OtherPlayersCommandType = CommandType.Pon | CommandType.Kan | CommandType.Chi | CommandType.Ron | CommandType.Nothing;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace CommandType {
  export function name(type: CommandType): string {
    switch (type) {
      case CommandType.Pon:
        return "ポン";
      case CommandType.Chi:
        return "チー";
      case CommandType.Kan:
        return "カン";
      case CommandType.Tsumo:
        return "ツモ";
      case CommandType.Ron:
        return "ロン";
      case CommandType.Discard:
        return "牌を捨てる";
      case CommandType.Nothing:
        return "何もしない";
      default:
        throw new Error(type);
    }
  }
}

export { CommandType, PlayerCommandType, OtherPlayersCommandType };
