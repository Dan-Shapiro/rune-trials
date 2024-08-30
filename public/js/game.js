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

// game logic
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

function moveCardToDiscard(cardId) {
  const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
  if (cardElement) {
    cardElement.closest('.card-container').remove();
  }

  const discardCountElement = document.querySelector('.discard-count');
  const currDiscardCount = parseInt(discardCountElement.textContent);
  discardCountElement.textContent = currDiscardCount + 1;
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
    const handCardsContainer = document.querySelector('.hand-cards');
    handCardsContainer.innerHTML = '';

    data.newHand.forEach(card => {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card-container');

      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.setAttribute('data-card-id', card.id);

      cardElement.innerHTML = `
        <div class="card-cost">${card.costModifier + data.weapon.speed}</div>
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
    });

    const discardCountElement = document.querySelector('.discard-count');
    discardCountElement.textContent = data.discardCount;

    const essenceCountElement = document.querySelector('.essence-count');
    essenceCountElement.textContent = `${data.essenceCount}/12`;
  })
  .catch(error => {
    console.error('Error ending turn:', error);
  });
}