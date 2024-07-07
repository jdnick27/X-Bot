const { findCardByID } = require('pokemon-tcg-sdk-typescript/dist/sdk');

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

module.exports = { fetchCardById };