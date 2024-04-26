import React, { useEffect, useRef } from 'react';


const BackgroundMusic = ({ src, playing }) => {
    const audioRef = useRef(null);
  
    useEffect(() => {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }, [playing]);
  
    return (
      <audio ref={audioRef} src={src} loop />
    );
  };
  
  export default BackgroundMusic;