let selectedCard = null;

// add event listeners
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
    playCardOnEnemy(selectedCard, enemyId);
    deselectCard();
  }
}

// helper functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function moveCardToDiscard(cardId) {
  const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
  if (cardElement) {
    cardElement.closest('.card-container').remove();
  }

  const discardCountElement = document.querySelector('.discard-count');
  const currDiscardCount = parseInt(discardCountElement.textContent);
  discardCountElement.textContent = currDiscardCount + 1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function discardHand(discardCount) {
  const handCardsContainer = document.querySelector('.hand-cards');
  handCardsContainer.innerHTML = '';

  const discardCountElement = document.querySelector('.discard-count');
  discardCountElement.textContent = discardCount;
}

async function handleEnemyAttacks(enemyAttacks) {
  for (let attack of enemyAttacks) {
    const enemyElement = document.querySelector(`[data-enemy-id="${attack.enemyId}"]`);
    const playerElement = document.querySelector('.player-container');
    const hitsplatContainer = playerElement.querySelector('.player-hitsplat-container');

    // highlight attacking enemy
    enemyElement.classList.add('highlight');

    // update enemy essence
    const essenceElement = enemyElement.querySelector('.enemy-essence');
    let currEssence = parseInt(essenceElement.textContent);
    currEssence -= attack.speed;
    essenceElement.textContent = currEssence;

    // show hitsplat with damage
    const hitsplat = document.createElement('div');
    hitsplat.classList.add('player-hitsplat');
    hitsplat.textContent = attack.damage;
    hitsplatContainer.appendChild(hitsplat);

    // update player hp
    const playerHpElement = document.querySelector('#player-hp');
    const maxHp = playerHpElement.textContent.split('/')[1];
    playerHpElement.textContent = `${attack.playerHp}/${maxHp}`;

    const hpBarFillElement = playerElement.querySelector('.hp-bar-fill');
    hpBarFillElement.style.width = `calc(${attack.playerHp}/${maxHp}*100%)`;

    // show hitsplat and highlight for 2s
    await sleep(2000);
    hitsplat.remove();
    enemyElement.classList.remove('highlight');

    // pause for 1s between attacks
    await sleep(1000);
    
    // check if player is defeated
    if (attack.playerHp <= 0) {
      alert('You have been defeated! You truly are not a superstar :(');
      return;
    }
  }
}

function resetEssence(essenceCount) {
  const essenceCountElement = document.querySelector('.essence-count');
  essenceCountElement.textContent = `${essenceCount}/12`;
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

function checkIfAllEnemiesDefeated() {
  const remainingEnemies = document.querySelectorAll('.enemy-container');
  if (remainingEnemies.length === 0) {
    alert('All enemies defeated! You are truly a superstar! YOU WIN!');
  }
}

// game functions
function playCardOnEnemy(cardId, enemyId) {
  const enemyElement = document.querySelector(`[data-enemy-id="${enemyId}"]`);
  const hitsplatContainer = enemyElement.querySelector('.enemy-hitsplat-container');

  fetch(`/playCard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardId, enemyId }),
  })
  .then(response => response.json())
  .then(data => {
    if(data.status === 'success') {
      // update essence
      const essenceCountElement = document.querySelector('.essence-count');
      essenceCountElement.textContent = `${data.essenceCount}/12`;

      // show hitsplat for 2 sec
      const hitsplat = document.createElement('div');
      hitsplat.classList.add('enemy-hitsplat');
      hitsplat.textContent = data.damage;
      hitsplatContainer.appendChild(hitsplat);

      // update enemy HP bar
      const newHp = data.currHp;
      const enemyHpElement = enemyElement.querySelector('.enemy-hp');
      const maxHp = enemyHpElement.textContent.split('/')[1];
      enemyHpElement.textContent = `${newHp}/${maxHp}`;

      const hpBarFillElement = enemyElement.querySelector('.hp-bar-fill');
      hpBarFillElement.style.width = `calc(${newHp}/${maxHp}*100%)`;

      // remove hitsplat after 2s, remove enemy if defeated
      setTimeout(() => {
        hitsplat.remove();
        if (data.isEnemyDefeated) {
          enemyElement.remove();
          checkIfAllEnemiesDefeated();
        }
      }, 2000);

      if (!data.isEnemyDefeated) {
        const newHp = data.currHp;
        const enemyHpElement = enemyElement.querySelector('.enemy-hp');
        const maxHp = enemyHpElement.textContent.split('/')[1];
        enemyHpElement.textContent = `${newHp}/${maxHp}`;

        const hpBarFillElement = enemyElement.querySelector('.hp-bar-fill');
        hpBarFillElement.style.width = `calc(${newHp}/${maxHp}*100%)`;
      }    

      moveCardToDiscard(cardId);
    } else {
      alert('Not enough essence!');
    }
    
  })
  .catch(error => {
    console.error('Error:', error);
  })
}

function endTurn() {
  fetch('/endTurn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(async data => {
    removePlayerHighlight();
    discardHand(data.discardCount);
    await handleEnemyAttacks(data.enemyAttacks);
    resetEssence(data.essenceCount);
    drawNewHand(data.newHand, data.deckCount, data.weapon);
    addPlayerHighlight();
  })
  .catch(error => {
    console.error('Error ending turn:', error);
  });
}