import React, { useState } from 'react';
import { FaBars, FaChevronDown } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Restaurants', path: '/restaurants' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `${isActive ? 'font-bold text-purple-700' : ''} text-sm font-medium text-purple-600 hover:text-purple-700 transition duration-300`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="relative group">
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700 transition duration-300 flex items-center">
                More <FaChevronDown className="ml-1" />
              </button>
              <div className="absolute z-10 w-48 bg-white shadow-lg rounded-md mt-2 py-2 hidden group-hover:block">
                <NavLink
                  to="/faq"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 ${
                      isActive ? 'font-bold' : ''
                    }`
                  }
                >
                  FAQ
                </NavLink>
                <NavLink
                  to="/terms"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 ${
                      isActive ? 'font-bold' : ''
                    }`
                  }
                >
                  Terms of Service
                </NavLink>
                <NavLink
                  to="/privacy"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 ${
                      isActive ? 'font-bold' : ''
                    }`
                  }
                >
                  Privacy Policy
                </NavLink>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-purple-600 hover:text-purple-700 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Login Button */}
          <div className="hidden sm:flex">
            <NavLink
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition duration-300"
            >
              Login
            </NavLink>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="sm:hidden mt-2 space-y-1">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm font-medium ${
                    isActive
                      ? 'text-purple-700 font-bold'
                      : 'text-purple-600 hover:text-purple-700'
                  } transition duration-300`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `block px-4 py-2 text-sm font-medium ${
                  isActive
                    ? 'text-purple-700 font-bold'
                    : 'text-purple-600 hover:text-purple-700'
                } transition duration-300`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                `block px-4 py-2 text-sm font-medium ${
                  isActive
                    ? 'text-purple-700 font-bold'
                    : 'text-purple-600 hover:text-purple-700'
                } transition duration-300`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Terms of Service
            </NavLink>
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `block px-4 py-2 text-sm font-medium ${
                  isActive
                    ? 'text-purple-700 font-bold'
                    : 'text-purple-600 hover:text-purple-700'
                } transition duration-300`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/login"
              className="block px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
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