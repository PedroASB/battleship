import { describe, test, expect } from '@jest/globals';
import Ship from '../src/js/ship.js';

describe('Ship', () => {
  const minLength = Ship.MIN_LENGTH;
  const maxLength = Ship.MAX_LENGTH;

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

  test('hit() should increase numberOfHits by 1', () => {
    const ship = new Ship(maxLength);
    const lengthBefore = ship.getNumberOfHits();
    ship.hit();
    expect(ship.getNumberOfHits()).toBe(lengthBefore + 1);
  });

  test('hit() should throw an Error when ship is already sunk', () => {
    const ship = new Ship(maxLength);
    for (let i = 0; i < ship.getLength(); i++) ship.hit();
    expect(() => {
      ship.hit();
    }).toThrow(Error);
  });

  test('isSunk() should return false when numberOfHits is less than length', () => {
    const ship = new Ship(maxLength);
    for (let i = 0; i < ship.getLength() - 1; i++) {
      expect(ship.isSunk()).toBeFalsy();
      ship.hit();
    }
  });

  test('isSunk() should return true when numberOfHits is equal to length', () => {
    const ship = new Ship(maxLength);
    for (let i = 0; i < ship.getLength(); i++) ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});
