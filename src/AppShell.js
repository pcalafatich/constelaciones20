import React from 'react';
import GradientBar from './components/common/GradientBar';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

/* 
Estructura del layout del admin
Sdebar + MainPanel

*/




const AppShell = ({ children }) => {
  return (
    <>
      <GradientBar />
      <div className="flex">
        {/* SIDEBAR */}
        <div className="sm:w-64 px-4 sm:px-8 pt-6 bg-white">
          <Sidebar />
        </div>
        {/* FIN SIDEBAR */}

        {/* MAIN */}
        <div className="flex flex-col w-full border-l border-gray-200">
          <div className="p-4 border-b border-gray-300 bg-white">
            <Navbar />
          </div>
          {/* PAGE */}
          <div className="px-4 sm:px-8 py-2 bg-gray-100">
            {children}
          </div>
          {/* FOOTER */}
          <Footer />
        </div>
        {/* FIN PAGE */}

        {/* FIN MAIN */}
      </div>
    </>
  );
};

export default AppShell;
