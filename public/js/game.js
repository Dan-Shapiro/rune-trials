let selectedCard = null;

// add event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
  // card select and deselect listeners
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
      const cardId = card.getAttribute('data-card-id');
      if (selectedCard === cardId) {
        deselectCard();
      } else {
        selectCard(cardId);
      }
    });
  });

  // enemy select listener
  document.querySelectorAll('.enemy-container').forEach(enemy => {
    enemy.addEventListener('click', function() {
      selectEnemy(enemy.getAttribute('data-enemy-id'));
    });
  });

  // enemy deselect listener
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.card') && !event.target.closest('.enemy-container')) {
      deselectCard();
    }
  });

  // draw card button listener
  document.getElementById('draw-card-button').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/deck/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num: 1 })
      });

      const data = await response.json();

      drawCards(data.cardsDrawn);
      updateDeckCount(data.deckCount);
      updateDiscardCount(data.discardCount);
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  });

  // start the first turn when screen loads
  startTurn();

  //document.querySelector('.end-turn-button').addEventListener('click', endTurn);
});

// helper functions
function selectCard(cardId) {
  selectedCard = cardId;
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`[data-card-id="${cardId}"]`).classList.add('selected');
}

function deselectCard() {
  selectedCard = null;
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('selected');
  });
}

function selectEnemy(enemyId) {
  if (selectedCard !== null) {
    //playCard(selectedCard, enemyId);
    deselectCard();
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function removePlayerHighlight() {
  const playerElement = document.querySelector('.player-container');
  playerElement.classList.remove('highlight');
}

function addPlayerHighlight() {
  const playerElement = document.querySelector('.player-container');
  playerElement.classList.add('highlight');
}

function drawCards(cards) {
  const handContainer = document.querySelector('.hand-cards');

  cards.forEach(card => {
    let cardCost = card.costModifier;
    if (card.type === 'attack') {
      const weaponSpeed = parseInt(document.getElementById('weapon-speed').textContent);
      cardCost += weaponSpeed;
    }

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('data-card-id', card.id);
    cardElement.innerHTML = `
      <div class="card" data-card-id="${card.id}">
        <div class="card-cost">${cardCost}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-image">
          <img src="${card.image}" alt="${card.name}">
        </div>
        <div class="card-type">
          ${capitalize(card.type)}
          ${card.type === 'attack' ? `<div>${capitalize(card.weaponStyle)} ${capitalize(card.attackType)}</div>` : ''}
        </div>
        <div class="card-text">${card.text}</div>
      </div>
    `;

    cardContainer.appendChild(cardElement);

    // animate card draw
    setTimeout(() => {
      handContainer.appendChild(cardContainer);
      requestAnimationFrame(() => {
        cardContainer.classList.add('drawn');
      });
    }, 100);

    // add event listeners
    cardElement.addEventListener('click', function() {
      const cardId = cardElement.getAttribute('data-card-id');
      if (selectedCard === cardId) {
        deselectCard();
      } else {
        selectCard(cardId);
      }
    });
  });
}

function updateDeckCount(count) {
  const deckCountElement = document.querySelector('.deck-count');
  deckCountElement.textContent = count;
}

function updateDiscardCount(count) {
  const discardCountElement = document.querySelector('.discard-count');
  discardCountElement.textContent = count;
}

function startTurn() {
  // draw 5 cards
  fetch('/api/deck/draw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ num: 5 })
  })
  .then(response => response.json())
  .then(data => {
    drawCards(data.cardsDrawn);
    updateDeckCount(data.deckCount);
    updateDiscardCount(data.discardCount);
  })
  .catch(error => {
    console.error('Error starting turn:', error);
  });
}