import React from 'react';
import GradientLink from '../components/common/GradientLink';

const FourOFour = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-6xl font-bold text-gray-800 mt-10">
        404
      </h1>
      <h2 className="text-4xl">Página no encontrada</h2>
      <div className="mt-2">
        <GradientLink text="Volver al Inicio" to="/" />
      </div>
    </div>
  );
};

export default FourOFour;
