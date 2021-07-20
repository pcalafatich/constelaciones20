import React, { useContext } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faAddressCard,
  faMale,
  faCogs,
  faDoorOpen
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import logo from './../images/logo.png';
import { AuthContext } from './../context/AuthContext';

const navItems = [
  {
    label: 'Escritorio',
    path: 'dashboard',
    icon: faChartLine,
    allowedRoles: ['user', 'admin']
  },
    /* LINK DE INGRESO ADMIN PARA CREAR SESION  */
   {
     label: 'Crear Sesion',
     path: 'crearsesion',
     icon: faMale,
     allowedRoles: ['admin']
   },
   /* LINK DE INGRESO USERS PARA SESION ABIERTA  */
   {
    label: 'Ingreso Sesion',
    path: 'constelacion',
    icon: faMale,
    allowedRoles: ['user']
  },
  {
    label: 'Mi cuenta',
    path: 'account',
    icon: faAddressCard,
    allowedRoles: ['user', 'admin']
  },
  {
    label: 'Configuracion',
    path: 'settings',
    icon: faCogs,
    allowedRoles: ['user', 'admin']
  },
  {
    label: 'Usuarios',
    path: 'users',
    icon: faDoorOpen,
    allowedRoles: ['admin']
  }
];

const NavItem = ({ navItem }) => {
  const location = useLocation();
  const isCurrentRoute =
    location.pathname === `/${navItem.path}`;
  const classes = classNames({
    'px-2 sm:px-6 justify-center sm:justify-start py-3 rounded-full flex': true,
    'text-gray-600 hover:text-blue-500 transform hover:translate-x-1 transition ease-in-out duration-100': !isCurrentRoute,
    'bg-gradient text-gray-100 shadow-lg': isCurrentRoute
  });
  return (
    <Link to={navItem.path} className={classes}>
      <div className="flex items-center">
        <div className="mr-0 sm:mr-4">
          <FontAwesomeIcon icon={navItem.icon} />
        </div>
        <span className="hidden sm:block">
          {navItem.label}
        </span>
      </div>
    </Link>
  );
};

const NavItemContainer = ({ children }) => (
  <div>{children}</div>
);

const Sidebar = () => {
  const auth = useContext(AuthContext);
  const { role } = auth.authState.userInfo;
  return (
    <section className="h-screen">
      {/* LOGO SIDEBAR  */}
      <div className="w-48 sm:w-48 m-auto">
        <img src={logo} rel="logo" alt="Logo" />
      </div>
      {/* FIN LOGO SIDEBAR  */}

      {/* ITEMS SIDEBAR  */}
      <div className="mt-20">
        {navItems.map((navItem, i) => (
          <NavItemContainer key={i}>
            {navItem.allowedRoles.includes(role) && (
              <NavItem navItem={navItem} />
            )}
          </NavItemContainer>
        ))}
      </div>
      {/* FIN ITEMS SIDEBAR  */}
     </section>
  );
};

export default Sidebar;
