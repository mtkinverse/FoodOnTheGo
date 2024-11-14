import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

const Restaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);

  const getRestaurants = async () => {
    try {
      console.log('sending request');
      const response = await axios.get('/api/restaurants'); // Ensure the correct path is used
      if (Array.isArray(response.data)) {
        setRestaurantData(response.data);
      } else {
        console.error("Expected an array but got:");
        setRestaurantData([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurantData([]);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div className="bg-purple-50 min-h-screen py-10">
      <h1 className="text-5xl font-bold text-center text-purple-700 mb-12">Explore Restaurants</h1>

      {/* Loading or No Data State */}
      {restaurantData.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No restaurants found. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
          {restaurantData.map((restaurant) => (
            <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
