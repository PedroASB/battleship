import './css/reset.css';
import './css/style.css';
import * as domManager from './js/dom-manager.js';
import GameController from './js/game-controller.js';
import Player from './js/player.js';
import Ship from './js/ship.js';

// Temporary function to create sample ships (variation 1)
function placeSampleShips1(player) {
  const carrier = new Ship(5, 'Carrier');
  const carrierCoordinates = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 1, y: 3 },
    { x: 1, y: 4 },
  ];
  const battleship = new Ship(4, 'Battleship');
  const battleshipCoordinates = [
    { x: 2, y: 8 },
    { x: 3, y: 8 },
    { x: 4, y: 8 },
    { x: 5, y: 8 },
  ];
  const cruiser = new Ship(3, 'Cruiser');
  const cruiserCoordinates = [
    { x: 5, y: 5 },
    { x: 6, y: 5 },
    { x: 7, y: 5 },
  ];
  const submarine = new Ship(3, 'Submarine');
  const submarineCoordinates = [
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 8, y: 2 },
  ];
  const destroyer = new Ship(2, 'Destroyer');
  const destroyerCoordinates = [
    { x: 3, y: 5 },
    { x: 3, y: 6 },
  ];

  carrierCoordinates.forEach((coordinate) => {
    player.placeShip(carrier, coordinate);
  });
  battleshipCoordinates.forEach((coordinate) => {
    player.placeShip(battleship, coordinate);
  });
  cruiserCoordinates.forEach((coordinate) => {
    player.placeShip(cruiser, coordinate);
  });
  submarineCoordinates.forEach((coordinate) => {
    player.placeShip(submarine, coordinate);
  });
  destroyerCoordinates.forEach((coordinate) => {
    player.placeShip(destroyer, coordinate);
  });
}

// Temporary function to create sample ships (variation 2)
function placeSampleShips2(player) {
  const carrier = new Ship(5, 'Carrier');
  const carrierCoordinates = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
  ];
  const battleship = new Ship(4, 'Battleship');
  const battleshipCoordinates = [
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
  ];
  const cruiser = new Ship(3, 'Cruiser');
  const cruiserCoordinates = [
    { x: 5, y: 5 },
    { x: 6, y: 5 },
    { x: 7, y: 5 },
  ];
  const submarine = new Ship(3, 'Submarine');
  const submarineCoordinates = [
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
  ];
  const destroyer = new Ship(2, 'Destroyer');
  const destroyerCoordinates = [
    { x: 9, y: 3 },
    { x: 9, y: 4 },
  ];

  carrierCoordinates.forEach((coordinate) => {
    player.placeShip(carrier, coordinate);
  });
  battleshipCoordinates.forEach((coordinate) => {
    player.placeShip(battleship, coordinate);
  });
  cruiserCoordinates.forEach((coordinate) => {
    player.placeShip(cruiser, coordinate);
  });
  submarineCoordinates.forEach((coordinate) => {
    player.placeShip(submarine, coordinate);
  });
  destroyerCoordinates.forEach((coordinate) => {
    player.placeShip(destroyer, coordinate);
  });
}

// Program begin
const playVsComputerButton = domManager.getPlayVsComputerButton();
const getPlayVsFriendButton = domManager.getPlayVsFriendButton();
domManager.displayInitialPage();

playVsComputerButton.addEventListener('click', () => {
  const player = new Player('Player', 'real');
  const computer = new Player('Computer', 'computer');

  placeSampleShips2(computer);

  const gameController = new GameController(player, computer);

  domManager.clearPlayersSection();
  domManager.addPlayerBox(player);
  domManager.displayGameplayPage();

  gameController.beginShipPlacement(player);

  domManager.addConfirmFleetButton(player.getId(), () => {
    const readyFleet = gameController.confirmFleet();
    if (readyFleet) {
      domManager.removeConfirmFleetButton(player.getId());
      domManager.addPlayerBox(computer);
      domManager.hideFleet(computer.getId());
      gameController.startBattle();
    }
  });
});

getPlayVsFriendButton.addEventListener('click', () => {
  const { playerOneName, playerTwoName } = domManager.getTwoPlayersNames();

  const playerOne = new Player(playerOneName, 'real');
  const playerTwo = new Player(playerTwoName, 'real');

  const gameController = new GameController(playerOne, playerTwo);

  domManager.clearPlayersSection();
  domManager.addPlayerBox(playerOne);
  domManager.displayGameplayPage();

  // START
  function start() {
    domManager.removePlayerBox(playerTwo.getId());
    domManager.addPlayerBox(playerOne);
    domManager.addPlayerBox(playerTwo);
    // domManager.removeConfirmFleetButton(playerTwo.getId());

    domManager.hideFleet(playerOne.getId());
    domManager.hideFleet(playerTwo.getId());
    gameController.startBattle();
  }

  // PLAYER ONE
  gameController.beginShipPlacement(playerOne);

  domManager.addConfirmFleetButton(playerOne.getId(), () => {
    const readyFleet = gameController.confirmFleet();
    if (readyFleet) {
      next();
    }
  });

  // PLAYER TWO
  function next() {
    domManager.removePlayerBox(playerOne.getId());
    // domManager.removeConfirmFleetButton(playerOne.getId());
    domManager.addPlayerBox(playerTwo);
    gameController.beginShipPlacement(playerTwo);

    domManager.addConfirmFleetButton(playerTwo.getId(), () => {
      const readyFleet = gameController.confirmFleet();
      if (readyFleet) {
        start();
      }
    });
  }
});
