import Gameboard from './gameboard.js';

export default class Player {
  #id;
  #gameboard;

  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.#gameboard = new Gameboard();
    this.#id = crypto.randomUUID();
  }

  get type() {
    return this._type;
  }

  set type(type) {
    if (type !== 'real' && type !== 'computer') {
      throw Error("Player.type must be 'real' or 'computer'");
    }
    this._type = type;
  }

  isComputer() {
    return this.type === 'computer';
  }

  isReal() {
    return this.type === 'real';
  }

  getId() {
    return this.#id;
  }

  getBoard() {
    return this.#gameboard.getBoard();
  }

  getBoardDto() {
    return this.#gameboard.getBoardDto();
  }

  placeShip(ship, coordinates) {
    this.#gameboard.placeShip(ship, coordinates);
  }

  receiveAttack(coordinates) {
    this.#gameboard.receiveAttack(coordinates);
  }

  isAttackedAt(coordinates) {
    return this.#gameboard.isAttackedAt(coordinates);
  }

  hasShipAt(coordinates) {
    return this.#gameboard.hasShipAt(coordinates);
  }

  areAllShipsSunk() {
    return this.#gameboard.areAllShipsSunk();
  }
}
