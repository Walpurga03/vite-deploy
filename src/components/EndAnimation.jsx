import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/EndAnimation.css';

const EndAnimation = ({ playerWon }) => {
  const containerRef = useRef(null);
  const message = playerWon ? "You Win!" : "You Lose!";
  const messageColor = playerWon ? "#fff" : "#fff";
  const backgroundColor = playerWon ? "#4CAF50" : "#e80202"; // Grün für Gewinn, Rot für Verlust


  useEffect(() => {
 
    const container = containerRef.current;
    const blockColorClass = playerWon ? 'block-green' : 'block-red'; // Bestimmen der Klasse basierend auf playerWon

    for (let i = 0; i <= 100; i++) {
        const blocks = document.createElement('div');
        blocks.classList.add('block', blockColorClass);
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
  }, []);

  return (
    <div className='endAnimBody' ref={containerRef} style={{ background: backgroundColor }}>
      <h2 style={{ color: messageColor }}><span>Monay Wars<br></br></span>{message}</h2>
    </div>
  );
};

export default EndAnimation;
