import { describe, test, expect, beforeEach } from '@jest/globals';
import Ship from '../src/js/ship.js';

describe('Ship', () => {
  const minLength = Ship.MIN_LENGTH;
  const maxLength = Ship.MAX_LENGTH;
  let ship;

  beforeEach(() => {
    ship = new Ship(maxLength);
  });

  test('should define a min and a max length', () => {
    expect(minLength).toBeDefined();
    expect(maxLength).toBeDefined();
  });

  test('should trow an Error when initialized with an out of range length', () => {
    expect(() => {
      new Ship(minLength - 1);
    }).toThrow(Error);
    expect(() => {
      new Ship(maxLength + 1);
    }).toThrow(Error);
  });

  describe('hit()', () => {
    test('should increase numberOfHits by 1', () => {
      const hitsBefore = ship.getNumberOfHits();
      ship.hit();
      expect(ship.getNumberOfHits()).toBe(hitsBefore + 1);
    });

    test('should throw an Error when ship is already sunk', () => {
      for (let i = 0; i < ship.getLength(); i++) ship.hit();
      expect(() => {
        ship.hit();
      }).toThrow(Error);
    });
  });

  describe('isSunk()', () => {
    test('should return false when numberOfHits is less than length', () => {
      for (let i = 0; i < ship.getLength() - 1; i++) {
        expect(ship.isSunk()).toBeFalsy();
        ship.hit();
      }
    });

    test('should return true when numberOfHits is equal to length', () => {
      for (let i = 0; i < ship.getLength(); i++) ship.hit();
      expect(ship.isSunk()).toBeTruthy();
    });
  });
});
