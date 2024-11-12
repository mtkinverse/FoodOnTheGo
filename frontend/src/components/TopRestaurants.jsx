import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowRight, FaArrowLeft, FaMotorcycle, FaHamburger, FaUtensils, FaStar } from "react-icons/fa";

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
      Math.min(prevIndex + 3, restaurantData.length - itemsToShow)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 3, 0));
  };

  const visibleRestaurants = restaurantData.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className={`text-indigo-600 p-2 rounded-full bg-gray-200 hover:bg-indigo-400 transition-colors ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft size={24} />
        </button>

        <div className="flex justify-center space-x-4 overflow-hidden">
          {visibleRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.restaurant_id}
              className="w-80 bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out"
            >
              <img
                src={restaurant.image_url}
                alt={restaurant.restaurant_name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-red-600">{restaurant.restaurant_name}</h3>
                <p className="flex items-center text-gray-600 mt-1">
                  {restaurant.food_type === "fastfood" ? (
                    <FaHamburger className="mr-2 text-yellow-500" />
                  ) : (
                    <FaUtensils className="mr-2 text-green-500" />
                  )}
                  {restaurant.food_type.charAt(0).toUpperCase() + restaurant.food_type.slice(1)}
                </p>
                
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < restaurant.rating ? "text-yellow-500" : "text-gray-300"} 
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{restaurant.rating}</span>
                </div>

                <p className="flex items-center text-gray-600 mt-2">
                  <FaMotorcycle className="mr-2 text-red-500" />
                  Delivery Charges: {restaurant.delivery_charges}
                </p>
              </div>

              {restaurant.best_seller && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  Best Seller
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className={`text-indigo-600 p-2 rounded-full bg-gray-200 hover:bg-indigo-400 transition-colors ${
            currentIndex >= restaurantData.length - itemsToShow ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentIndex >= restaurantData.length - itemsToShow}
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default TopRestaurants;