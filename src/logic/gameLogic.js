import { propertiesDescriptions } from '../data/cardsData';


export const shuffleCards = (cards) => {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
};
export const dealCards = (shuffledCards) => {
  const half = Math.ceil(shuffledCards.length / 2);
  const playerCards = shuffledCards.slice(0, half);
  const computerCards = shuffledCards.slice(half);
  return { playerCards, computerCards };
};
export const compareCardProperties = (playerCard, computerCard, propertyName) => {
  const propertyNamesMapping = {
    property1: propertiesDescriptions.property1D,
    property2: propertiesDescriptions.property2D,
    property3: propertiesDescriptions.property3D,
    property4: propertiesDescriptions.property4D,
    property5: propertiesDescriptions.property5D
  };
  const propertyToCompare = propertyName;
  const readablePropertyName = propertyNamesMapping[propertyToCompare];
  const playerValue = playerCard[propertyToCompare];
  const computerValue = computerCard[propertyToCompare];
  let result;
  if (playerValue > computerValue) {
      result = 'win';
  } else if (playerValue < computerValue) {
      result = 'lose';
  } else {
      result = 'draw';
  }
  return {
      result: result,
      propertyName: readablePropertyName,
      playerValue: playerValue,
      computerValue: computerValue
  };
};
export const selectHighestPropertyForComputer = (computerCard) => {
  let highestValue = -Infinity;
  let selectedProperty = '';
  const areAllPropertiesLessThan4 = ['property2', 'property3', 'property4', 'property5'].every(prop => computerCard[prop] < 4);
  if (areAllPropertiesLessThan4) {
    return 'property1';
  } else {
    ['property2', 'property3', 'property4', 'property5'].forEach(prop => {
      if (computerCard[prop] > highestValue) {
        highestValue = computerCard[prop];
        selectedProperty = prop;
      }
    });
  }
  return selectedProperty;
};

