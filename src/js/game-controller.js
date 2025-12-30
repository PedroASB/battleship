import * as domManager from './dom-manager.js';
import Ship from './ship.js';
import Gameboard from './gameboard.js';
import { delay, shuffleArray } from './utils.js';

export default class GameController {
  #attacker;
  #receiver;
  #processing = false;
  #randomAttacks = null;
  #fleetTemplate;
  #shipsQueue = [];
  #currentPlacementAxis = 'x';

  constructor(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    if (playerOne.isComputer() || playerTwo.isComputer()) {
      this.generateComputerAttacks();
    }

    this.#fleetTemplate = [
      { class: 'Carrier', length: 5 },
      { class: 'Battleship', length: 4 },
      { class: 'Cruiser', length: 3 },
      { class: 'Submarine', length: 3 },
      { class: 'Destroyer', length: 2 },
    ];
  }

  generateComputerAttacks() {
    this.#randomAttacks = [];
    for (let x = 0; x <= Gameboard.MAX_X; x++) {
      for (let y = 0; y <= Gameboard.MAX_Y; y++) {
        this.#randomAttacks.push({ x, y });
      }
    }
    shuffleArray(this.#randomAttacks);
  }

  #swapAttacker() {
    [this.#attacker, this.#receiver] = [this.#receiver, this.#attacker];
    domManager.unsetTarget(this.#attacker.getId());
    domManager.setTarget(this.#receiver.getId());
    domManager.displayCurrentTurnMessage(this.#attacker.name);
  }

  #checkWinning() {
    return this.playerOne.areAllShipsSunk() || this.playerTwo.areAllShipsSunk();
  }

  #handleWinning() {
    domManager.unsetTarget(this.#receiver.getId());
    domManager.showFleet(this.#attacker.getId());
    domManager.showFleet(this.#receiver.getId());
    domManager.clearCurrentTurnMessage();
    domManager.displayFeedbackMessage(`${this.#attacker.name} has won the battleship!`);
  }

  #handleComputerAttack() {
    const coordinates = this.#randomAttacks.pop();
    this.#handleAttack(this.#receiver, coordinates);
  }

  async #handleAttack(player, coordinates) {
    if (player !== this.#receiver || player.isAttackedAt(coordinates) || this.#processing) {
      return;
    }

    this.#processing = true;
    domManager.displayFeedbackMessage('Performing the attack...');
    player.receiveAttack(coordinates);
    await delay(1);

    domManager.receiveAttack(player.getId(), coordinates);
    domManager.displayAttackMessage(this.#attacker.name, this.#receiver.name, coordinates);

    if (this.#checkWinning()) {
      this.#handleWinning();
      return;
    }

    // if the player misses a shot, pass the turn to the other player
    if (!player.hasShipAt(coordinates)) {
      this.#swapAttacker();
    }

    this.#processing = false;

    // if the next attacker is the computer, call a function to calculate the attack
    if (this.#attacker.isComputer()) {
      this.#handleComputerAttack();
    }
  }

  #displayCoordinates(player, coordinates) {
    if (player !== this.#receiver) return;
    const friendlyCoordinates = domManager.getFriendlyCoordinates(coordinates);
    domManager.displayCoordinatesFeedback(friendlyCoordinates);
  }

  /**
   * Ship placement
   */

  #switchCurrentPlacementAxis() {
    this.#currentPlacementAxis = this.#currentPlacementAxis === 'x' ? 'y' : 'x';
  }

  #getShipToBePlacedLength() {
    return this.#shipsQueue.length > 0 ? this.#shipsQueue.at(0).getLength() : null;
  }

  #getShipToBePlacedClass() {
    return this.#shipsQueue.length > 0 ? this.#shipsQueue.at(0).getClass() : null;
  }

  #displayCurrentShipToPlace(player) {
    if (this.#shipsQueue.length > 0) {
      domManager.displayFeedbackMessage(
        `${player.name}, prepare your fleet! Current ship to place: ${this.#getShipToBePlacedClass()}. Use Shift to switch between X and Y axises.`,
      );
    }
  }

  #generateCoordinatesArray(coordinates) {
    const coordinatesArray = [];
    if (this.#currentPlacementAxis === 'x') {
      for (let i = 0; i < this.#getShipToBePlacedLength(); i++) {
        coordinatesArray.push({ x: coordinates.x + i, y: coordinates.y });
      }
    } else if (this.#currentPlacementAxis === 'y') {
      for (let i = 0; i < this.#getShipToBePlacedLength(); i++) {
        coordinatesArray.push({ x: coordinates.x, y: coordinates.y + i });
      }
    }
    return coordinatesArray;
  }

  #isAllowedShipPlacement(player, coordinatesArray) {
    let isAllowed = true;
    const areValidCoordinates = new Gameboard().areValidCoordinates; // TODO: areValidCoordinates should be a static method of Gameboard

    coordinatesArray.forEach((coordinates) => {
      if (!areValidCoordinates(coordinates.x, coordinates.y) || player.hasShipAt(coordinates))
        isAllowed = false;
    });

    return isAllowed;
  }

  #shipPlacementHover(player, coordinates) {
    const coordinatesArray = this.#generateCoordinatesArray(coordinates);
    const isAllowed = this.#isAllowedShipPlacement(player, coordinatesArray);
    domManager.highlightShipPlacement(player.getId(), coordinatesArray, isAllowed);
  }

  #shipPlacementConfirm(player, coordinates) {
    if (this.#shipsQueue.length === 0) {
      return;
    }

    const coordinatesArray = this.#generateCoordinatesArray(coordinates);
    const isAllowed = this.#isAllowedShipPlacement(player, coordinatesArray);
    if (!isAllowed) return;

    const ship = this.#shipsQueue.shift();

    coordinatesArray.forEach((coordinates) => {
      player.placeShip(ship, coordinates);
      domManager.placeShipAtSquare(player.getId(), coordinates);
    });

    this.#displayCurrentShipToPlace(player);
  }

  beginShipPlacement(player) {
    this.#currentPlacementAxis = 'x';
    this.#shipsQueue = [];

    this.#fleetTemplate.forEach((shipTemplate) => {
      const ship = new Ship(shipTemplate.length, shipTemplate.class);
      this.#shipsQueue.push(ship);
    });

    this.#setBoardToPlaceShips(player);
    this.#displayCurrentShipToPlace(player);
  }

  /**
   * Board settings
   */

  #setBoardToPlaceShips(player) {
    domManager.updateBoardPlaceShips(player, {
      squareHoverCallback: this.#shipPlacementHover.bind(this),
      squareClickCallback: this.#shipPlacementConfirm.bind(this),
      shiftKeyDownCallback: () => {
        this.#switchCurrentPlacementAxis();
        this.#shipPlacementHover(player, { x: 0, y: 0 }); // TODO: keep at the same position after switching axis
      },
    });
  }

  #setBoardToPlay(player) {
    domManager.updateBoardPlay(player, {
      squareHoverCallback: this.#displayCoordinates.bind(this, player),
      squareClickCallback: this.#handleAttack.bind(this, player),
    });
  }

  /**
   * Confirm fleet button handler
   */

  confirmFleet() {
    if (this.#shipsQueue.length > 1) {
      alert(`There are ${this.#shipsQueue.length} remaining ships to place.`);
      return false;
    }
    if (this.#shipsQueue.length === 1) {
      alert(`There is 1 remaining ship to place.`);
      return false;
    }

    return true;
  }

  /**
   * Start game
   */

  startBattle() {
    this.#attacker = this.playerOne;
    this.#receiver = this.playerTwo;

    this.#setBoardToPlay(this.playerOne);
    this.#setBoardToPlay(this.playerTwo);

    domManager.setTarget(this.#receiver.getId());
    domManager.displayFeedbackMessage(`The battleship has started!`);
    domManager.displayCurrentTurnMessage(this.#attacker.name);
    domManager.showNewGameSection();
  }
}
