const { findCardByID, Card } = require('pokemon-tcg-sdk-typescript/dist/sdk');
const axios = require('axios');

const fetchCardById = async (cardId) => {
  try {
    const card = await findCardByID(cardId);
    console.log('Card:', card);
    return card;
  } catch (error) {
    console.error('Error fetching card:', error);
    throw error;
  }
};

const findCardsByPokedexNumber = async (pokedexNumber) => {
  try {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      params: {
        q: `nationalPokedexNumbers:${pokedexNumber}`
      }
    });
    const cards = response.data.data;
    console.log('Cards:', cards);
    return cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

module.exports = { fetchCardById, findCardsByPokedexNumber };