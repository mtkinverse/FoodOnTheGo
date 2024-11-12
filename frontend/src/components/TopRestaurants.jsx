import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import RestaurantCard from "./RestaurantCard";

const TopRestaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/home');
        if (Array.isArray(response.data)) {
          setRestaurantData(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setRestaurantData([]);
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setRestaurantData([]);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsToShow, restaurantData.length - itemsToShow)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsToShow, 0));
  };

  const visibleRestaurants = restaurantData.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className={`text-indigo-600 p-2 rounded-full bg-gray-200 hover:bg-indigo-400 transition-colors ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft size={24} />
        </button>

        <div className="flex justify-between mt-6">
        {visibleRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.Restaurant_id} restaurant={restaurant} />
        ))}
      </div>
      
        <button
          onClick={handleNext}
          className={`text-indigo-600 p-2 rounded-full bg-gray-200 hover:bg-indigo-400 transition-colors ${currentIndex >= restaurantData.length - itemsToShow ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentIndex >= restaurantData.length - itemsToShow}
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default TopRestaurants;
