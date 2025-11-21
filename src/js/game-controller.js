import * as domManager from './dom-manager.js';

function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export default class GameController {
  #attacker;
  #receiver;

  constructor(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
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

  async #handleAttack(player, coordinates) {
    if (player !== this.#receiver || player.isAttackedAt(coordinates)) {
      return;
    }

    domManager.displayFeedbackMessage('Performing the attack...');
    domManager.clearCurrentTurnMessage();
    await delay(0.25);

    player.receiveAttack(coordinates);
    domManager.receiveAttack(player.getId(), coordinates);
    domManager.displayAttackMessage(this.#attacker.name, this.#receiver.name, coordinates);

    if (this.#checkWinning()) {
      this.#handleWinning();
      return;
    }

    this.#swapAttacker();
  }

  #displayCoordinates(player, coordinates) {
    if (player !== this.#receiver) {
      return;
    }
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

    domManager.setTarget(this.#receiver.getId());
    domManager.displayFeedbackMessage(`The battleship has started!`);
    domManager.displayCurrentTurnMessage(this.#attacker.name);
  }
}
