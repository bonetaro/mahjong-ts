import { v4 as uuid } from "uuid";

export class Player {
  constructor(public readonly name: string, public readonly id?: string) {
    this.id = uuid();
  }
}
