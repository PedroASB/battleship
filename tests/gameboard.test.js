import { describe, test, expect, beforeEach } from '@jest/globals';
import Gameboard from '../src/js/gameboard.js';
import Ship from '../src/js/ship.js';

describe('Gameboard', () => {
  const maxX = Gameboard.MAX_X;
  const maxY = Gameboard.MAX_Y;
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('should define max x and max y coordinates', () => {
    expect(maxX).toBeDefined();
    expect(maxY).toBeDefined();
  });

  describe('placeShip()', () => {
    let ship;

    beforeEach(() => {
      ship = new Ship(1);
    });

    test('should throw an Error if any coordinate is negative', () => {
      expect(() => {
        gameboard.placeShip(ship, { x: -1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.placeShip(ship, { x: 0, y: -1 });
      }).toThrow(Error);
    });

    test('should throw an Error if any coordinate higher than the maximum', () => {
      expect(() => {
        gameboard.placeShip(ship, { x: maxX + 1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.placeShip(ship, { x: 0, y: maxY + 1 });
      }).toThrow(Error);
    });

    test('should throw an Error if a square is already occupied', () => {
      const ship2 = new Ship(1);
      gameboard.placeShip(ship, { x: 2, y: 3 });

      expect(() => {
        gameboard.placeShip(ship2, { x: 2, y: 3 });
      }).toThrow(Error);
    });
  });

  describe('receiveAttack()', () => {
    test('should throw an Error if any coordinate is negative', () => {
      expect(() => {
        gameboard.receiveAttack({ x: -1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.receiveAttack({ x: 0, y: -1 });
      }).toThrow(Error);
    });

    test('should throw an Error if any coordinate is higher than the maximum', () => {
      expect(() => {
        gameboard.receiveAttack({ x: maxX + 1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.receiveAttack({ x: 0, y: maxX + 1 });
      }).toThrow(Error);
    });

    test('should throw an Error if the square has already been attacked', () => {
      gameboard.receiveAttack({ x: 2, y: 3 });

      expect(() => {
        gameboard.receiveAttack({ x: 2, y: 3 });
      }).toThrow(Error);
    });

    test('should mark a square as attacked after an attack', () => {
      const board = gameboard.getBoard();
      const [x, y] = [2, 3];

      expect(board[x][y].isAttacked()).toBeFalsy();
      gameboard.receiveAttack({ x, y });
      expect(board[x][y].isAttacked()).toBeTruthy();
    });

    test('should send the hit function to the correct ship after a successful attack', () => {
      const ship = new Ship(1);
      const board = gameboard.getBoard();
      const [x, y] = [2, 3];

      gameboard.placeShip(ship, { x, y });
      const hitsBefore = board[x][y].getShip().getNumberOfHits();

      gameboard.receiveAttack({ x, y });

      expect(board[x][y].getShip().getNumberOfHits()).toBe(hitsBefore + 1);
    });
  });

  describe('areAllShipsSunk()', () => {
    let ship1, ship2, ship3;
    const coordinatesShip1 = { x: 2, y: 3 };
    const coordinatesShip2 = [
      { x: 3, y: 4 },
      { x: 3, y: 5 },
    ];
    const coordinatesShip3 = [
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
    ];

    beforeEach(() => {
      ship1 = new Ship(1);
      gameboard.placeShip(ship1, coordinatesShip1);

      ship2 = new Ship(2);
      coordinatesShip2.forEach((coordinate) => {
        gameboard.placeShip(ship2, coordinate);
      });

      ship3 = new Ship(3);
      coordinatesShip3.forEach((coordinate) => {
        gameboard.placeShip(ship3, coordinate);
      });
    });

    test('should return false when there is at least one not sunk ship', () => {
      expect(gameboard.areAllShipsSunk()).toBeFalsy();

      gameboard.receiveAttack(coordinatesShip1);

      coordinatesShip2.forEach((coordinate) => {
        gameboard.receiveAttack(coordinate);
      });

      gameboard.receiveAttack(coordinatesShip3[0]);
      gameboard.receiveAttack(coordinatesShip3[1]);

      expect(gameboard.areAllShipsSunk()).toBeFalsy();
    });

    test('should return true when all ships are sunk', () => {
      gameboard.receiveAttack(coordinatesShip1);

      coordinatesShip2.forEach((coordinate) => {
        gameboard.receiveAttack(coordinate);
      });

      coordinatesShip3.forEach((coordinate) => {
        gameboard.receiveAttack(coordinate);
      });

      expect(gameboard.areAllShipsSunk()).toBeTruthy();
    });
  });

  describe('hasShipAt()', () => {
    let ship;

    beforeEach(() => {
      ship = new Ship(1);
    });

    test('should throw an Error if any coordinate is invalid', () => {
      expect(() => {
        gameboard.hasShipAt({ x: -1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.hasShipAt({ x: 0, y: -1 });
      }).toThrow(Error);

      expect(() => {
        gameboard.hasShipAt({ x: maxX + 1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.hasShipAt({ x: 0, y: maxY + 1 });
      }).toThrow(Error);
    });

    test('should return false if that position does not have a ship', () => {
      const [x, y] = [2, 3];
      expect(gameboard.hasShipAt({ x, y })).toBeFalsy();
    });

    test('should return true if that position has a ship', () => {
      const [x, y] = [2, 3];
      gameboard.placeShip(ship, { x, y });
      expect(gameboard.hasShipAt({ x, y })).toBeTruthy();
    });
  });

  describe('isAttackedAt()', () => {
    test('should throw an Error if any coordinate is invalid', () => {
      expect(() => {
        gameboard.isAttackedAt({ x: -1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.isAttackedAt({ x: 0, y: -1 });
      }).toThrow(Error);

      expect(() => {
        gameboard.isAttackedAt({ x: maxX + 1, y: 0 });
      }).toThrow(Error);

      expect(() => {
        gameboard.isAttackedAt({ x: 0, y: maxY + 1 });
      }).toThrow(Error);
    });

    test('should return false if that position has not been attacked', () => {
      const [x, y] = [2, 3];
      expect(gameboard.isAttackedAt({ x, y })).toBeFalsy();
    });

    test('should return true if that position has been attacked', () => {
      const [x, y] = [2, 3];
      gameboard.receiveAttack({ x, y });
      expect(gameboard.isAttackedAt({ x, y })).toBeTruthy();
    });
  });
});
