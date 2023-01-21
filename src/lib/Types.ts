export type 萬子 = "m"; // 英語はCharacters
export type 筒子 = "p"; // 英語はWheels
export type 索子 = "s"; // 英語はBamboos
export type 風 = "w"; // Wind
export type 元 = "d"; // Dragon

export type 数牌の数 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type 数牌の色 = 萬子 | 筒子 | 索子;

export type 萬子牌 = `${数牌の数}${萬子}`;
export type 筒子牌 = `${数牌の数}${筒子}`;
export type 索子牌 = `${数牌の数}${索子}`;

type 老頭牌の数 = 1 | 9;
type 中張牌の数 = 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type 中張牌 = `${中張牌の数}${数牌の色}`;
export type 老頭牌 = `${老頭牌の数}${数牌の色}`;

export type 数牌 = 萬子牌 | 筒子牌 | 索子牌; // Suits
// export type 数牌 = 老頭牌 | 中張牌; // Suits

export type typeof数牌の色<T extends 数牌> = T extends 萬子牌 ? 萬子 : T extends 筒子牌 ? 筒子 : T extends 索子牌 ? 索子 : never;
// type color1 = typeof数牌の色<"1m">;

export type 東 = `e${風}`; // EastWind
export type 南 = `s${風}`; // SouthWind
export type 西 = `w${風}`; // WestWind
export type 北 = `n${風}`; // NorthWind

export type 白 = `w${元}`; // WhiteDragon
export type 發 = `g${元}`; // GreenDragon
export type 中 = `r${元}`; // RedDragon

export type 四風牌 = 東 | 南 | 西 | 北; // Winds
export type 三元牌 = 白 | 發 | 中; // Dragons
export type 字牌 = 四風牌 | 三元牌; // Honours

export type 么九牌 = 老頭牌 | 字牌;

export type 牌 = 数牌 | 字牌;

export type 対子like = [牌, 牌];
export type 刻子like = [牌, 牌, 牌];
export type 槓子like = [牌, 牌, 牌, 牌];

export type 塔子like = [数牌, 数牌];
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
export type アガリ牌形 = {
  head: 雀頭like;
  body: [面子like, 面子like, 面子like, 面子like];
};
export type アガリ手牌 = アガリ牌形 | 七対子like | 国士無双;

export type FourMembers<T> = [T, T, T, T];

export type PlayerIndex = 0 | 1 | 2 | 3;

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

/**
 * 自分からみたindexに対応
 */
export enum PlayerDirection {
  ToTheRight = 1, // 下家
  Opposite = 2, // 対面
  ToTheLeft = 3, // 上家
}
