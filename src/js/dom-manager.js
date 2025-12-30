function displayPage(id) {
  const pages = Array.from(document.querySelectorAll('.page'));
  pages.forEach((page) => {
    if (page.id === id) page.setAttribute('hidden', 'false');
    else page.setAttribute('hidden', 'true');
  });
}

// keeps track of the current shift key down handler function
let shiftKeyDownHandler = null;

function removeShiftKeyDownListener() {
  if (shiftKeyDownHandler) document.removeEventListener('keydown', shiftKeyDownHandler);
  shiftKeyDownHandler = null;
}

function setShiftKeyDownListener(shiftKeyDownCallback) {
  removeShiftKeyDownListener();

  shiftKeyDownHandler = function (event) {
    if (event.key === 'Shift') shiftKeyDownCallback();
  };

  document.addEventListener('keydown', shiftKeyDownHandler);
}

/**
 * Initial page
 */
export function displayInitialPage() {
  displayPage('initial-page');
}

export function getPlayVsComputerButton() {
  return document.querySelector('#play-vs-computer-btn');
}

export function getPlayVsFriendButton() {
  return document.querySelector('#play-vs-friend-btn');
}

export function getTwoPlayersNames() {
  const form = document.getElementById('players-form');
  const formData = new FormData(form);

  const playerOneName = formData.get('player-one-name') || 'Player 1';
  const playerTwoName = formData.get('player-two-name') || 'Player 2';

  form.reset();
  return { playerOneName, playerTwoName };
}

/**
 * Gameplay page
 */
export function getRematchButton() {
  return document.getElementById('rematch-btn');
}

export function getNewGameButton() {
  return document.getElementById('new-game-btn');
}

export function displayGameplayPage() {
  displayPage('gameplay-page');
}

export function updateBoardPlay(player, { squareClickCallback, squareHoverCallback }) {
  const boardDiv = document.getElementById(player.getId()).querySelector('.board');
  boardDiv.classList.remove('on-ship-placement');
  boardDiv.classList.add('on-play');
  boardDiv.innerHTML = '';

  let x, y;

  x = 0;
  player.getBoard().forEach((row) => {
    y = 0;
    row.forEach((square) => {
      const squareDiv = document.createElement('div');

      squareDiv.classList.add('square');
      squareDiv.setAttribute('attacked', square.isAttacked());
      squareDiv.setAttribute('ship', square.hasShip());
      squareDiv.dataset.position = `${x},${y}`;
      squareDiv.innerHTML = `<div class="attack-mark"></div>`;

      const coordinates = { x, y };

      squareDiv.addEventListener('click', () => {
        if (squareClickCallback) squareClickCallback(coordinates);
      });

      squareDiv.addEventListener('mouseenter', () => {
        const friendlyCoordinates = getFriendlyCoordinates(coordinates);
        squareDiv.title = `${friendlyCoordinates.x} ${friendlyCoordinates.y}`;
        if (squareHoverCallback) squareHoverCallback(coordinates);
      });

      squareDiv.addEventListener('mouseleave', clearCoordinatesFeedback);

      boardDiv.appendChild(squareDiv);
      y++;
    });
    x++;
  });

  removeShiftKeyDownListener();
}

export function addPlayerBox(player) {
  const playersSection = document.querySelector('#players-section');
  const playerBoxTemplate = document.querySelector('#player-box-template');
  const playerBox = playerBoxTemplate.content.cloneNode(true).querySelector('.player-box');

  playerBox.id = player.getId();
  playerBox.querySelector('.name').textContent = player.name;
  playersSection.appendChild(playerBox);
}

export function removePlayerBox(playerId) {
  const playerBox = document.getElementById(playerId);
  playerBox.remove();
}

export function clearPlayersSection() {
  const playersSection = document.querySelector('#players-section');
  playersSection.innerHTML = '';
}

export function showNewGameSection() {
  const newGameSection = document.getElementById('new-game-section');
  newGameSection.setAttribute('hidden', 'false');
}

export function hideNewGameSection() {
  const newGameSection = document.getElementById('new-game-section');
  newGameSection.setAttribute('hidden', 'true');
}

