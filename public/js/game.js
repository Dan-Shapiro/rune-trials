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

  // end turn button listener
  document.querySelector('.next-tick-button').addEventListener('click', endTurn);

  // start combat when screen loads 
  startCombat();
});

// helpers
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// element selection
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
    playCard(selectedCard, enemyId);
    deselectCard();
  }
}

// highlighting
function removePlayerHighlight() {
  const playerElement = document.querySelector('.player-container');
  playerElement.classList.remove('highlight');
}

function addPlayerHighlight() {
  const playerElement = document.querySelector('.player-container');
  playerElement.classList.add('highlight');
}

function removeEnemyHighlight(enemyId) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);
  enemyElement.classList.remove('highlight');
}

function addEnemyHighlight(enemyId) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);
  enemyElement.classList.add('highlight');
}

// drawing cards
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

function removeCardFromHand(cardId) {
  const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
  const cardContainer = cardElement.parentElement;
  cardElement.classList.add('fade-out');
  setTimeout(() => {
    cardContainer.remove();
  }, 600);
}

// dealing damage
function showEnemyHitsplat(enemyId, damage) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);

  const hitsplatContainer = enemyElement.querySelector('.enemy-hitsplat-container');
  const hitsplatElement = document.createElement('div');
  hitsplatElement.classList.add('enemy-hitsplat');
  hitsplatElement.textContent = damage;
  hitsplatContainer.appendChild(hitsplatElement);

  setTimeout(() => {
    hitsplatElement.remove();
  }, 1200);
}

function removeEnemy(enemyId) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);

  setTimeout(() => {
    enemyElement.classList.add('fade-out');
    setTimeout(() => {
      enemyElement.remove();
      checkIfAllEnemiesDefeated();
    }, 600);
  }, 1200);
}

function checkIfAllEnemiesDefeated() {
  const remainingEnemies = document.querySelectorAll('.enemy-container');
  if (remainingEnemies.length === 0) {
    alert('You are a winner!');
  }
}

function showPlayerHitsplat(damage) {
  const hitsplatContainer = document.querySelector('.player-hitsplat-container');
  const hitsplatElement = document.createElement('div');
  hitsplatElement.classList.add('player-hitsplat');
  hitsplatElement.textContent = damage;
  hitsplatContainer.appendChild(hitsplatElement);

  setTimeout(() => {
    hitsplatElement.remove();
  }, 1200);
}

function removePlayer() {
  alert('You are a loser!');
}

// combat sequence
function startCombat() {
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
    console.error('Error starting combat:', error);
  });
}

async function nextTick() {
  try {
    const response = await fetch('/api/next-tick', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    // update player cooldown
    document.getElementById('player-cooldown').textContent = data.cooldown;

    const playerElement = document.querySelector('.player-container');
    const playerHpElement = document.getElementById('player-hp');
    const playerHpFillElement = playerElement.querySelector('.hp-bar-fill');
    // enemy attacks
    for (const enemyData of data.enemies) {
      const enemyElement = document.querySelector(`[data-enemy-id="${enemyData.enemy.id}"]`);

      if (enemyData.isAttacking) {
        // highlight enemy
        addEnemyHighlight(enemyData.enemy.id);
        removePlayerHighlight();

        // attacking, show 0 temporarily until animation is done
        enemyElement.querySelector('.enemy-cooldown').textContent = 0;

        // update player hp
        playerHpElement.textContent = `${enemyData.playerCurrHp}/${data.maxHp}`;
        playerHpFillElement.style.width = `calc(${enemyData.playerCurrHp}/${data.maxHp}*100%)`;

        // show hitsplat
        showPlayerHitsplat(enemyData.damage);

        // wait 2 ticks
        await new Promise(resolve => setTimeout(resolve, 1200));

        // reset enemy cooldown
        enemyElement.querySelector('.enemy-cooldown').textContent = enemyData.cooldown;

        // highlight player
        removeEnemyHighlight(enemyData.enemy.id);
        addPlayerHighlight();
      } else {
        // not attacking, decrement cooldown
        enemyElement.querySelector('.enemy-cooldown').textContent = enemyData.cooldown;
      }

      // remove player if defeated
      if (data.isPlayerDefeated) {
        removePlayer();
      }
    }
  } catch(error) {
    console.error('Error moving to next tick:', error);
  }
}

function endTurn() {
  nextTick();
}

// playing cards
function playCard(cardId, enemyId) {
  fetch('/api/play-card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cardId: cardId, enemyId, enemyId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // update player cooldown
      document.getElementById('player-cooldown').textContent = data.newCooldown;

      // update enemy hp
      const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);
      const hpElement = enemyElement.querySelector('.enemy-hp');
      hpElement.textContent = `${data.newEnemyHp}/${data.enemyMaxHp}`;

      const hpFillElement = enemyElement.querySelector('.hp-bar-fill');
      hpFillElement.style.width = `calc(${data.newEnemyHp}/${data.enemyMaxHp}*100%)`;

      // show hitsplat for 2 ticks
      showEnemyHitsplat(enemyId, data.damage);
      
      // remove enemy if defeated
      if (data.isEnemyDefeated) {
        removeEnemy(enemyId);
      }

      // move card to discard
      removeCardFromHand(cardId);
      updateDiscardCount(data.discardCount);
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error playing card:', error);
  })
}