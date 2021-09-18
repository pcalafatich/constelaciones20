import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './../context/AuthContext';
import GradientLink from '../components/common/GradientLink';
import GradientBar from './../components/common/GradientBar';
import logo from './../images/logo.png';


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
            to="/sobremi"
            className="text-blue-700 mr-6"
            >
            Sobre Mí
          </Link>
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
      


      <div className="flex justify-evenly h-full overflow-hidden">

        <div className="w-1/3 overflow-hidden xl:w-1/3">
          <p className= "m-auto">Columna 1</p>
        </div>

        <div className="w-1/3 overflow-hidden xl:w-1/3">
         <p>Columna 2</p>
        </div>

        <div className="w-1/3 overflow-hidden xl:w-1/3">
         <p>Columna 3</p>
        </div>

      </div>


     </>
  );
};

export default Home;
