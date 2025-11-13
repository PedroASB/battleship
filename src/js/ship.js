export default class Ship {
  static MIN_LENGTH = 1;
  static MAX_LENGTH = 5;
  #length;
  #shipClass;
  #numberOfHits;

  constructor(length, shipClass = null) {
    if (length < Ship.MIN_LENGTH || length > Ship.MAX_LENGTH) {
      throw Error(
        `Failed to create a ship: length must be in [${Ship.MIN_LENGTH}, ${Ship.MAX_LENGTH}]`,
      );
    }
    this.#length = length;
    this.#shipClass = shipClass;
    this.#numberOfHits = 0;
  }

  getLength() {
    return this.#length;
  }

  getClass() {
    return this.#shipClass;
  }

  getNumberOfHits() {
    return this.#numberOfHits;
  }

  isSunk() {
    return this.#numberOfHits === this.#length;
  }

  hit() {
    if (this.isSunk()) {
      throw Error('Attempt to hit a ship that is already sunk');
    }
    this.#numberOfHits++;
  }
}
