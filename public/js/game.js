let selectedCard = null;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
      selectCard(card.getAttribute('data-card-id'));
    });
  });

  document.querySelectorAll('.enemy-container').forEach(enemy => {
    enemy.addEventListener('click', function() {
      selectEnemy(enemy.getAttribute('data-enemy-id'));
    });
  });
});

function selectCard(cardId) {
  selectedCard = cardId;
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`[data-card-id="${cardId}"]`).classList.add('selected');
}

function selectEnemy(enemyId) {
  if (selectedCard !== null) {
    playCardOnEnemy(selectedCard, enemyId);
  } else {
    alert('Please select a card first.');
  }
}

function playCardOnEnemy(cardId, enemyId) {
  fetch(`/playCard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardId, enemyId }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Card played:', data);

    if (data.success) {
      alert(data.message);
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  })
}