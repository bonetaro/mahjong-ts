export const ManduChar = "m"; // 萬子 Characters
export const PinduChar = "p"; // 筒子 Wheels
export const SouduChar = "s"; // 索子 Bamboos

export const KazehaiChar = "w"; // 風牌 Winds
export const EastWindChar = "e"; // 東
export const SouthWindChar = "s"; // 南
export const WestWindChar = "w"; // 西
export const NorthWindChar = "n"; // 北

export const SangenpaiChar = "d"; // 三元牌 Dragons
export const WhiteDragonChar = "w"; // 白 WhiteDragon
export const GreenDragonChar = "g"; // 發 GreenDragon
export const RedDragonChar = "r"; // 中 RedDragon

// 手牌を並び替えするときの牌種順
const TileTypeSort = [ManduChar, PinduChar, SouduChar, KazehaiChar, SangenpaiChar] as const;

export const WindsLabel = ["東", "南", "西", "北"] as const;

const WindsSort = [EastWindChar, SouthWindChar, WestWindChar, NorthWindChar] as const;
const DragonsSort = [WhiteDragonChar, GreenDragonChar, RedDragonChar] as const;

const Winds: string[] = WindsSort.map((c) => c + KazehaiChar);
const Dragons: string[] = DragonsSort.map((c) => c + SangenpaiChar);

const typeSortMap = new Map<string, number>();
TileTypeSort.forEach((x, index) => typeSortMap.set(x, index));

const windSortMap = new Map<string, number>();
WindsSort.forEach((x, index) => windSortMap.set(x, index));

const dragonSortMap = new Map<string, number>();
DragonsSort.forEach((x, index) => dragonSortMap.set(x, index));

export { TileTypeSort, Winds, Dragons, WindsSort, DragonsSort, typeSortMap, windSortMap, dragonSortMap };

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

export enum PlayerDirection {
  ToTheLeft = 0, // 上家
  Opposite = 1, // 対面
  ToTheRight = 2, // 下家
}
