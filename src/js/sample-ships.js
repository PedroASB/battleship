import Ship from './ship.js';

// Temporary function to create sample ships (variation 1)
export function placeSampleShips1(player) {
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
export function placeSampleShips2(player) {
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
