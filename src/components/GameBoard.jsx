// Importieren notwendiger Abhängigkeiten und Komponenten
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, compareCardProperties } from '../redux/actions';
import { selectHighestPropertyForComputer } from '../logic/gameLogic';
import { toggleLanguage } from '../redux/actions';

import Card from './Card';
import '../styles/GameBoard.css';

const GameBoard = () => {
    // Zustände und Daten aus dem Redux-Store holen
    const { playerCards, computerCards, isGameStarted, isPlayerTurn, lastResult, lastSelectedProperty, lastPlayerValue, lastComputerValue, gameOver } = useSelector(state => state.game);
    const dispatch = useDispatch();
    const { currentLanguage } = useSelector(state => state.game);
    
    // Lokale Zustände für Nachrichten und das Umdrehen der Computerkarte
    const [resultMessage, setResultMessage] = useState(null);
    const [flipComputerCard, setFlipComputerCard] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedPropertyByComputer, setSelectedPropertyByComputer] = useState(null);
    const [computerResult, setComputerResult] = useState('');
    const [computerSelectedProperty, setComputerSelectedProperty] = useState('');
    const [moveCounter, setMoveCounter] = useState(0);


    const propertyLabels = {
        property0: "Jahr",
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
            // Schritt 1: Computerkarte sofort aufdecken
            setFlipComputerCard(false);
            setSelectedProperty(property);

            // Schritt 2: Direkte Anzeige des Ergebnisses
            const comparisonResult = compareCardProperties(playerCards[0], computerCards[0], property);
    
            // Hier wird das Ergebnis sofort gesetzt
            setResultMessage({
                result: comparisonResult.result,
                property: property,
                playerValue: playerCards[0][property],
                computerValue: computerCards[0][property]
            });

            // Schritt 3: Verzögern der Aktualisierung der Karten und des Zurückdrehens der Computerkarte
            setTimeout(() => {
    
                // Optional: Rückdrehen der Computerkarte, falls gewünscht, hier einfügen
                setFlipComputerCard(true);
    
                // Aktualisierung der Karten im Zustand
                dispatch(compareCardProperties(playerCards[0], computerCards[0], property));
    
                // Ergebnis ausblenden
                setResultMessage(null);

                setSelectedProperty(null);

    
            }, 5000); // 5 Sekunden Verzögerung
        }
    };
    
    const handleComputerTurn = () => {

        setMoveCounter(prevCounter => prevCounter + 1);

        
        // Stellen Sie sicher, dass Karten vorhanden sind
        if (computerCards.length > 0 && playerCards.length > 0) {
            // Computerkarte aufdecken
            setFlipComputerCard(false);
    
            // Ermitteln der Eigenschaft, die der Computer wählt
            const selectedProperty = selectHighestPropertyForComputer(computerCards[0]);
            setSelectedProperty(selectedProperty);

            // Schritt 2: Direkte Anzeige des Ergebnisses
            const comparisonResult = compareCardProperties(playerCards[0], computerCards[0], selectedProperty);
    
            // Hier wird das Ergebnis sofort gesetzt
            setResultMessage({
                result: comparisonResult.result,
                property: selectedProperty,
                playerValue: playerCards[0][selectedProperty],
                computerValue: computerCards[0][selectedProperty]
            });

            // Schritt 3: Verzögern der Aktualisierung der Karten und des Zurückdrehens der Computerkarte
            setTimeout(() => {
    
                // Optional: Rückdrehen der Computerkarte, falls gewünscht, hier einfügen
                setFlipComputerCard(true);
    
              // Aktualisierung der Karten im Zustand
                dispatch(compareCardProperties(playerCards[0], computerCards[0], selectedProperty));
    
                // Ergebnis ausblenden
                setResultMessage(null);

                setSelectedProperty(null);

    
            }, 5000); // 5 Sekunden Verzögerung
        }
    };
    

    // Nachricht am Ende des Spiels
    let endGameMessage = "";
    if (gameOver) {
        if (playerCards.length === 0) {
            endGameMessage = "Spiel verloren!";
        } else if (computerCards.length === 0) {
            endGameMessage = "Spiel gewonnen!";
        }
    }

    // Rendern des Spielbretts mit Karten, Ergebnissen und Steuerelementen
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
                                        <button onClick={handleComputerTurn}>Satoshi-Turn</button>
                                    )}
                            </div>  
                            {selectedProperty && resultMessage && (
   <div className={`selected-property ${resultMessage.playerValue > resultMessage.computerValue ? 'result-win' : resultMessage.playerValue < resultMessage.computerValue ? 'result-lose' : 'result-draw'}`}>
   <p>
       {propertyLabels[selectedProperty] || "Keine Eigenschaft ausgewählt"}
   </p>
   <p>{resultMessage.playerValue} vs. {resultMessage.computerValue}</p>
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
                        <button onClick={handleStartGame}>Start Game</button>
                    )}
                </>
            )}
        </>
    );
    
    
};

export default GameBoard;
