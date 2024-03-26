// Importieren der notwendigen Abhängigkeiten von React, Prop-Types, Styles und weiteren Komponenten.
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../styles/Card.css";
import RatingScale from './RatingScale';

// Definition der Card-Komponente mit ihren Props.
const Card = ({ card, onPropertyClick, isClickable, currentLanguage, isPlayerCard, shouldFlip  }) => {
    // Initialisierung des Zustands `isFlipped`, um zu steuern, ob die Karte umgedreht ist.
    // Spielerkarten starten auf der Vorderseite (false), Computerkarten auf der Rückseite (true).
    const [isFlipped, setIsFlipped] = useState(!isPlayerCard);


    // Zustand für die Anzeige des vollständigen Textes
    const [showFullText, setShowFullText] = useState(false); 

    const toggleText = () => {
        setShowFullText(!showFullText);
    };

    // Auswahl des Textes basierend auf der aktuellen Sprache
    const text = currentLanguage === 'DE' ? card.textD : card.textE;

    useEffect(() => {
    }, []); // Nur beim Initialisieren

    useEffect(() => {
    }, [isFlipped]);


    // useEffect Hook, der auf Änderungen von `shouldFlip` und `isPlayerCard` reagiert.
    // Für Computerkarten wird `isFlipped` entsprechend `shouldFlip` gesetzt.
    useEffect(() => {
        if (!isPlayerCard) { 
            setIsFlipped(shouldFlip);
        }
    }, [shouldFlip, isPlayerCard]);

    // Handler für Klicks auf die Karte selbst.
    // Umdrehen der Karte, wenn sie klickbar ist.
   const handleCardClick = () => {
        if (isClickable) {
            setIsFlipped(false);
        }
    };

    // Handler für Klicks auf eine spezifische Eigenschaft der Karte.
    // Ruft `onPropertyClick` auf, wenn die Karte klickbar ist und der Callback definiert ist.
    const handlePropertyClick = (propertyName) => {
        if (isClickable && onPropertyClick) {
            onPropertyClick(propertyName, card[propertyName]);
        }
    };

    // Funktion zum Rendern der Karten-Eigenschaften.
    // Erstellt eine Liste von Eigenschaften, die interaktiv sind, falls die Karte klickbar ist.
   const renderProperties = () => {
        return (
            <ul className='card-ul'>
                <li className='card-li-since' onClick={() => handlePropertyClick('property0')}>{currentLanguage === 'DE' ? card.property1D : card.property1E}: {card.property1}</li>
                <li className='card-li' onClick={() => handlePropertyClick('property2')}>
                <span className="card-li-text">{currentLanguage === 'DE' ? card.property2D : card.property2E}:</span>
                    <div className="property-with-scale">
                        <span>{card.property2}</span>
                        <RatingScale value={card.property2} fillColor="#DE9796"/>
                    </div>
                </li>
                <li className='card-li' onClick={() => handlePropertyClick('property3')}>
                <span className="card-li-text">{currentLanguage === 'DE' ? card.property3D : card.property3E}:</span>
                    <div className="property-with-scale">
                        <span>{card.property3}</span>
                        <RatingScale value={card.property3} fillColor="#CEDBE6"/>
                    </div>
                </li>  
                <li className='card-li' onClick={() => handlePropertyClick('property4')}>
                <span className="card-li-text">{currentLanguage === 'DE' ? card.property4D : card.property4E}:</span>
                    <div className="property-with-scale">
                        <span>{card.property4}</span>
                        <RatingScale value={card.property4} fillColor="#78CBB3"/>
                    </div>
                </li>  
                <li className='card-li' onClick={() => handlePropertyClick('property5')}>
                    <span className="card-li-text">{currentLanguage === 'DE' ? card.property5D : card.property5E}:</span>
                    <div className="property-with-scale">
                        <span>{card.property5}</span>
                        <RatingScale value={card.property5} fillColor="#E3C5B1"/>
                    </div>
                </li>  
            </ul>
        );
    };
    

    // Rendern der Karte mit einer Umdreh-Animation basierend auf `isFlipped`.
    // Beinhaltet zwei Seiten: Vorderseite (mit Bild und Eigenschaften) und Rückseite.
    return (
        <div className="card-container" onClick={handleCardClick}>
            <div className={`card-flip ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="card-front">
                    <img className="card-image" src={card.image} alt="Card" />
                    {renderProperties()}

                    {isPlayerCard && (
                        <div className="card-text">
                    <button onClick={toggleText}>{showFullText ? 'Less' : 'More'}</button>
                    <div className="card-text-bubble">
                        <p className='card-text-p'>{showFullText ? text : `${text.substring(0, 25)}...`}</p>
                    </div>
                        </div>
                    )}

                </div>
                <div className="card-back">
                    <img className="card-image" src={card.backCard} alt="Card Back" />
                </div>
            </div>
        </div>
    );
};

// Definition der erwarteten Prop-Typen für `Card`.
Card.propTypes = {
    shouldFlip: PropTypes.bool,
    card: PropTypes.shape({
        image: PropTypes.string.isRequired,
        property0: PropTypes.number.isRequired,
        property2: PropTypes.number.isRequired,
        property3: PropTypes.number.isRequired,
        property4: PropTypes.number.isRequired,
        property5: PropTypes.number.isRequired,
        textE: PropTypes.string,
        textD: PropTypes.string,
    }).isRequired,
    onPropertyClick: PropTypes.func,
    isClickable: PropTypes.bool
    
};

export default Card;
