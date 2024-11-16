import React, { useState, useEffect} from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import { useUserContext } from "../contexts/userContext";

const Restaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const {loggedIn} = useUserContext()

  const getRestaurants = async () => {
    try {
      
      const response = await axios.get('/api/restaurants',{withCredentials : true}); // Ensure the correct path is used

      if (Array.isArray(response.data)) {
        setRestaurantData(response.data);
      } else {
        console.error("Expected an array but got:");
        setRestaurantData([]);
      }
      
    } catch (error) {
      
      console.error('Error fetching restaurants:', error);
      if(error.response.data.message === 'Access Denied') alert('Kindly login to view the restaurants');
      
      setRestaurantData([]);

    }

  };

  useEffect(() => {
    if(loggedIn) getRestaurants();
    else setRestaurantData([]);
  }, [loggedIn]);

  return (
    <div className="bg-purple-50 min-h-screen py-10">
      <h1 className="text-5xl font-bold text-center text-purple-700 mb-12">Explore Restaurants</h1>

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
