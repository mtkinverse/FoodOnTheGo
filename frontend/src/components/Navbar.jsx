import React, { useState } from 'react';
import { FaShoppingCart, FaSearch, FaUtensils, FaBars } from 'react-icons/fa'; // Added FaBars for mobile menu
import { NavLink} from 'react-router-dom'; // Assuming you use React Router
import Logo from "./Logo";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const commonClass = 'text-sm hover:text-red-700 hover:border-b border-red-700 hover:duration-500 hover:ease-in-out relative text-red-600';
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex sm:space-x-8">
            <NavLink
              to="/"
              className={({isActive}) => isActive ? 'font-bold text-red-700' + commonClass : 'text-red-600 font-medium' + commonClass}
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-all duration-300 ease-in-out transform scale-x-0 origin-left group-hover:scale-x-100"></span>
            </NavLink>
            <NavLink
              to="/restaurants"
              className={({isActive}) => isActive ? 'font-bold text-red-700' + commonClass : 'text-red-600 font-medium' + commonClass}
            >
              Restaurants
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-all duration-300 ease-in-out transform scale-x-0 origin-left group-hover:scale-x-100"></span>
            </NavLink>
            <NavLink
              to="/about"
              className={({isActive}) => isActive ? 'font-bold text-red-700' + commonClass : 'text-red-600 font-medium' + commonClass}
            >
              About Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-all duration-300 ease-in-out transform scale-x-0 origin-left group-hover:scale-x-100"></span>
            </NavLink>
          </div>

          {/* Mobile Menu Icon */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-red-600 hover:text-red-700 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Login */}
          <div className="hidden sm:flex sm:items-center">
            <NavLink
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              Login
            </NavLink>
          </div>
        </div>

        {/* Mobile Links */}
        {menuOpen && (
          <div className="sm:hidden mt-2 space-y-1">
            <NavLink
              to="/"
              className="block text-red-600 text-sm font-medium hover:text-red-700"
            >
              Home
            </NavLink>
            <NavLink
              to="/restaurants"
              className="block text-red-600 text-sm font-medium hover:text-red-700"
            >
              Restaurants
            </NavLink>
            <NavLink
              to="/about"
              className="block text-red-600 text-sm font-medium hover:text-red-700"
            >
              About Us
            </NavLink>
            <NavLink
              to="/login"
              className="block text-red-600 text-sm font-medium hover:text-red-700"
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;