import React, { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaChevronDown,
  FaUserCircle,
  FaPencilAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import { useCartContext } from "../contexts/cartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null); // Ref to handle outside click
  const { loggedIn, signout, userData, setUserData } = useUserContext();
  const { cartCount } = useCartContext();
  const [viewProfile, setViewProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // State for handling editable inputs
  const [updatedDetails, setUpdated] = useState({
    User_id: 0,
    User_name: "",
    Email_address: "",
    phone_no: "",
    role: "",
  });

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setUpdated((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  useEffect(() => {
    if (userData) {
      setUpdated({
        User_id: userData.User_id,
        User_name: userData.User_name,
        Email_address: userData.Email_address,
        phone_no: userData.phone_no,
        role: userData.role,
      });
    }
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const signItOut = (e) => {
    if (cartCount === 0) {
      localStorage.removeItem(`${userData.User_id}_cart`);
    }
    e.preventDefault();
    try {
      signout();
    } catch (err) {
      console.log(err);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Restaurants", path: "/restaurants" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  if (!loggedIn || userData?.role === "Restaurant_Owner") {
    const index = navItems.findIndex((item) => item.label === "Restaurants");
    if (index !== -1) {
      navItems.splice(index, 1);
    }
  }
  if (loggedIn && userData?.role === "Restaurant_Owner") {
    navItems.push({ label: "Owned", path: "/ownedRestaurants" });
  }

  // Save updates
  const handleSave = () => {  
    setUserData(updatedDetails);
    console.log('Context data',userData);
    setEditMode(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="images/logo.png"
              alt="FoodGO Logo"
              className="h-8 w-auto"
            />
            <h2 className="text-2xl font-bold text-purple-600">FoodGO</h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive ? "font-bold text-purple-700" : ""
                  } text-sm font-medium text-purple-600 hover:text-purple-700 transition duration-300`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <FaUserCircle className="h-8 w-8 text-purple-600" />
                  <span className="text-sm font-medium">
                    {userData.User_name}
                  </span>
                  <FaChevronDown
                    className={`transform ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 mt-2 w-48 bg-purple-600 border border-purple-600 rounded-md shadow-lg z-10"
                  >
                    <button
                      className="block px-4 py-2 text-sm text-white hover:bg-purple-800"
                      onClick={() => setViewProfile(true)}
                    >
                      View Profile
                    </button>
                    <button
                      to="/past-orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-purple-800"
                    >
                      View Past Orders
                    </button>
                    <button
                      to="/track-order"
                      className="block px-4 py-2 text-sm text-white hover:bg-purple-800"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={signItOut}
                      className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-purple-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition duration-300"
              >
                Login
              </NavLink>
            )}
          </div>

          {viewProfile && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    
    <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">

    <button
        className="absolute top-4  text-purple-600 hover:text-purple-800 text-xl"
        onClick={() => setViewProfile(false)} // Toggle edit mode
      >
       X
      </button>

      {/* Pencil Icon to Edit */}
      <button
        className="absolute top-4 right-2 text-purple-600 hover:text-purple-800 text-xl"
        onClick={() => setEditMode(!editMode)} // Toggle edit mode
      >
        <FaPencilAlt />
      </button>

      <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
        Your Profile
      </h2>

      {/* Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name ="User_name"
            value={updatedDetails.User_name}
            onChange={handleDetailChange}
            readOnly={!editMode}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="flex items-center">
          <input
            type="email"
            name="Email_address"
            value={updatedDetails.Email_address}
            onChange={handleDetailChange}
            readOnly={!editMode}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name="phone_no"
            value={updatedDetails.phone_no}
            onChange={handleDetailChange}
            readOnly={!editMode}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-4">
        <button
          onClick={() => console.log("Change Password Clicked")}
          className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
        >
          Change Password
        </button>
      </div>

      {/* Save Button */}
      {editMode && (
        <div className="mb-4">
          <button
            onClick={handleSave}
            className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  </div>
)}

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-purple-600 hover:text-purple-700 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden mt-2 space-y-1">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "text-purple-700 font-bold"
                        : "text-purple-600 hover:text-purple-700"
                    } transition duration-300`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
