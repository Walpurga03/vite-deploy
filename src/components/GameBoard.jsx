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

   
    // Sprache umschalten
    const handleToggleLanguage = () => {
        console.log(`Sprache umgeschaltet`);
        dispatch(toggleLanguage());
    };

    useEffect(() => {
        if (resultMessage) {
            console.log("Ergebnis aktualisiert und bereit zur Anzeige:", resultMessage);
        }
    }, [resultMessage]);

    // Startet das Spiel durch Dispatch eines Redux-Actions
    const handleStartGame = () => {
        console.log(`Spiel gestartet`);
        dispatch(startGame());
    };

    const handlePropertyClick = (property) => {
        console.log(`[handlePropertyClick] Eigenschaft ${property} wurde ausgewählt.`);
    
        if (playerCards.length > 0 && computerCards.length > 0) {
            console.log(`[handlePropertyClick] Beide Spieler haben Karten. Beginne mit dem Prozess.`);
    
            // Schritt 1: Computerkarte sofort aufdecken
            setFlipComputerCard(false);
            console.log(`[handlePropertyClick] Computerkarte wird aufgedeckt.`);
            setSelectedProperty(property);

            // Schritt 2: Direkte Anzeige des Ergebnisses
            const comparisonResult = compareCardProperties(playerCards[0], computerCards[0], property);
            console.log(`[handlePropertyClick] Vergleich durchgeführt. Ergebnis: ${comparisonResult.result}`);
    
            // Hier wird das Ergebnis sofort gesetzt
            console.log("Setze ResultMessage mit:", comparisonResult);
            setResultMessage({
                result: comparisonResult.result,
                property: property,
                playerValue: playerCards[0][property],
                computerValue: computerCards[0][property]
            });
            console.log("ResultMessage gesetzt:", resultMessage);

            // Schritt 3: Verzögern der Aktualisierung der Karten und des Zurückdrehens der Computerkarte
            setTimeout(() => {
                console.log(`[handlePropertyClick] Verzögerung abgelaufen. Bereite das Zurückdrehen der Computerkarte vor und aktualisiere die Karten.`);
    
                // Optional: Rückdrehen der Computerkarte, falls gewünscht, hier einfügen
                setFlipComputerCard(true);
    
                // Aktualisierung der Karten im Zustand
                dispatch(compareCardProperties(playerCards[0], computerCards[0], property));
    
                // Ergebnis ausblenden
                setResultMessage(null);

                setSelectedProperty(null);

    
                console.log(`[handlePropertyClick] Karten wurden aktualisiert und die Computerkarte wird zurückgedreht.`);
            }, 5000); // 5 Sekunden Verzögerung
        } else {
            console.log(`[handlePropertyClick] Einer der Spieler hat keine Karten mehr. Spiel könnte beendet sein.`);
        }
    };
    
    
    const handleComputerTurn = () => {
        // Stellen Sie sicher, dass Karten vorhanden sind
        if (computerCards.length > 0 && playerCards.length > 0) {
            // Computerkarte aufdecken
            setFlipComputerCard(false);
    
            // Ermitteln der Eigenschaft, die der Computer wählt
            const selectedProperty = selectHighestPropertyForComputer(computerCards[0]);
    
            // Aktualisiere den Zustand mit der ausgewählten Eigenschaft
            setSelectedPropertyByComputer(selectedProperty);

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
                                <div className="card-count">Player-Card: {playerCards.length}</div>
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
                                        <button onClick={handleComputerTurn}>Satoshi-Turn</button>
                                    )}
                            </div>  
                            {selectedProperty && (
                                <div className="selected-property">
                                    Ausgewählte Eigenschaft: {selectedProperty}
                                </div>
                            )}  
                              {/* {lastResult && (
                                  <div className="comparison-result">
                                    {lastSelectedProperty}<br/>
                                    {lastPlayerValue} vs {lastComputerValue}<br/>
                                    {lastResult}
                                </div>
                            )} */}
                            </div>
                            <div className="computer-cards">
                                <div className="card-count">Sathoshi - Card: {computerCards.length}</div>
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