export function updateBoardPlaceShips(
  player,
  { squareClickCallback, squareHoverCallback, shiftKeyDownCallback },
) {
  const boardDiv = document.getElementById(player.getId()).querySelector('.board');
  boardDiv.classList.remove('on-play');
  boardDiv.classList.add('on-ship-placement');
  boardDiv.innerHTML = '';

  let x, y;

  x = 0;
  player.getBoard().forEach((row) => {
    y = 0;
    row.forEach((square) => {
      const squareDiv = document.createElement('div');

      squareDiv.classList.add('square');
      squareDiv.setAttribute('attacked', square.isAttacked());
      squareDiv.setAttribute('ship', square.hasShip());
      squareDiv.dataset.position = `${x},${y}`;
      squareDiv.innerHTML = `<div class="attack-mark"></div>`;

      const coordinates = { x, y };

      squareDiv.addEventListener('click', () => {
        if (squareClickCallback) squareClickCallback(player, coordinates);
      });

      squareDiv.addEventListener('mouseenter', () => {
        const friendlyCoordinates = getFriendlyCoordinates(coordinates);
        squareDiv.title = `${friendlyCoordinates.x} ${friendlyCoordinates.y}`;
        if (squareHoverCallback) squareHoverCallback(player, coordinates);
      });

      squareDiv.addEventListener('mouseleave', clearCoordinatesFeedback);

      boardDiv.appendChild(squareDiv);
      y++;
    });
    x++;
  });

  setShiftKeyDownListener(shiftKeyDownCallback);
}

export function placeShipAtSquare(playerId, coordinates) {
  const boardDiv = document.getElementById(playerId).querySelector('.board');
  const square = boardDiv.querySelector(
    `.square[data-position="${coordinates.x},${coordinates.y}"]`,
  );
  square.setAttribute('ship', 'true');
}

export function addConfirmFleetButton(playerId, clickCallback) {
  const playerBox = document.getElementById(playerId);
  const button = document.createElement('button');

  button.classList.add('confirm-fleet');
  button.innerText = 'Confirm Fleet';

  button.addEventListener('click', () => {
    if (clickCallback) clickCallback();
  });

  playerBox.appendChild(button);
}

export function removeConfirmFleetButton(playerId) {
  const playerBox = document.getElementById(playerId);
  const button = playerBox.querySelector('button');
  button.remove();
}

export function highlightShipPlacement(playerId, coordinatesArray, isAllowed) {
  const boardDiv = document.getElementById(playerId).querySelector('.board');
  const squaresArray = [...boardDiv.querySelectorAll('.square')];

  squaresArray.forEach((square) => {
    square.removeAttribute('preview');
  });

  coordinatesArray.forEach((coordinates) => {
    const { x, y } = coordinates;
    const square = boardDiv.querySelector(`.square[data-position="${x},${y}"]`);
    if (square) square.setAttribute('preview', isAllowed ? 'allowed' : 'not-allowed');
  });
}

export function receiveAttack(playerId, coordinates) {
  const boardDiv = document.getElementById(playerId).querySelector('.board');
  const { x, y } = coordinates;

  const attackedSquare = boardDiv.querySelector(`.square[data-position="${x},${y}"]`);

  if (!attackedSquare) {
    throw Error('Attempt to attack a non existing square');
  }

  if (attackedSquare.getAttribute('attacked') === 'true') {
    throw Error('Attempt to attack a square that already has been attacked');
  }

  attackedSquare.setAttribute('attacked', 'true');
}

export function setTarget(playerId) {
  const boardDiv = document.getElementById(playerId).querySelector('.board');
  boardDiv.classList.add('targetable');
}

export function unsetTarget(playerId) {
  const boardDiv = document.getElementById(playerId).querySelector('.board');
  boardDiv.classList.remove('targetable');
}

export function hideFleet(playerId) {
  const boardDiv = document.getElementById(playerId).querySelector('.board');
  boardDiv.classList.add('hidden-fleet');
}

export function showFleet(playerId) {
  const boardDiv = document.getElementById(playerId).querySelector('.board');
  boardDiv.classList.remove('hidden-fleet');
}

export function displayFeedbackMessage(message) {
  const feedbackMessage = document.querySelector('#feedback-section .message');
  feedbackMessage.textContent = message;
}

export function displayCurrentTurnMessage(playerName) {
  const turnMessage = document.querySelector('#feedback-section .turn');
  turnMessage.innerHTML = `<span class="name">${playerName}</span>'s turn`;
}

export function clearCurrentTurnMessage() {
  const turnMessage = document.querySelector('#feedback-section .turn');
  turnMessage.innerHTML = '';
}

export function getFriendlyCoordinates(coordinates) {
  return { x: String.fromCharCode(65 + (coordinates.x % 26)), y: coordinates.y + 1 };
}

export function displayAttackMessage(attackerName, receiverName, coordinates) {
  const feedbackMessage = document.querySelector('#feedback-section .message');
  const { x, y } = getFriendlyCoordinates(coordinates);
  feedbackMessage.textContent = `${attackerName} attacked ${receiverName} at ${x} ${y}`;
}

export function displayCoordinatesFeedback(coordinates) {
  const coordinatesFeedback = document.querySelector('#feedback-section .coordinates');
  coordinatesFeedback.textContent = `${coordinates.x} ${coordinates.y}`;
}

export function clearCoordinatesFeedback() {
  const coordinatesFeedback = document.querySelector('#feedback-section .coordinates');
  coordinatesFeedback.textContent = '';
}
