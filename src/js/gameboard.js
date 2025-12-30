function createSquare() {
  let ship = null;
  let attacked = false;

  const attack = () => {
    attacked = true;
  };
  const isAttacked = () => attacked;
  const hasShip = () => !!ship;
  const getShip = () => ship;
  const setShip = (ship_) => {
    ship = ship_;
  };

  return { setShip, getShip, hasShip, attack, isAttacked };
}

export default class Gameboard {
  static MAX_X = 9;
  static MAX_Y = 9;
  #board;
  #ships;

  constructor() {
    this.#initializeBoard();
    this.#ships = new Set();
  }

  #initializeBoard() {
    this.#board = Array(Gameboard.MAX_X);
    for (let x = 0; x <= Gameboard.MAX_X; x++) {
      this.#board[x] = Array(Gameboard.MAX_Y);
      for (let y = 0; y <= Gameboard.MAX_Y; y++) {
        this.#board[x][y] = createSquare();
      }
    }
  }

  areValidCoordinates(x, y) {
    return x >= 0 && x <= Gameboard.MAX_X && y >= 0 && y <= Gameboard.MAX_Y;
  }

  getBoard() {
    return this.#board;
  }

  placeShip(ship, coordinates) {
    const { x, y } = coordinates;

    if (!this.areValidCoordinates(x, y)) {
      throw Error('Attempt to place a ship at an invalid square');
    }

    if (this.#board[x][y].hasShip()) {
      throw Error('Attempt to place a ship at an already occupied square');
    }

    this.#board[x][y].setShip(ship);
    this.#ships.add(ship);
  }

  receiveAttack(coordinates) {
    const { x, y } = coordinates;

    if (!this.areValidCoordinates(x, y)) {
      throw Error('Attempt to attack an invalid square');
    }

    if (this.#board[x][y].isAttacked()) {
      throw Error('Attempt to attack a square that already has been attacked');
    }

    this.#board[x][y].attack();

    if (this.#board[x][y].hasShip()) {
      this.#board[x][y].getShip().hit();
    }
  }

  areAllShipsSunk() {
    let flag = true;
    this.#ships.keys().forEach((ship) => {
      if (!ship.isSunk()) flag = false;
    });
    return flag;
  }

  hasShipAt(coordinates) {
    const { x, y } = coordinates;
    if (!this.areValidCoordinates(x, y)) {
      throw Error('Attempt to access an invalid square');
    }
    return this.#board[x][y].hasShip();
  }

  isAttackedAt(coordinates) {
    const { x, y } = coordinates;
    if (!this.areValidCoordinates(x, y)) {
      throw Error('Attempt to access an invalid square');
    }
    return this.#board[x][y].isAttacked();
  }
}
