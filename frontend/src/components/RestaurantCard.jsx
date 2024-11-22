import React from 'react';
import { useUserContext } from '../contexts/userContext';
import { Clock, Star, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate


const RestaurantCard = ({ restaurant }) => {
  const {
    Restaurant_Name,
    OpensAt,
    ClosesAt,
    Restaurant_Image,
    Rating,
    Restaurant_ID, // Assuming you have Restaurant_ID in the data
  } = restaurant;

  const { loggedIn } = useUserContext();

  const navigate = useNavigate(); // Getting navigate function

  const isCurrentlyOpen = (opensAt, closesAt) => {
    const timeToMinutes = (time) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 60 + minutes + seconds / 60; // Convert to minutes
    };
  
    const openingTime = timeToMinutes(opensAt);
    const closingTime = timeToMinutes(closesAt);
  
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60; // Current time in minutes
  
    if (closingTime > openingTime) {
      return currentTime >= openingTime && currentTime < closingTime;
    } else {
      return currentTime >= openingTime || currentTime < closingTime;
    }
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 max-w-sm">
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white
          ${isCurrentlyOpen(OpensAt,ClosesAt) ? 'bg-green-500' : 'bg-red-500'}`}>
          {isCurrentlyOpen(OpensAt,ClosesAt) ? 'Open Now' : 'Closed'}
        </span>
      </div>

      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
        <img
          src={Restaurant_Image}
          alt={Restaurant_Name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">{Rating}</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
          {Restaurant_Name}
        </h2>

        <div className="flex items-center text-gray-600 space-x-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm ml-2">
            {OpensAt} - {ClosesAt}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="inline-flex items-center">
            <span className={`w-2 h-2 rounded-full ${isCurrentlyOpen(OpensAt, ClosesAt) ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
            Available for delivery
          </span>
        </div>

        <button
          // disabled={!loggedIn}
          onClick={() => navigate(`/menu/${restaurant.Restaurant_Name}/${restaurant.Restaurant_id}`)} // Navigate to the menu page
          className="w-full py-3 px-4 flex items-center justify-center space-x-2 rounded-lg transition-colors duration-200 bg-purple-600 
                 hover:bg-purple-700 text-white" 
        >
          <Utensils className="w-4 h-4" />
          <span className="font-medium">View Menu</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
