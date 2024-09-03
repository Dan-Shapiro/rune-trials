const Card = require('../models/card');

exports.initializeDeck = async (req) => {
  try {
    let deck = [];
    let hand = [];
    let discard = [];
    const cards = { deck, hand, discard };

    const cardNames = [
      'Pinpoint Stab', 'Piercing Jab', 'Rapid Stab', 'Vicious Lunge', 
      'Lunging Strike', 'Ferocious Lunge', 'Savage Slash', 'Brutal Slash',
      'Cleave', 'Fortified Poke', 'Steel Point', 'Guarded Jab'
    ];

    for (const name of cardNames) {
      const card = await Card.findOne({ where: { name } });
      if (!card) throw new Error(`Card not found: ${name}`);
      cards.deck.push(card);
    }

    req.session.cards = cards;
  } catch (error) {
    console.error('Error initializing deck:', error.message);
    throw error;
  }
};

exports.shuffle = (deck) => {
  for (let i = deck.length - 1; i>0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

exports.drawCards = (cards, num) => {
  let cardsDrawn = [];

  for (let i = 0; i < num; i++) {
    // if draw pile is empty
    if (cards.deck.length === 0) {
      // if cards in discard pile
      if (cards.discard.length > 0) {
        // shuffle discard into deck
        cards.deck = [...cards.discard];
        cards.discard = [];
        this.shuffle(cards.deck);
      } else {
        // deck and discard are empty, stop drawing
        break;
      }
    }

    // draw a card from the deck
    const drawnCard = cards.deck.shift();
    cards.hand.push(drawnCard);
    cardsDrawn.push(drawnCard);
  }

  return cardsDrawn;
};