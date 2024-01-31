import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../styles/Card.css";
import RatingScale from './RatingScale';

const Card = ({ card, onPropertyClick, isClickable, currentLanguage, isPlayerCard }) => {
    const [isFlipped, setIsFlipped] = useState(!isPlayerCard);

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

    const renderProperties = () => {
        return (
            <ul className='card-ul'>
                <li onClick={() => handlePropertyClick('property0')}>{currentLanguage === 'DE' ? card.property1D : card.property1E}: {card.property1}</li>
                <li className='card-li' onClick={() => handlePropertyClick('property2')}>{currentLanguage === 'DE' ? card.property2D : card.property2E}: {card.property2}<RatingScale value={card.property2} fillColor="#DE9796"/></li>
                <li className='card-li' onClick={() => handlePropertyClick('property3')}>{currentLanguage === 'DE' ? card.property3D : card.property3E}: {card.property3}<RatingScale value={card.property3} fillColor="#CEDBE6"/></li>
                <li className='card-li' onClick={() => handlePropertyClick('property4')}>{currentLanguage === 'DE' ? card.property4D : card.property4E}: {card.property4}<RatingScale value={card.property4} fillColor="#78CBB3"/></li>
                <li className='card-li' onClick={() => handlePropertyClick('property5')}>{currentLanguage === 'DE' ? card.property5D : card.property5E}: {card.property5}<RatingScale value={card.property5} fillColor="#E3C5B1"/></li>
            </ul>
        );
    };
    

    return (
        <div className="card-container" onClick={handleCardClick}>
            <div className={`card-flip ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="card-front">
                    {/* Vorderseite der Karte */}
                    <img className="card-image" src={card.image} alt="Card" />
                    {renderProperties()}
                </div>
                <div className="card-back">
                    {/* Rückseite der Karte */}
                    <img className="card-image" src={card.backCard} alt="Card Back" />
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    card: PropTypes.shape({
        image: PropTypes.string.isRequired,
        property0: PropTypes.number.isRequired,
        property2: PropTypes.number.isRequired,
        property3: PropTypes.number.isRequired,
        property4: PropTypes.number.isRequired,
        property5: PropTypes.number.isRequired,
    }).isRequired,
    onPropertyClick: PropTypes.func,
    isClickable: PropTypes.bool
};

export default Card;
