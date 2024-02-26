import React, { useState, useEffect } from 'react';

const useColor = () => {
  const colors = ['#ED274A', '#6699ff', '#FF620A', '#27AE60', '#3454D1', '#EB5757'];

  const [randomColor, setRandomColor] = useState(null);

  useEffect(() => {
    // Função para gerar uma cor aleatória
    const getRandomColor = () => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    };

    // Define a cor aleatória inicial
    setRandomColor(getRandomColor());
  }, [colors]);

  // Retorna a cor aleatória
  return randomColor;
};

export default useColor;
