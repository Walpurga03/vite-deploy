// Importieren notwendiger Abhängigkeiten und Komponenten
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, compareCardProperties } from '../redux/actions';
import { selectHighestPropertyForComputer } from '../logic/gameLogic';
import infoImage from '/images/info/info.png';

import Card from './Card';
import '../styles/main.scss';
import StartAnimation from './StartAnimation';
import EndAnimation from './EndAnimation';

const GameBoard = () => {

    const togglePropertiesPopup = () => setShowPropertiesPopup(!showPropertiesPopup);
    const { playerCards, computerCards, isGameStarted, isPlayerTurn, lastResult, lastSelectedProperty, lastPlayerValue, lastComputerValue, gameOver } = useSelector(state => state.game);
    const dispatch = useDispatch();
    
    const [resultMessage, setResultMessage] = useState(null);
    const [flipComputerCard, setFlipComputerCard] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [moveCounter, setMoveCounter] = useState(0);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const [isButtonClickable, setIsButtonClickable] = useState(true);
    const [isInfoVisible, setIsInfoVisible] = useState(true);
    const [lastTurn, setLastTurn] = useState('');



    const hideInfo = () => {
        setIsInfoVisible(false);
    };

    const handleAnimationEnd = () => {
        setIsAnimationFinished(true);
    };
    const propertyLabels = {
        property1: "Seit",
        property2: "Knappheit",
        property3: "Langlebigkeit",
        property4: "Teilbarkeit",
        property5: "Transportfähigkeit",
      };
  
    const handleStartGame = () => {
        setSelectedProperty(null)
        dispatch(startGame());
    };

    const handlePropertyClick = (property) => {
        setIsInfoVisible(false);
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
            console.log(`[Spielerzug] ${propertyLabels[property]}->${playerCards[0][property]} vs ${computerCards[0][property]}`);
            setLastTurn(`Letzter Zug: ${propertyLabels[property]}->${playerCards[0][property]} vs ${computerCards[0][property]}`);

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
                    dispatch(compareCardProperties(playerCards[0], computerCards[0], selectedProperty));
                    setResultMessage(null);
                    setSelectedProperty(null);
                    setIsButtonClickable(true);
                    console.log(`[Computer Zug] ${propertyLabels[selectedProperty]}->${playerCards[0][selectedProperty]} vs ${computerCards[0][selectedProperty]}`);
                    setLastTurn(`Letzter Zug: ${propertyLabels[selectedProperty]}->${playerCards[0][selectedProperty]} vs ${computerCards[0][selectedProperty]}`);
                }, 500);
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

    function invertSign(value) {
        return -value; // Diese einfache Operation kehrt das Vorzeichen um
    }
    
      
    return (
        <>
             {gameOver ? (
                 <EndAnimation playerWon={playerCards.length > 0} />
            ) : (
                <>
                 {lastTurn && (
                    <div className="last-turn" data-last-turn={lastTurn}></div>
                )}
                    {isGameStarted ? (
                        <div className="game-container">
                            <div className="player-cards">
                                <div className="card-count">Spieler  {playerCards.length}</div>
                                {playerCards.length > 0 && 
                                    <Card 
                                    card={playerCards[0]} 
                                    onPropertyClick={handlePropertyClick}
                                    isClickable={isPlayerTurn} 
                                    className={!isPlayerTurn ? 'card-disabled' : ''}
                                    isPlayerCard={true}
                                    /> 
                                }
                            </div>
                            <div className='info-box'>
                                {isInfoVisible && (
                                    <div className="info-image-container" onClick={hideInfo}>
                                        <img src={infoImage} alt="Wähle deine Stärke!" />
                                    </div>
                                )}
                            </div>
                            <div className='result'>
                                <div className={`button-container ${isPlayerTurn ? 'hidden-button' : 'visible-button'}`}>
                                {!isPlayerTurn && !resultMessage && (
                                    <button className="button satoshi-button" onClick={handleComputerTurn} disabled={!isButtonClickable}>Satoshi-Auswahl</button>
                                    )}
                                </div>  
                                {selectedProperty && resultMessage && (
                                    <div className={`selected-property ${resultMessage.playerValue > resultMessage.computerValue ? 'result-win' : resultMessage.playerValue < resultMessage.computerValue ? 'result-lose' : 'result-draw'}`}>
                                         {resultMessage.playerValue > resultMessage.computerValue ? (
                                            <p className="result-highlight">YOU WIN!</p>
                                        ) : resultMessage.playerValue < resultMessage.computerValue ? (
                                            <p className="result-highlight">YOU LOSE!</p>
                                        ) : (
                                            <p className="result-highlight">DRAW!</p>
                                        )}
                                        <p>{propertyLabels[selectedProperty] || "Keine Eigenschaft ausgewählt"}</p>
                                        <p> 
                                            {selectedProperty === 'property1' ? invertSign(resultMessage.playerValue) : resultMessage.playerValue}
                                             {" "}vs{" "}
                                            {selectedProperty === 'property1' ? invertSign(resultMessage.computerValue) : resultMessage.computerValue}
                                        </p>
                                       
                                    </div>
                                )}

                            </div>
                            <div className="computer-cards">
                                <div className="card-count">Satoshi {computerCards.length}</div>
                                {computerCards.length > 0 && 
                                    <Card 
                                    card={computerCards[0]}
                                    shouldFlip={flipComputerCard}
                                    isClickable={false} 
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
                                <div className="background">
                                    <div className='start-button-container'>
                                        <button className="button" onClick={handleStartGame}>Spiel Starten</button>
                                    </div>
                                </div>
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
