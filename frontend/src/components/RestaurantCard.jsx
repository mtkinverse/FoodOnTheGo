import React from 'react';
import { useUserContext } from '../contexts/userContext';
import { Clock, Star, Utensils, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant,flag }) => {
  const {
    Restaurant_Name,
    OpensAt,
    ClosesAt,
    Restaurant_Image,
    Rating,
    Restaurant_id, 
    Address,
    review_count,
    discount_value
  } = restaurant;

  const { loggedIn } = useUserContext();
  const navigate = useNavigate();

  const isCurrentlyOpen = (opensAt, closesAt) => {
    const timeToMinutes = (time) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 60 + minutes + seconds / 60;
    };
  
    const openingTime = timeToMinutes(opensAt);
    const closingTime = timeToMinutes(closesAt);
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  
    if (closingTime > openingTime) {
      return currentTime >= openingTime && currentTime < closingTime;
    } else {
      return currentTime >= openingTime || currentTime < closingTime;
    }
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 max-w-sm">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discount_value && <span className="px-3 py-1 rounded-full text-sm font-medium text-white bg-purple-500">
          {discount_value} % off
        </span> }
      </div>

      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
        <img
          src={Restaurant_Image}
          alt={Restaurant_Name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />

        {/* Rating badge */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">{Rating}</span>
          <span className="text-sm text-gray-500">({Math.floor(review_count)}+)</span>
        </div>

      </div>

      <div className="p-5 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
          {Restaurant_Name}
        </h2>

        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm ml-2 line-clamp-1">{Address}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm ml-2">
            {OpensAt} - {ClosesAt}
          </span>
        </div>

        <button
          onClick={() => navigate(`/menu/${Restaurant_Name}/${Restaurant_id}`)}
          className="w-full py-3 px-4 flex items-center justify-center space-x-2 rounded-lg transition-colors duration-200 bg-purple-500 
                   hover:bg-purple-600 text-white" 
        >
          <Utensils className="w-4 h-4" />
          {flag === 'View Menu' && <span className="font-medium">View Menu</span>}
          {flag === 'Reorder' && <span className="font-medium">Reorder</span>}

        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;

