import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import { useUserContext } from "../contexts/userContext";
import Cart from "../components/Cart";

const Restaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loggedIn } = useUserContext();

  const getRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/restaurants', { withCredentials: true });

      if (Array.isArray(response.data)) {
        setRestaurantData(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
        setRestaurantData([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      if (error.response?.data?.message === 'Access Denied') {
        alert('Kindly login to view the restaurants');
      }
      setRestaurantData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      getRestaurants();
    } else {
      setRestaurantData([]);
      setIsLoading(false);
    }
  }, [loggedIn]);

  return (
    <div className="relative bg-purple-50 min-h-screen">
      {/* Main Content Area */}
      <div className={`w-full ${loggedIn ? 'lg:pr-80' : ''} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-700 mb-8 md:mb-12">
            Explore Restaurants
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : restaurantData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-xl text-gray-600">
                {loggedIn 
                  ? "No restaurants found. Please check back later."
                  : "Please login to view restaurants."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
              {restaurantData.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.restaurant_id} 
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Cart Section */}
      {loggedIn && <Cart/>}
    </div>
  );
};

export default Restaurants;