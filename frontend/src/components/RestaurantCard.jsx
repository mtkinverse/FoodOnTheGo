import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import {
  Clock,
  Star,
  Gift,
  MapPin,
  Menu,
  Repeat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from "../contexts/alertContext";
import ComplaintLodger from "../popups/ComplaintLodger";
import { usePopUpContext } from "../contexts/popUpContext";

const RestaurantCard = ({ restaurant, flag }) => {
  const {
    Restaurant_Name,
    OpensAt,
    ClosesAt,
    Restaurant_Image,
    Rating,
    Restaurant_id,
    Address,
    review_count,
    discount_value,
  } = restaurant;

  const { loggedIn } = useUserContext();
  const navigate = useNavigate();
  const { setAlert } = useAlertContext();

  const { lodger,setLodger,setComplaint } = usePopUpContext();

  // Function to format time without seconds (e.g., 10:30)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formattedOpensAt = formatTime(OpensAt);
  const formattedClosesAt = formatTime(ClosesAt);

  // Function to check if restaurant is currently open
  const isCurrentlyOpen = (opensAt, closesAt) => {
    const timeToMinutes = (time) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 60 + minutes + seconds / 60;
    };

    const openingTime = timeToMinutes(opensAt);
    const closingTime = timeToMinutes(closesAt);
    const now = new Date();
    const currentTime =
      now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    if (closingTime > openingTime) {
      return currentTime >= openingTime && currentTime < closingTime;
    } else {
      return currentTime >= openingTime || currentTime < closingTime;
    }
  };

  const openStatus = isCurrentlyOpen(OpensAt, ClosesAt);
  const getNextDayName = () => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setHours(10, 30, 0, 0);

    if (today.getHours() >= 10 && today.getMinutes() >= 30) {
      nextDay.setDate(nextDay.getDate() + 1);
    }

    const options = { weekday: "long" };
    return nextDay.toLocaleDateString(undefined, options);
  };


  const nextDayName = getNextDayName();

  const handleMenuButtonClick = () => {
    navigate(`/menu/${Restaurant_Name}/${Restaurant_id}`);
  };

  const lodgeTheComplaint = e => {
    setComplaint(prev => ({...prev,restaurant_id:Restaurant_id}));
    setLodger(true);
  }

  useEffect(()=>{console.log('me ',Restaurant_id);
  },[])

  return (
    <>
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 max-w-sm">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {/* Only show the discount if the restaurant is open */}
          {openStatus && discount_value && (
            <span className="px-3 py-1 rounded-full text-sm font-medium text-white bg-purple-500 flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>{discount_value} % off</span>
            </span>
          )}

          {/* Open/Closed Badge */}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${openStatus ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {openStatus ? "Open Now" : `Closed until ${nextDayName} ${formattedOpensAt}`}
          </span>
        </div>

        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
          <img
            src={Restaurant_Image}
            alt={Restaurant_Name}
            className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 ${!openStatus ? 'blur-sm' : ''}`}
          />
          {loggedIn && 
            <div className="absolute bottom-4 left-2 z-10 flex items-center p-0 bg-red-500 text-white rounded-full">
              <button
                className="size-full rounded-full py-1 px-2 m-0 bg-red-600 hover:bg-red-500 text-sm font-medium"
                onClick={lodgeTheComplaint}
              >
                lodge Complaint
              </button>
            </div>
          }
          {/* Rating badge */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 animate-pulse text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{Rating}</span>
            <span className="text-sm text-gray-500">
              ({Math.floor(review_count)}+)
            </span>
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
              {formattedOpensAt} - {formattedClosesAt}
            </span>
          </div>

          <button
            onClick={handleMenuButtonClick}
            className="w-full py-3 px-4 flex items-center justify-center space-x-3 rounded-lg transition-colors duration-300 bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl"
          >
            {/* For "View Menu" */}
            {flag === "View Menu" && (
              <>
                <Menu className="w-5 h-5" />
                <span className="font-semibold">View Menu</span>
              </>
            )}

            {/* For "Reorder" */}
            {flag === "Reorder" && (
              <>
                <Repeat className="w-5 h-5" />
                <span className="font-semibold">Reorder</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default RestaurantCard;
