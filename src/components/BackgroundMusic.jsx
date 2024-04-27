import React, { useEffect, useRef } from 'react';

const BackgroundMusic = ({ src, playing }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    console.log('Audio source set to:', src);
    audioRef.current = new Audio(src);

    return () => {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    };
  }, [src]);

  useEffect(() => {
    console.log('Playing state changed:', playing);
    if (playing) {
      audioRef.current.play().catch(e => console.error('Error playing audio:', e));
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  return null;
};

export default BackgroundMusic;
