import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import Logo from "./Logo";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const commonClass = 'text-sm font-medium text-red-600 hover:text-red-700 transition duration-300';

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
            {['Home', 'Restaurants', 'About Us'].map((item, idx) => (
              <NavLink
                key={idx}
                to={`/${item.toLowerCase().replace(' ', '')}`}
                className={({ isActive }) =>
                  `${isActive ? 'font-bold text-red-700 ' : ''}${commonClass}`
                }
              >
                {item}
              </NavLink>
            ))}
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

          {/* Desktop Login Button */}
          <div className="hidden sm:flex">
            <NavLink
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-150"
            >
              Login
            </NavLink>
          </div>
        </div>

        {/* Mobile Links */}
        {menuOpen && (
          <div className="sm:hidden mt-2 space-y-1">
            {['Home', 'Restaurants', 'About Us', 'Login'].map((item, idx) => (
              <NavLink
                key={idx}
                to={`/${item.toLowerCase().replace(' ', '')}`}
                className="block text-red-600 text-sm font-medium hover:text-red-700 px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
