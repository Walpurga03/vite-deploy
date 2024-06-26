import { COMPARE_CARD_PROPERTIES, START_GAME } from './actionTypes';

export const compareCardProperties = (playerCard, computerCard, selectedProperty, isPlayerTurn) => {
  return {
    type: COMPARE_CARD_PROPERTIES,
    payload: { playerCard, computerCard, selectedProperty, isPlayerTurn }
  };
};

export const startGame = () => {
  return {
    type: START_GAME
  };
};
