import './css/reset.css';
import './css/style.css';
import * as domManager from './js/dom-manager.js';
import GameController from './js/game-controller.js';
import Player from './js/player.js';

const playVsComputerButton = domManager.getPlayVsComputerButton();
const playVsFriendButton = domManager.getPlayVsFriendButton();
const rematchButton = domManager.getRematchButton();
const newGameButton = domManager.getNewGameButton();
let gameController = null;
let playerOne = null;
let playerTwo = null;

domManager.displayInitialPage();

function startPlayerVsComputer() {
  const player = new Player('Player', 'real');
  const computer = new Player('Computer', 'computer');
  playerOne = player;
  playerTwo = computer;

  gameController = new GameController(player, computer);

  domManager.clearPlayersSection();
  domManager.addPlayerBox(player.name, player.getId());
  domManager.displayGameplayPage();

  gameController.generateRandomFleet(computer);
  gameController.beginShipPlacement(player);

  domManager.addConfirmFleetButton(player.getId(), () => {
    const readyFleet = gameController.confirmFleet();
    if (readyFleet) {
      domManager.removeConfirmFleetButton(player.getId());
      domManager.addCoordinatesInfoBox();
      domManager.addPlayerBox(computer.name, computer.getId());
      domManager.hideFleet(computer.getId());
      gameController.startBattle();
    }
  });
}

function startPlayerVsPlayer(playerOneName, playerTwoName) {
  if (!playerOneName || !playerTwoName) {
    const { playerOneName, playerTwoName } = domManager.getTwoPlayersNames();
    playerOne = new Player(playerOneName, 'real');
    playerTwo = new Player(playerTwoName, 'real');
  } else {
    playerOne = new Player(playerOneName, 'real');
    playerTwo = new Player(playerTwoName, 'real');
  }

  gameController = new GameController(playerOne, playerTwo);

  domManager.clearPlayersSection();
  domManager.addPlayerBox(playerOne.name, playerOne.getId());
  domManager.displayGameplayPage();

  // START
  function startGame() {
    domManager.removePlayerBox(playerTwo.getId());
    domManager.addPlayerBox(playerOne.name, playerOne.getId());
    domManager.addCoordinatesInfoBox();
    domManager.addPlayerBox(playerTwo.name, playerTwo.getId());

    domManager.hideFleet(playerOne.getId());
    domManager.hideFleet(playerTwo.getId());
    gameController.startBattle();
  }

  // PLAYER TWO
  function beginNextShipPlacement() {
    domManager.removePlayerBox(playerOne.getId());
    domManager.addPlayerBox(playerTwo.name, playerTwo.getId());
    gameController.beginShipPlacement(playerTwo);

    domManager.addConfirmFleetButton(playerTwo.getId(), () => {
      const readyFleet = gameController.confirmFleet();
      if (readyFleet) {
        startGame();
      }
    });
  }

  // PLAYER ONE
  gameController.beginShipPlacement(playerOne);

  domManager.addConfirmFleetButton(playerOne.getId(), () => {
    const readyFleet = gameController.confirmFleet();
    if (readyFleet) {
      beginNextShipPlacement();
    }
  });
}

playVsComputerButton.addEventListener('click', () => {
  startPlayerVsComputer();
});

playVsFriendButton.addEventListener('click', () => {
  startPlayerVsPlayer();
});

rematchButton.addEventListener('click', () => {
  if (confirm('Do you want to do a rematch?')) {
    domManager.hideNewGameSection();
    domManager.clearCurrentTurnMessage();
    if (playerOne.isComputer() || playerTwo.isComputer()) startPlayerVsComputer();
    else startPlayerVsPlayer(playerOne.name, playerTwo.name);
  }
});

newGameButton.addEventListener('click', () => {
  if (confirm('Do you want to start a new game?')) {
    domManager.displayInitialPage();
    domManager.hideNewGameSection();
    domManager.clearCurrentTurnMessage();
  }
});
