function updateBoard(player, attackFunction) {
  const boardDiv = document.getElementById(player.getId()).querySelector('.board');
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
        attackFunction(coordinates);
      });

      boardDiv.appendChild(squareDiv);
      y++;
    });
    x++;
  });
}

export function initializePlayerBox(player, attackFunction) {
  const playersSection = document.querySelector('#players-section');
  const playerBoxTemplate = document.querySelector('#player-box-template');
  const playerBox = playerBoxTemplate.content.cloneNode(true).querySelector('.player-box');

  playerBox.id = player.getId();
  playerBox.querySelector('.name').textContent = player.name;
  playersSection.appendChild(playerBox);

  updateBoard(player, attackFunction);
}

export function clearPlayersSection() {
  const playersSection = document.querySelector('#players-section');
  playersSection.innerHTML = '';
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

// Note: this is a temporary behavior for handle winning
export function showWinningMessage(playerName) {
  alert(`${playerName} has won the battleship!\nRefresh the page to start a new game.`);
}
