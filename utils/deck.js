const Card = require('../models/card');

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawX(cards, num) {
  let drawnCards = [];

  // deck is out of cards
  for (let i = 0; i < num; i++) {
    // end if no cards in discard either
    if (cards.deck.length === 0) {
      if (cards.discard.length === 0) {
        break;
      }
      // shuffle discard into deck
      cards.deck = [...cards.discard];
      cards.discard = [];
      shuffleDeck(cards.deck);
    }
    // draw a card
    const card = cards.deck.pop();
    drawnCards.push(card);
  }

  cards.hand.push(...drawnCards);
  return drawnCards
}

module.exports = {
  shuffleDeck,
  drawX
}