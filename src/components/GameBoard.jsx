import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, compareCardProperties } from '../redux/actions';
import { selectHighestPropertyForComputer } from '../logic/gameLogic';
import { toggleLanguage } from '../redux/actions';

import Card from './Card';
import '../styles/GameBoard.css';

const GameBoard = () => {
    const { playerCards, computerCards, isGameStarted, isPlayerTurn, lastResult, lastSelectedProperty, lastPlayerValue, lastComputerValue, gameOver } = useSelector(state => state.game);
    const dispatch = useDispatch();
    const { currentLanguage } = useSelector(state => state.game);
    const [resultMessage, setResultMessage] = useState(null);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [flipComputerCard, setFlipComputerCard] = useState(false);

    const handleCardClick = () => {
        setIsCardFlipped(!isCardFlipped); // Umdrehen der Karte
    };
   
    const handleToggleLanguage = () => {
        dispatch(toggleLanguage());
    };

    useEffect(() => {
        if (resultMessage) {
            const timer = setTimeout(() => {
                setResultMessage(null);
            }, 10000); 

            return () => clearTimeout(timer);
        }
    }, [resultMessage]);

    const handleStartGame = () => {
        dispatch(startGame());
    };

     const handlePropertyClick = (property) => {
        if (playerCards.length > 0 && computerCards.length > 0) {
            setFlipComputerCard(true);
            const result = compareCardProperties(playerCards[0], computerCards[0], property);
            
            setResultMessage({
                result: result,
                property: property,
                playerValue: playerCards[0][property],
                computerValue: computerCards[0][property]
            });
           
            dispatch(compareCardProperties(playerCards[0], computerCards[0], property));
        }
    };

    const handleComputerTurn = () => {
        if (computerCards.length > 0 && !isPlayerTurn) {
            const selectedProperty = selectHighestPropertyForComputer(computerCards[0]);
            dispatch(compareCardProperties(playerCards[0], computerCards[0], selectedProperty));
        }

    };

    let endGameMessage = "";
    if (gameOver) {
        if (playerCards.length === 0) {
            endGameMessage = "Spiel verloren!";
        } else if (computerCards.length === 0) {
            endGameMessage = "Spiel gewonnen!";
        }
    }

    return (
        <>
            {gameOver ? (
                <div className="end-game-message">
                    {playerCards.length === 0 ? "Spiel verloren!" : "Spiel gewonnen!"}
                </div>
            ) : (
                <>
                    {isGameStarted ? (
                        <div className="game-container">
                            <button className="language-toggle-button" onClick={handleToggleLanguage}>
                                {currentLanguage === 'DE' ? 'E' : 'D'}
                            </button>
                            <div className="player-cards">
                                <div className="card-count">Spieler Karten: {playerCards.length}</div>
                                {playerCards.length > 0 && 
                                    <Card 
                                        card={playerCards[0]} 
                                        onPropertyClick={handlePropertyClick}
                                        isClickable={isPlayerTurn} 
                                        currentLanguage={currentLanguage}
                                    />
                                }
                            </div>
                            <div className='result'>
                                <div className={`button-container ${isPlayerTurn ? 'hidden-button' : 'visible-button'}`}>
                                    {!isPlayerTurn && (
                                        <button onClick={handleComputerTurn}>Computerzug</button>
                                    )}
                            </div>    
                              {lastResult && (
                                  <div className="comparison-result">
                                    {lastSelectedProperty}<br/>
                                    {lastPlayerValue} vs {lastComputerValue}<br/>
                                    {lastResult}
                                </div>
                            )}
                            </div>
                            <div className="computer-cards">
                                <div className="card-count">Computer Karten: {computerCards.length}</div>
                                {computerCards.length > 0 && 
                                    <Card 
                                        card={computerCards[0]}
                                        isClickable={false} 
                                        currentLanguage={currentLanguage}
                                    />
                                }
                            </div>
                        </div>
                    ) : (
                        <button onClick={handleStartGame}>Spiel Starten</button>
                    )}
                </>
            )}
        </>
    );
    
};

export default GameBoard;
