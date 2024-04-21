// Importieren der notwendigen Abhängigkeiten von React, Prop-Types, Styles und weiteren Komponenten.
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../styles/main.scss";
import RatingScale from './RatingScale';

const Card = ({ card, onPropertyClick, isClickable, isPlayerCard, shouldFlip  }) => {
    const [isFlipped, setIsFlipped] = useState(!isPlayerCard);
    const [showFullText, setShowFullText] = useState(false); 

    const toggleText = () => {
        setShowFullText(!showFullText);
    };

    const text = card.textD;


    useEffect(() => {
    }, [isFlipped]);


    useEffect(() => {
        if (!isPlayerCard) { 
            setIsFlipped(shouldFlip);
        }
    }, [shouldFlip, isPlayerCard]);


   const handleCardClick = () => {
        if (isClickable) {
            setIsFlipped(false);
        }
    };
  
    const handlePropertyClick = (propertyName) => {
        if (isClickable && onPropertyClick) {
            onPropertyClick(propertyName, card[propertyName]);
        }
    };

    function invertSign(value) {
        return -value; // Diese einfache Operation kehrt das Vorzeichen um
    }

   const renderProperties = () => {
        return (
            <ul className='card-ul'>
                <li className='card-li' onClick={() => handlePropertyClick('property1')}>
                <span className="card-li-text">{card.property1D}:</span>
                    <div className="property-with-scale">
                    <span className='card-property1'>{invertSign(card.property1)}</span>
                        {/* <RatingScale value={card.property1} fillColor="#AE5371"/> */}
                    </div>
                </li>
                <li className='card-li' onClick={() => handlePropertyClick('property2')}>
                <span className="card-li-text">{card.property2D}:</span>
                    <div className="property-with-scale">
                        <span>{card.property2}</span>
                        <RatingScale value={card.property2} fillColor="#BE9796"/>
                    </div>
                </li>
                <li className='card-li' onClick={() => handlePropertyClick('property3')}>
                <span className="card-li-text">{card.property3D}:</span>
                    <div className="property-with-scale">
                        <span>{card.property3}</span>
                        <RatingScale value={card.property3} fillColor="#CEDBE6"/>
                    </div>
                </li>  
                <li className='card-li' onClick={() => handlePropertyClick('property4')}>
                <span className="card-li-text">{card.property4D}:</span>
                    <div className="property-with-scale">
                        <span>{card.property4}</span>
                        <RatingScale value={card.property4} fillColor="#78CBB3"/>
                    </div>
                </li>  
                <li className='card-li' onClick={() => handlePropertyClick('property5')}>
                <span className="card-li-text">{card.property5D}:</span>
                    <div className="property-with-scale">
                        <span>{card.property5}</span>
                        <RatingScale value={card.property5} fillColor="#A3C5B1"/>
                    </div>
                </li>  
            </ul>
        );
    };
    
    return (
        <div className="card-container" onClick={handleCardClick}>
            <div className={`card-flip ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="card-front">
                    <img className="card-image" src={card.image} alt="Card" />
                    {renderProperties()}

                    {isPlayerCard && (
                        <div className="card-text">
                    <button className="button" onClick={toggleText}>{showFullText ? 'Weniger' : 'Mehr'}</button>
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

Card.propTypes = {
    shouldFlip: PropTypes.bool,
    card: PropTypes.shape({
        image: PropTypes.string.isRequired,
        property1: PropTypes.number.isRequired,
        property2: PropTypes.number.isRequired,
        property3: PropTypes.number.isRequired,
        property4: PropTypes.number.isRequired,
        property5: PropTypes.number.isRequired,
        textD: PropTypes.string,
    }).isRequired,
    onPropertyClick: PropTypes.func,
    isClickable: PropTypes.bool
    
};

export default Card;
