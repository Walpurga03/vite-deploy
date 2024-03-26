// Importieren notwendiger Abhängigkeiten und Komponenten
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, compareCardProperties } from '../redux/actions';
import { selectHighestPropertyForComputer } from '../logic/gameLogic';
import { toggleLanguage } from '../redux/actions';


import Card from './Card';
import '../styles/GameBoard.css';
import StartAnimation from './StartAnimation';
import EndAnimation from './EndAnimation';

const GameBoard = () => {
    // Zustände und Daten aus dem Redux-Store holen
    const { playerCards, computerCards, isGameStarted, isPlayerTurn, lastResult, lastSelectedProperty, lastPlayerValue, lastComputerValue, gameOver } = useSelector(state => state.game);
    const dispatch = useDispatch();
    const { currentLanguage } = useSelector(state => state.game);
    
    // Lokale Zustände für Nachrichten und das Umdrehen der Computerkarte
    const [resultMessage, setResultMessage] = useState(null);
    const [flipComputerCard, setFlipComputerCard] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [moveCounter, setMoveCounter] = useState(0);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const [isButtonClickable, setIsButtonClickable] = useState(true);


    const handleAnimationEnd = () => {
        setIsAnimationFinished(true);
    };
    const propertyLabels = {
        property0: "Seit",
        property1: "Seit",
        property2: "Knappheit",
        property3: "Lebensdauer",
        property4: "Teilbarkeit",
        property5: "Transportfähigkeit",
      };
    // Sprache umschalten
    const handleToggleLanguage = () => {
        dispatch(toggleLanguage());
    };
    // Startet das Spiel durch Dispatch eines Redux-Actions
    const handleStartGame = () => {
        dispatch(startGame());
    };
    const handlePropertyClick = (property) => {
        setMoveCounter(prevCounter => prevCounter + 1);
        if (playerCards.length > 0 && computerCards.length > 0) {
            setFlipComputerCard(false);
            setSelectedProperty(property);
            const comparisonResult = compareCardProperties(playerCards[0], computerCards[0], property);
            setResultMessage({
                result: comparisonResult.result,
                property: property,
                playerValue: playerCards[0][property],
                computerValue: computerCards[0][property]
            });
            console.log(`${property}->${playerCards[0][property]} vs ${computerCards[0][property]}`);
            setTimeout(() => {
                setFlipComputerCard(true); 
                setTimeout(() => {
                    dispatch(compareCardProperties(playerCards[0], computerCards[0], property)); 
                    setResultMessage(null);
                    setSelectedProperty(null);
                }, 500); 
            }, 5000); 
            
        }
    };
    const handleComputerTurn = () => {
        setIsButtonClickable(false);
        setMoveCounter(prevCounter => prevCounter + 1);
        if (computerCards.length > 0 && playerCards.length > 0) {
            setFlipComputerCard(false);
            const selectedProperty = selectHighestPropertyForComputer(computerCards[0]);
            setSelectedProperty(selectedProperty);
            const comparisonResult = compareCardProperties(playerCards[0], computerCards[0], selectedProperty);
            setResultMessage({
                result: comparisonResult.result,
                property: selectedProperty,
                playerValue: playerCards[0][selectedProperty],
                computerValue: computerCards[0][selectedProperty]
            });
            setTimeout(() => {
                setFlipComputerCard(true);
                setTimeout(() => {
                    dispatch(compareCardProperties(playerCards[0], computerCards[0], selectedProperty)); // Aktualisieren Sie die Karten nach einer weiteren kurzen Verzögerung
                    setResultMessage(null);
                    setSelectedProperty(null);
                }, 500); 
                setIsButtonClickable(true); 
                console.log(`[Computerzug] Ausgewählte Eigenschaft: ${selectedProperty}, Spielerwert: ${playerCards[0][selectedProperty]}, Computerwert: ${computerCards[0][selectedProperty]}`);
            }, 5000); 
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

    function formatValue(value, selectedProperty) {
        if (selectedProperty === 'property0') {
          // Kehrt das Vorzeichen nur um, wenn "Seit" (property1) ausgewählt ist
          return value < 0 ? "+" + (value)*-1 : "-" + Math.abs(value); // "+" vor negativen Werten, "-" vor positiven Werten
        }
        return value; // Gibt den Wert unverändert zurück, wenn nicht "Seit" ausgewählt ist
      }
      
      
    return (
        <>
             {gameOver ? (
                 <EndAnimation playerWon={playerCards.length > 0} />
            ) : (
                <>
                    {isGameStarted ? (
                        <div className="game-container">
                            <button className="language-toggle-button" onClick={handleToggleLanguage}>
                                {currentLanguage === 'DE' ? 'E' : 'D'}
                            </button>
                            <div className="player-cards">
                                <div className="card-count">Player: {playerCards.length}</div>
                                {playerCards.length > 0 && 
                                    <Card 
                                    card={playerCards[0]} 
                                    onPropertyClick={handlePropertyClick}
                                    isClickable={isPlayerTurn} 
                                    currentLanguage={currentLanguage}
                                    isPlayerCard={true}
                                    /> 
                                }
                            </div>

                            <div className='result'>
    <div className={`button-container ${isPlayerTurn ? 'hidden-button' : 'visible-button'}`}>
        {!isPlayerTurn && (
            <button onClick={handleComputerTurn} disabled={!isButtonClickable}>Satoshi-Turn</button>
        )}
    </div>  
    {selectedProperty && resultMessage && (
    <div className={`selected-property ${resultMessage.playerValue > resultMessage.computerValue ? 'result-win' : resultMessage.playerValue < resultMessage.computerValue ? 'result-lose' : 'result-draw'}`}>
        <p>{propertyLabels[selectedProperty] || "Keine Eigenschaft ausgewählt"}</p>
       
       

   
        <p>{
            formatValue(resultMessage.playerValue, selectedProperty) + 
            " vs. " + 
            formatValue(resultMessage.computerValue, selectedProperty)
        }</p>

        
        {resultMessage.playerValue > resultMessage.computerValue ? (
            <p className="result-highlight">Win!</p>
        ) : resultMessage.playerValue < resultMessage.computerValue ? (
            <p className="result-highlight">Lose!</p>
        ) : (
            <p className="result-highlight">Draw!</p>
        )}
    </div>
    )}
</div>


                            <div className="computer-cards">
                                <div className="card-count">Sathoshi: {computerCards.length}</div>
                                {computerCards.length > 0 && 
                                    <Card 
                                    card={computerCards[0]}
                                    shouldFlip={flipComputerCard}
                                    isClickable={false} 
                                    currentLanguage={currentLanguage}
                                    isPlayerCard={false}
                                />
                                }
                            </div>
                        </div>
                    ) : (
                        <>
                            <StartAnimation onAnimationEnd={handleAnimationEnd}/>
                            {isAnimationFinished && (
                            <>
                                <div className="rotate-device">
                                    Bitte drehen Sie Ihr Gerät für die beste Ansicht.
                                </div>
                                <button onClick={handleStartGame}>Start Game</button>
                            </>
                            )}
                        </>
                    )}
                </>
            )} 
        </>
    );
};

export default GameBoard;
