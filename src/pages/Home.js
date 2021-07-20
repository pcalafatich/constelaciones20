import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './../context/AuthContext';
import GradientLink from '../components/common/GradientLink';
import GradientBar from './../components/common/GradientBar';
import logo from './../images/logo.png';
import homeimg from './../images/constelaciones-home.jpg';

const Home = () => {
  const auth = useContext(AuthContext);

  return (
    <>
      <GradientBar />
      <div className="w-full top-0 bg-white px-10 py-5">
        <div className="flex justify-between">
          <img
            className="w-56 h-full"
            src={logo}
            alt="Logo"
          />
          <div className="flex items-center">
            <Link
              to="/signup"
              className="text-blue-700 mr-6"
            >
              Registrarse
            </Link>
            <GradientLink
              to={
                auth.isAuthenticated()
                  ? '/dashboard'
                  : '/login'
              }
              text="Ingresar"
            />
          </div>
        </div>
      </div>
      <div className="h-full bg-blue-900">
        <div className="opacity-60">
          <img
            className="object-fill w-screen"
            src={homeimg}
            alt="Home"
            
          />
        </div>
        <div className="absolute left-0 top-0 mt-32 lg:mt-48 px-12 nato-sans">
          <div className="w-full lg:w-2/3">
            <h1 className="text-gray-200 text-2xl lg:text-6xl sm:text-5xl font-bold leading-tight">
              Constelaciones Familiares
            </h1>
            <p className="text-gray-400 text-md sm:text-2xl sm:mt-10 mt-4">
            Una técnica psicológica sistémica, que permite activar la Fuerza de la Vida, de Amor y de Sanación de la familia, mediante la resolución de conflictos que se transmitieron inconscientemente de generación tras generación, de la misma manera que la información genética.
            </p>
            <div className="mt-4 sm:mt-10 w-48">
              <GradientLink
                text="Comenzar"
                size="lg"
                to={
                  auth.isAuthenticated()
                    ? '/dashboard'
                    : '/login'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
