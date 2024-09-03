let selectedCard = null;

// add event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
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

  document.querySelectorAll('.enemy-container').forEach(enemy => {
    enemy.addEventListener('click', function() {
      selectEnemy(enemy.getAttribute('data-enemy-id'));
    });
  });

  document.addEventListener('click', function(event) {
    if (!event.target.closest('.card') && !event.target.closest('.enemy-container')) {
      deselectCard();
    }
  });

  document.querySelector('.end-turn-button').addEventListener('click', endTurn);
});

// event listener helpers
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
    castSpell(selectedCard, enemyId);
    deselectCard();
  }
}

// helper functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawNewHand(newHand, deckCount, weapon) {
  const handCardsContainer = document.querySelector('.hand-cards');
  handCardsContainer.innerHTML = '';

  newHand.forEach(card => {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('data-card-id', card.id);

    cardElement.innerHTML = `
      <div class="card-cost">${card.costModifier + weapon.speed}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-image">
        <img src="${card.image}" alt="${card.name}">
      </div>
      <div class="card-type">
        ${capitalizeFirstLetter(card.type)}
        ${card.type === 'attack' ? `<div>${capitalizeFirstLetter(card.weaponStyle)} ${capitalizeFirstLetter(card.attackType)}</div>` : ''}
      </div>
      <div class="card-text">${card.text}</div>
    `;

    cardContainer.appendChild(cardElement);
    handCardsContainer.appendChild(cardContainer);

    cardElement.addEventListener('click', function() {
      const cardId = cardElement.getAttribute('data-card-id');
      if (selectedCard === cardId) {
        deselectCard();
      } else {
        selectCard(cardId);
      }
    });
    
    const handCountElement = document.querySelector('.deck-count');
    handCountElement.textContent = deckCount;
  });
}

function removePlayerHighlight() {
  const playerElement = document.querySelector('.player-container');
  playerElement.classList.remove('highlight');
}

function addPlayerHighlight() {
  const playerElement = document.querySelector('.player-container');
  playerElement.classList.add('highlight');
}

function moveCardToDiscard(cardId) {
  const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
  if (cardElement) {
    cardElement.closest('.card-container').remove();
  }

  const discardCountElement = document.querySelector('.discard-count');
  discardCountElement.textContent = parseInt(discardCountElement.textContent) + 1;
}

function showHitsplat(enemyId, damage) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);
  const hitsplat = document.createElement('div');
  hitsplat.classList.add('enemy-hitsplat');
  hitsplat.textContent = damage;
  enemyElement.querySelector('.enemy-hitsplat-container').appendChild(hitsplat);

  setTimeout(() => {
    hitsplat.remove();
  }, 1200);
}

function updateEnemyHp(enemyId, newHp) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);
  const enemyHpElement = enemyElement.querySelector('.enemy-hp');
  const maxHp = enemyHpElement.textContent.split('/')[1];
  enemyHpElement.textContent = `${newHp}/${maxHp}`;

  const hpBarFillElement = enemyElement.querySelector('.hp-bar-fill');
  hpBarFillElement.style.width = `calc(${newHp}/${maxHp} * 100%)`;
}

function removeEnemy(enemyId) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);
  if (enemyElement) {
    enemyElement.remove();
  }
}

function checkIfAllEnemiesDefeated() {
  if (document.querySelectorAll('.enemy-container').length === 0) {
    alert('All enemies defeated! You are truly a superstar! YOU WIN!');
  }
}

// game functions
function castSpell(cardId, enemyId) {
  fetch(`/castSpell`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardId, enemyId }),
  })
  .then(response => response.json())
  .then(async data => {
    if (data.status === 'success') {
      // move card to discard
      moveCardToDiscard(cardId);

      // show hitsplat
      showHitsplat(enemyId, data.damage);

      // update enemy hp
      updateEnemyHp(enemyId, data.enemyHp);

      // remove enemy if defeated
      if (data.isEnemyDefeated) {
        removeEnemy(enemyId);
      }

      // check if all enemies are defeated
      checkIfAllEnemiesDefeated();
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

async function enemyAttack(enemyObj) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyObj.enemy.id}"]`);
  
  // highlight attacking enemy
  enemyElement.classList.add('highlight');
  
  // update cooldown
  cooldownElement = enemyElement.querySelector('.enemy-cooldown');
  cooldownElement.textContent = enemyObj.cooldown;

  // update player HP bar
  const playerHpElement = document.querySelector('#player-hp');
  const currHp = playerHpElement.textContent.split('/')[0];
  const maxHp = playerHpElement.textContent.split('/')[1];
  playerHpElement.textContent = `${currHp - enemyObj.damageDealt}/${maxHp}`;
  const hpBarFillElement = document.querySelector('.hp-bar-fill');
  hpBarFillElement.style.width = `calc(${currHp - enemyObj.damageDealt}/${maxHp} * 100%)`;

  // show hitsplat
  const hitsplat = document.createElement('div');
  hitsplat.classList.add('player-hitsplat');
  hitsplat.textContent = enemyObj.damageDealt;
  document.querySelector('.player-hitsplat-container').appendChild(hitsplat);
  
  // pause for 2 ticks
  await sleep(1200);

  // remove hitsplat
  hitsplat.remove();
  
  // unhighlight enemy
  enemyElement.classList.remove('highlight');

  // pause for 1s between attacks
  await sleep(600);
}

function endTurn() {
  fetch('/endTurn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Ending turn...');
    // unhighlight player to end turn
    removePlayerHighlight();

    // 1- discard hand
    const handCardsContainer = document.querySelector('.hand-cards');
    handCardsContainer.innerHTML = '';
    const discardCountElement = document.querySelector('.discard-count');
    discardCountElement.textContent = data.discardCount;

    // 2- enemies attack player
    data.enemies.forEach(async enemyObj => {
      // check if enemy can attack
      if (enemyObj.cooldown <= 0 && !data.isPlayerDefeated) {
        console.log(`${enemyObj.enemy.name} is attacking!`)
        // perform attack
        await enemyAttack(enemyObj);

        // check if player is defeated
        if (data.isPlayerDefeated) {
          alert('You have been defeated! You truly are not a superstar :(');
          return;
        }
      }
    });

    // 3- decrement cooldowns
    const cooldownElement = document.querySelector('.cooldown');
    cooldownElement.textContent = `${data.cooldown}`;

    data.enemies.forEach(enemyObj => {
      const enemyElement = document.querySelector(`[data-enemy-id="${enemyObj.enemy.id}"]`);
      if (enemyElement) {
        const enemyCooldownElement = enemyElement.querySelector('.enemy-cooldown');
        if (enemyCooldownElement) {
          enemyCooldownElement.textContent = enemyObj.cooldown;
        }
      }
    });

    // 4- draw a new hand
    drawNewHand(data.newHand, data.deckCount, data.weapon);

    // highlight player for next turn
    addPlayerHighlight();
  })
  .catch(error => {
    console.error('Error ending turn:', error);
  });
}