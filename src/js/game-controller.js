import * as domManager from './dom-manager.js';
import Gameboard from './gameboard.js';

function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default class GameController {
  #attacker;
  #receiver;
  #processing = false;
  #randomAttacks = null;

  constructor(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    if (playerOne.isComputer() || playerTwo.isComputer()) {
      this.generateComputerAttacks();
    }
  }

  generateComputerAttacks() {
    this.#randomAttacks = [];
    for (let x = 0; x <= Gameboard.MAX_X; x++) {
      for (let y = 0; y <= Gameboard.MAX_Y; y++) {
        this.#randomAttacks.push({ x: x, y: y });
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
    domManager.showWinningMessage(this.#attacker.name); // temporary functionality
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
    domManager.displayCoordinatesFeedback(coordinates);
  }

  #initializePlayerBox(player) {
    domManager.initializePlayerBox(
      player,
      this.#handleAttack.bind(this, player),
      this.#displayCoordinates.bind(this, player),
    );
  }

  startGame() {
    domManager.clearPlayersSection();
    this.#initializePlayerBox(this.playerOne);
    this.#initializePlayerBox(this.playerTwo);

    this.#attacker = this.playerOne;
    this.#receiver = this.playerTwo;
    this.#processing = false;

    domManager.setTarget(this.#receiver.getId());
    domManager.displayFeedbackMessage(`The battleship has started!`);
    domManager.displayCurrentTurnMessage(this.#attacker.name);
  }
}
