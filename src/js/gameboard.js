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
    for (let i = 0; i <= Gameboard.MAX_X; i++) {
      this.#board[i] = Array(Gameboard.MAX_Y);
      for (let j = 0; j <= Gameboard.MAX_Y; j++) {
        this.#board[i][j] = createSquare();
      }
    }
  }

  #isValidCoordinate(x, y) {
    return x >= 0 && x <= Gameboard.MAX_X && y >= 0 && y <= Gameboard.MAX_Y;
  }

  getBoard() {
    return this.#board;
  }

  placeShip(ship, coordinates) {
    const { x, y } = coordinates;

    if (!this.#isValidCoordinate(x, y)) {
      throw Error('Attempt to place a ship in an invalid coordinate');
    }

    if (this.#board[x][y].hasShip()) {
      throw Error('Attempt to place a ship in an already occupied square');
    }

    this.#board[x][y].setShip(ship);
    this.#ships.add(ship);
  }

  receiveAttack(coordinates) {
    const { x, y } = coordinates;

    if (!this.#isValidCoordinate(x, y)) {
      throw Error('Attempt to attack an invalid coordinate');
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
    if (!this.#isValidCoordinate(x, y)) {
      throw Error('Attempt to access an invalid coordinate');
    }
    return this.#board[x][y].hasShip();
  }

  isAttackedAt(coordinates) {
    const { x, y } = coordinates;
    if (!this.#isValidCoordinate(x, y)) {
      throw Error('Attempt to access an invalid coordinate');
    }
    return this.#board[x][y].isAttacked();
  }
}
