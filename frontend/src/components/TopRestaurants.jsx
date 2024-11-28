import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RestaurantCard from "./RestaurantCard";

const TopRestaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responsive items to show based on screen size
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;      // Mobile
      if (window.innerWidth < 1024) return 2;     // Tablet
      return 3;                                   // Desktop
    }
    return 3;
  };

  const [itemsToShow, setItemsToShow] = useState(getItemsToShow());
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setItemsToShow(getItemsToShow());
      // Adjust currentIndex if needed when screen size changes
      setCurrentIndex(prev => 
        Math.min(prev, Math.max(0, restaurantData.length - getItemsToShow()))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [restaurantData.length]);

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
    if (isMobile) {
      // On mobile, move one item at a time
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + 1, restaurantData.length - 1)
      );
    } else {
      // On desktop/tablet, move by itemsToShow
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + itemsToShow, restaurantData.length - itemsToShow)
      );
    }
  };

  const handlePrev = () => {
    if (isMobile) {
      // On mobile, move one item at a time
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else {
      // On desktop/tablet, move by itemsToShow
      setCurrentIndex((prevIndex) => 
        Math.max(prevIndex - itemsToShow, 0)
      );
    }
  };

  const visibleRestaurants = restaurantData.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  // Calculate total slides based on screen size
  const totalSlides = isMobile 
    ? restaurantData.length 
    : Math.ceil(restaurantData.length / itemsToShow);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
      {/* Title and Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Top Restaurants</h2>
        <div className="flex items-center space-x-2">
          {/* Navigation Dots */}
          <div className="hidden md:flex items-center space-x-1 mr-4">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(isMobile ? idx : idx * itemsToShow)}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                  ${(isMobile ? currentIndex : Math.floor(currentIndex / itemsToShow)) === idx 
                    ? 'w-6 bg-indigo-600' 
                    : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Arrow Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full border transition-all duration-300
                ${currentIndex === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={isMobile 
                ? currentIndex >= restaurantData.length - 1 
                : currentIndex >= restaurantData.length - itemsToShow}
              className={`p-2 rounded-full border transition-all duration-300
                ${(isMobile 
                  ? currentIndex >= restaurantData.length - 1 
                  : currentIndex >= restaurantData.length - itemsToShow)
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / (isMobile ? restaurantData.length : itemsToShow))}%)`,
            width: `${(restaurantData.length / (isMobile ? 1 : itemsToShow)) * 100}%`
          }}
        >
          {restaurantData.map((restaurant) => (
            <div
              key={restaurant.Restaurant_id}
              className="px-2"
              style={{ width: `${100 / (isMobile ? restaurantData.length : restaurantData.length)}%` }}
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="mt-6 flex md:hidden justify-center space-x-1">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(isMobile ? idx : idx * itemsToShow)}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${(isMobile ? currentIndex : Math.floor(currentIndex / itemsToShow)) === idx 
                ? 'w-6 bg-indigo-600' 
                : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopRestaurants;

