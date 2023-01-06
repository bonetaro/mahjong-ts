export class GameOption {
  private _cheat: boolean = false;

  get cheat(): boolean {
    return this._cheat;
  }

  set cheat(cheat: boolean) {
    this._cheat = cheat;
  }
}
