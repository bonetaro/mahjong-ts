export class GameOption {
  private _cheat: boolean = false;
  private _debug: boolean = false;

  get cheat(): boolean {
    return this._cheat;
  }

  set cheat(cheat: boolean) {
    this._cheat = cheat;
  }

  get debug(): boolean {
    return this._debug;
  }

  set debug(debug: boolean) {
    this._debug = debug;
  }
}
