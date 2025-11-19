import Gameboard from './gameboard.js';

export default class Player {
  #id;
  #gameboard;

  constructor(name) {
    this.name = name;
    this.#gameboard = new Gameboard();
    this.#id = crypto.randomUUID();
  }

  getId() {
    return this.#id;
  }

  getBoard() {
    return this.#gameboard.getBoard();
  }

  placeShip(ship, coordinates) {
    this.#gameboard.placeShip(ship, coordinates);
  }

  receiveAttack(coordinates) {
    this.#gameboard.receiveAttack(coordinates);
  }

  isAttackedAt(coordinates) {
    const { x, y } = coordinates;
    return this.#gameboard.getBoard()[x][y].isAttacked();
  }

  areAllShipsSunk() {
    return this.#gameboard.areAllShipsSunk();
  }
}
