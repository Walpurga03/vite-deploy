import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/EndAnimation.css';
import cardsData from '../data/cardsData';


const EndAnimation = ({ playerWon }) => {
  const containerRef = useRef(null);
  const message = playerWon ? "You Win!" : "You Lose!";
  const messageColor = playerWon ? "#fff" : "#fff";
  const backgroundColor = playerWon ? "#4CAF50" : "#e80202"; // Grün für Gewinn, Rot für Verlust


  useEffect(() => {
    const container = containerRef.current;
    const blockColorClass = playerWon ? 'block-green' : 'block-red'; // Bestimmen der Klasse basierend auf playerWon
  
    for (let i = 0; i < 25; i++) {
        const blocks = document.createElement('div');
        blocks.classList.add('block', blockColorClass);
  
        // Einen Bildindex der Reihe nach auswählen, beginnend mit 0, und wieder von vorne beginnen, wenn das Ende erreicht ist
        const cardIndex = i % cardsData.length;
        const cardImage = cardsData[cardIndex].image;
  
        // Erstellen Sie ein <img> Element für das Bild
        const imgElement = document.createElement('img');
        imgElement.src = cardImage;
        imgElement.style.width = '100%'; // Optional: Bildgröße anpassen
        imgElement.style.height = 'auto'; // Optional: Bildgröße anpassen
  
        // Fügen Sie das <img> Element dem Block hinzu
        blocks.appendChild(imgElement);
  
        container.appendChild(blocks);
    }
  
    // Animation der Blöcke
    const animateBlocks = () => {
      anime({
        targets: container.querySelectorAll('.block'),
        translateX: () => anime.random(-700, 700),
        translateY: () => anime.random(-500, 500),
        scale: () => anime.random(1, 5),
        easing: 'linear',
        duration: 3000,
        delay: anime.stagger(10),
        complete: animateBlocks,
      });
    };
  
    animateBlocks();
  }, [playerWon]); // Der playerWon Zustand wird als Abhängigkeit hinzugefügt, falls sich die Logik je nach Spielergebnis ändert
  
  return (
    <div className='endAnimBody' ref={containerRef} style={{ background: backgroundColor }}>
      <h2 style={{ color: messageColor }}><span>Monay Wars<br></br></span>{message}</h2>
    </div>
  );
};

export default EndAnimation;
