import { START_GAME, COMPARE_CARD_PROPERTIES, TOGGLE_LANGUAGE } from './actionTypes';
import newCards from '../data/cardsData';
import { shuffleCards, dealCards, compareCardProperties } from '../logic/gameLogic';

const initialState = {
    playerCards: [],
    computerCards: [],
    drawPile: [], 
    isGameStarted: false,
    isPlayerTurn: true,
    lastComparisonResult: null,
    lastSelectedProperty: null,
    lastPlayerValue: null,
    lastComputerValue: null,
    currentLanguage: 'DE',
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_GAME:
      const shuffledCards = shuffleCards([...newCards]);
      const dealtCards = dealCards(shuffledCards);
    return {
      ...state,
      playerCards: dealtCards.playerCards,
      computerCards: dealtCards.computerCards,
      isGameStarted: true
    };
    case TOGGLE_LANGUAGE:
      return {
        ...state,
        currentLanguage: state.currentLanguage === 'DE' ? 'EN' : 'DE',
      };
    case COMPARE_CARD_PROPERTIES:
      const { playerCard, computerCard, selectedProperty } = action.payload;
      const comparisonResult = compareCardProperties(playerCard, computerCard, selectedProperty);

      let updatedPlayerCards = [...state.playerCards];
      let updatedComputerCards = [...state.computerCards];
      let updatedDrawPile = [...state.drawPile];
      let isPlayerTurn = state.isPlayerTurn;

      if (comparisonResult.result === 'win') {
        updatedPlayerCards.push(updatedPlayerCards[0], updatedComputerCards[0], ...updatedDrawPile);
        updatedPlayerCards.shift(); // Entfernt die oberste Karte des Spielerstapels
        updatedComputerCards.shift(); // Entfernt die oberste Karte des Computerstapels
        updatedDrawPile = []; // Leert den Unentschieden-Stapel
        isPlayerTurn = true;
      } else if (comparisonResult.result === 'lose') {
      updatedComputerCards.push(updatedPlayerCards[0], updatedComputerCards[0], ...updatedDrawPile);
      updatedPlayerCards.shift();
      updatedComputerCards.shift();
      updatedDrawPile = [];
      isPlayerTurn = false;
      } else if (comparisonResult.result === 'draw') {
        updatedDrawPile.push(updatedPlayerCards[0], updatedComputerCards[0]);
        updatedPlayerCards.shift();
        updatedComputerCards.shift();
      }

      const gameOver = updatedPlayerCards.length === 0 || updatedComputerCards.length === 0;
        return {
          ...state,
          lastResult: comparisonResult.result,
          lastSelectedProperty: comparisonResult.propertyName,
          lastPlayerValue: comparisonResult.playerValue,
          lastComputerValue: comparisonResult.computerValue,
          playerCards: updatedPlayerCards,
          computerCards: updatedComputerCards,
          drawPile: updatedDrawPile,
          gameOver,
          isPlayerTurn: isPlayerTurn
        };
      default:
    return state;
  }
};
    
  

  

export default gameReducer;
