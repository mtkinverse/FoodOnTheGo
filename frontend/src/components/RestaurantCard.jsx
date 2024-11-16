import React from 'react';
import { FaStar, FaClock, FaUtensils } from 'react-icons/fa';
import { useUserContext } from '../contexts/userContext';

const RestaurantCard = ({ restaurant }) => {
  const {
    Restaurant_Name,
    OpensAt,
    ClosesAt,
    Restaurant_Image,
    Rating,
  } = restaurant;

  const {loggedIn} = useUserContext();
  
  return (
    <div className="restaurant-card bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105 duration-300">
      {/* Restaurant Image */}
      <img
        src={Restaurant_Image}
        alt={Restaurant_Name}
        className="w-full h-64 object-cover rounded-t-lg"
      />
      <div className="p-5">
        {/* Restaurant Name */}
        <h2 className="text-2xl font-semibold text-purple-600 mb-3">{Restaurant_Name}</h2>

        {/* Opening Hours */}
        <div className="flex items-center text-gray-700 mt-2">
          <FaClock className="mr-2 text-purple-500" />
          <p className="font-medium">
            Open: <span className="font-semibold">{OpensAt}</span> -{' '}
            <span className="font-semibold">{ClosesAt}</span>
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <FaStar className="text-yellow-500 mr-1" />
          <p className="text-gray-700 font-medium">{Rating}</p>
        </div>
      </div>

      {/* View Menu Button */}
        <div className="p-4 bg-purple-600 text-white text-center rounded-b-lg hover:bg-purple-700 cursor-pointer transition duration-300">
        <button className="w-full font-semibold flex items-center justify-center space-x-2" disabled={!loggedIn}>
          <FaUtensils className="mr-2" />
          <span>View Menu</span>
        </button>
        </div>
    </div>
  );
};

export default RestaurantCard;
