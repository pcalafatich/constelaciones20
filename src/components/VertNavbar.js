import React from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FiguraDropdown from './FiguraDropdown';
import logo from './../images/logo.png';


const VertNavbar = () => {
// const auth = useContext(AuthContext);
// const { role } = auth.authState.userInfo;
 return (
  <section className="h-screen">
     {/* LOGO SIDEBAR  */}
     <div className="w-48 sm:w-48 m-auto">
       <img src={logo} rel="logo" alt="Logo" />
     </div>
     {/* FIN LOGO SIDEBAR  */}

     {/* ITEMS BOTONERA  */}
     <div className="mt-20">
             <FiguraDropdown />
     </div>
     {/* FIN BOTONERA  */}
    
     
  </section>
    );
};

export default VertNavbar;