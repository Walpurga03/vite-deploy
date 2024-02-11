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
   
    // Sprache umschalten
    const handleToggleLanguage = () => {
        console.log(`Sprache umgeschaltet`);
        dispatch(toggleLanguage());
    };

    // Effekt, der eine Nachricht nach 10 Sekunden löscht
    useEffect(() => {
        if (resultMessage) {
            const timer = setTimeout(() => {
                setResultMessage(null);
            }, 10000); 

            return () => clearTimeout(timer);
        }
    }, [resultMessage]);

    // Startet das Spiel durch Dispatch eines Redux-Actions
    const handleStartGame = () => {
        console.log(`Spiel gestartet`);
        dispatch(startGame());
    };

    // Behandelt das Klicken auf eine Eigenschaft. Zeigt die Computerkarte für 5 Sekunden
    const handlePropertyClick = (property) => {
        console.log(`Eigenschaft ${property} ausgewählt, Computerkarte wird aufgedeckt.`);
        if (playerCards.length > 0 && computerCards.length > 0) {
            setFlipComputerCard(false);
    
            setTimeout(() => {
                console.log(`Computerkarte wird zurückgedreht.`);
                setFlipComputerCard(true);
            }, 5000); // Setzt die Karte nach 5 Sekunden zurück
    
            // Vergleicht die Eigenschaften und setzt das Ergebnis
            const result = compareCardProperties(playerCards[0], computerCards[0], property);
            setResultMessage({
                result: result,
                property: property,
                playerValue: playerCards[0][property],
                computerValue: computerCards[0][property]
            });
    
            // Verzögerung, bevor die Logik zur Aktualisierung der Karten durchgeführt wird
            setTimeout(() => {
                // Dispatch der Aktion, um das Ergebnis des Vergleichs zu verarbeiten und die Karten zu aktualisieren
                dispatch(compareCardProperties(playerCards[0], computerCards[0], property));

                // Computerkarte zurückdrehen
                setFlipComputerCard(true);
            }, 5000); // 5 Sekunden Verzögerung
        }
    };

    const handleComputerTurn = () => {
        // Stellen Sie sicher, dass Karten vorhanden sind
        if (computerCards.length > 0 && playerCards.length > 0) {
            // Computerkarte aufdecken
            setFlipComputerCard(false);
    
            // Ermitteln der Eigenschaft, die der Computer wählt
            const selectedProperty = selectHighestPropertyForComputer(computerCards[0]);
    
            // Fügen Sie eine Verzögerung hinzu, um die Auswahl anzuzeigen und die Karte aufzudecken
            setTimeout(() => {
                // Vergleich durchführen und das Ergebnis verarbeiten
                dispatch(compareCardProperties(playerCards[0], computerCards[0], selectedProperty));
    
                // Computerkarte zurückdrehen
                setFlipComputerCard(true);
    
                // Optional: weitere Aktionen, wie das Vorbereiten des Spiels für den nächsten Zug
            }, 5000); // Passen Sie die Verzögerung nach Bedarf an
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
                                <div className="card-count">Spieler Karten: {playerCards.length}</div>
                                {playerCards.length > 0 && 
                                    <Card 
                                    card={playerCards[0]} 
                                    onPropertyClick={handlePropertyClick}
                                    isClickable={isPlayerTurn} 
                                    currentLanguage={currentLanguage}
                                    isPlayerCard={true} // Hier sollte true sein, da es eine Spielerkarte ist
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
                                    shouldFlip={flipComputerCard}
                                    isClickable={false} 
                                    currentLanguage={currentLanguage}
                                    isPlayerCard={false} // Hier sollte false sein, da es eine Computerkarte ist
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
