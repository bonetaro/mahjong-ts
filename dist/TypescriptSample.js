const s1 = "any_string";
const s2 = "hoge";
const s3 = "hoge_hoge";
const s4 = "hoge_fuge";
function hasSuffix(value, suffix) {
    return new RegExp(`[0-9]${suffix}\$`).test(value);
}
function toNum(expr, _suffix) {
    const n = Number(expr.replace(/(\d+)(px|rem|em|\%|fr|)$/, "$1"));
    if (Number.isNaN(n)) {
        return null;
    }
    return n;
}
const n = Math.random() > 0.5 ? "150px" : "30%";
if (hasSuffix(n, "px")) {
    const x = n;
    //   const y: PercentValue = n; // => 型エラー
}
//# sourceMappingURL=TypescriptSample.js.map