import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import RestaurantCard from "./RestaurantCard";

const TopRestaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/home');
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
      Math.min(prevIndex + 1, restaurantData.length - itemsToShow)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const visibleRestaurants = restaurantData.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-10">
      {/* Carousel Wrapper */}
      <div className="flex items-center justify-between space-x-4">

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className={`text-white p-4 rounded-full bg-purple-600 hover:bg-purple-700 transition duration-300 ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft size={24} />
        </button>

        {/* Carousel Items */}
        <div className="flex overflow-hidden w-full">
          <div className="flex space-x-4 transition-all duration-500 ease-in-out transform">
            {visibleRestaurants.map((restaurant) => (
              <div key={restaurant.Restaurant_id} className="w-full sm:w-1/3 lg:w-1/4 xl:w-1/3">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className={`text-white p-4 rounded-full bg-purple-600 hover:bg-purple-700 transition duration-300 ${
            currentIndex >= restaurantData.length - itemsToShow ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentIndex >= restaurantData.length - itemsToShow}
        >
          <FaArrowRight size={24} />
        </button>
      </div>

      {/* Carousel Navigation */}
      <div className="mt-4 flex justify-center space-x-2">
        {restaurantData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 bg-purple-600 rounded-full ${
              currentIndex === idx ? 'bg-purple-900' : 'opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopRestaurants;
