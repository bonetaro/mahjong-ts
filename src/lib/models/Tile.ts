import { 牌 } from "../Types";

abstract class Tile {
  constructor(public readonly tile: 牌) {}
}

export class DrawTile extends Tile {
  constructor(tile: 牌, public readonly kingsTile = false) {
    super(tile);
  }
}

export class DiscardTile extends Tile {
  constructor(tile: 牌, public meld = false, public reach = false) {
    super(tile);
  }
}
