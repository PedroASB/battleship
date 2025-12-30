import Ship from './ship.js';

// Temporary function to create sample ships (variation 1)
export function placeSampleShips1(player) {
  const carrier = new Ship(5, 'Carrier');
  const carrierCoordinatesArray = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 1, y: 3 },
    { x: 1, y: 4 },
  ];
  const battleship = new Ship(4, 'Battleship');
  const battleshipCoordinatesArray = [
    { x: 2, y: 8 },
    { x: 3, y: 8 },
    { x: 4, y: 8 },
    { x: 5, y: 8 },
  ];
  const cruiser = new Ship(3, 'Cruiser');
  const cruiserCoordinatesArray = [
    { x: 5, y: 5 },
    { x: 6, y: 5 },
    { x: 7, y: 5 },
  ];
  const submarine = new Ship(3, 'Submarine');
  const submarineCoordinatesArray = [
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 8, y: 2 },
  ];
  const destroyer = new Ship(2, 'Destroyer');
  const destroyerCoordinatesArray = [
    { x: 3, y: 5 },
    { x: 3, y: 6 },
  ];

  carrierCoordinatesArray.forEach((coordinates) => {
    player.placeShip(carrier, coordinates);
  });
  battleshipCoordinatesArray.forEach((coordinates) => {
    player.placeShip(battleship, coordinates);
  });
  cruiserCoordinatesArray.forEach((coordinates) => {
    player.placeShip(cruiser, coordinates);
  });
  submarineCoordinatesArray.forEach((coordinates) => {
    player.placeShip(submarine, coordinates);
  });
  destroyerCoordinatesArray.forEach((coordinates) => {
    player.placeShip(destroyer, coordinates);
  });
}

// Temporary function to create sample ships (variation 2)
export function placeSampleShips2(player) {
  const carrier = new Ship(5, 'Carrier');
  const carrierCoordinatesArray = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
  ];
  const battleship = new Ship(4, 'Battleship');
  const battleshipCoordinatesArray = [
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
  ];
  const cruiser = new Ship(3, 'Cruiser');
  const cruiserCoordinatesArray = [
    { x: 5, y: 5 },
    { x: 6, y: 5 },
    { x: 7, y: 5 },
  ];
  const submarine = new Ship(3, 'Submarine');
  const submarineCoordinatesArray = [
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
  ];
  const destroyer = new Ship(2, 'Destroyer');
  const destroyerCoordinatesArray = [
    { x: 9, y: 3 },
    { x: 9, y: 4 },
  ];

  carrierCoordinatesArray.forEach((coordinates) => {
    player.placeShip(carrier, coordinates);
  });
  battleshipCoordinatesArray.forEach((coordinates) => {
    player.placeShip(battleship, coordinates);
  });
  cruiserCoordinatesArray.forEach((coordinates) => {
    player.placeShip(cruiser, coordinates);
  });
  submarineCoordinatesArray.forEach((coordinates) => {
    player.placeShip(submarine, coordinates);
  });
  destroyerCoordinatesArray.forEach((coordinates) => {
    player.placeShip(destroyer, coordinates);
  });
}
