type AnyString = string;
type OnlyHoge = "hoge";

const s1: AnyString = "any_string";
const s2: OnlyHoge = "hoge";
// const s2_1: OnlyHoge = "hogea";

type OnlyHogePrefixString = `hoge_${string}`;
const s3: OnlyHogePrefixString = "hoge_hoge";
const s4: OnlyHogePrefixString = "hoge_fuge";

type Fruit = "apple" | "orange" | "banana";
type Animal = "dog" | "cat";
// dog_apple, dog_orange, dog_banana, cat_apple, cat_orange, cat_banana
type AnimalPlusFruitType = `${Animal}_${Fruit}`;

type UnitSuffix = "px" | "em" | "rem" | "%" | "fr" | "";
type Unit<Suffix extends UnitSuffix> = `${number}${Suffix}`;
type FlexGrowValue = Unit<"">;
type PixelValue = Unit<"px">;
type EmValue = Unit<"em">;
type RemValue = Unit<"rem">;
type PercentValue = Unit<"%">;
type FractionValue = Unit<"fr">;

function hasSuffix<Suffix extends UnitSuffix>(
  value: string,
  suffix: Suffix
): value is `${number}${Suffix}` {
  return new RegExp(`[0-9]${suffix}\$`).test(value);
}

function toNum<T extends UnitSuffix>(expr: Unit<T>, _suffix: T): number | null {
  const n = Number(expr.replace(/(\d+)(px|rem|em|\%|fr|)$/, "$1"));

  if (Number.isNaN(n)) {
    return null;
  }

  return n;
}

const n = Math.random() > 0.5 ? ("150px" as const) : ("30%" as const);
if (hasSuffix(n, "px")) {
  const x: PixelValue = n;
  //   const y: PercentValue = n; // => 型エラー
}
