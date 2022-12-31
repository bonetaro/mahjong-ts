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
