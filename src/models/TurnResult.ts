import * as Commands from "./Command";

export abstract class TurnResult {
  constructor(public command: Commands.BaseCommand) {}

  get playerWin(): boolean {
    return this.command instanceof Commands.TsumoCommand || this.command instanceof Commands.RonCommand;
  }
}

export class PlayerTurnResult extends TurnResult {
  constructor(command: Commands.PlayerCommand) {
    super(command);
  }
}

export class OtherPlayersTurnResult extends TurnResult {
  constructor(command: Commands.OtherPlayersCommand) {
    super(command);
  }
}
