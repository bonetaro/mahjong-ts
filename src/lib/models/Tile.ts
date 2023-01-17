import { 牌 } from "../Types";

export class Tile {
  constructor(public readonly tile: 牌, public readonly kingsTile = false) {}
}
