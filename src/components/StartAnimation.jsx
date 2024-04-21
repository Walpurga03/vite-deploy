import React, { useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/main.scss';

const StartAnimation = ({ onAnimationEnd }) => {
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    useEffect(() => {
        anime.timeline({
            complete: () => {
                setIsAnimationComplete(true); 
                if(onAnimationEnd) onAnimationEnd(); 
            }
        })
        // .add({
        //     targets: '.text span', 
        //     translateY: [-600, 0],
        //     scale: [10, 1],
        //     opacity: [0, 1],
        //     easing: "easeOutExpo",
        //     duration: 1500,
        //     delay: anime.stagger(100),
        // })
        // .add({
        //     targets: '.text span', 
        //     translateX: [0, -1000],
        //     scale: [1, 1],
        //     opacity: [1, 0],
        //     easing: "easeOutExpo",
        //     duration: 1500,
        //     delay: anime.stagger(100),
        // })
        .add({
            targets: '.text span', 
            translateX: [1000, 0],
            scale: [1, 1],
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 1500,
            delay: anime.stagger(100),
        })
        .add({
            targets: '.text span', 
            translateX: [0, 500],
            scale: [1, 50],
            opacity: [1, 0],
            easing: "easeOutExpo",
            duration: 1500,
            delay: anime.stagger(100),
        });
    }, [onAnimationEnd]); 

    const characters = "Money Wars".split("").map((char, index) => (
        <span key={index} style={{display: 'inline-block'}}>
            {char === ' ' ? '\u00A0' : char} {/* Ersetzt Leerzeichen durch ein geschütztes Leerzeichen */}
        </span>
    ));

    return (
        <div className="welcome-animation" style={{display: isAnimationComplete ? 'none' : 'block'}}>
            <section>
                <h2 className='text'>{characters}</h2>
            </section>    
        </div>
    );
};

export default StartAnimation;
