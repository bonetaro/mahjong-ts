export class Dice {
  private _num: number;
  private emojiList = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  get num(): number {
    if (!this._num) {
      throw new Error();
    }

    return this._num;
  }

  roll(): void {
    this._num = Math.floor(Math.random() * 6) + 1;
  }

  toEmoji(withChar = true): string {
    const str = this.emojiList[this.num - 1];

    if (withChar) {
      return str + ` (${this.num})`;
    }

    return str;
  }
}
