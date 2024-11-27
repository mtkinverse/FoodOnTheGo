'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import { useUserContext } from "../contexts/userContext";
import Cart from "../components/Cart";
import SearchBar from "../components/SearchBar";

const Restaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loggedIn } = useUserContext();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  
    if (term.trim() === "") {
      // Reset to show all restaurants when search is cleared
      setFilteredRestaurants(restaurantData);
    } else {
      // Filter restaurants based on the search term
      const filtered = restaurantData.filter((restaurant) =>
        restaurant.Restaurant_Name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  };
  

  const getRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/restaurants");

      if (Array.isArray(response.data)) {
        setRestaurantData(response.data);
        setFilteredRestaurants(response.data); // Initialize filtered restaurants
      } else {
        setRestaurantData([]);
      }
    } catch (error) {
      setRestaurantData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRestaurants(restaurantData);
    }
  }, [restaurantData, searchTerm]);

  const displayRestaurants = filteredRestaurants;

  return (
    <main className="flex-grow bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-12">
          Explore Restaurants
        </h1>

        <SearchBar onSearch={handleSearch} />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : displayRestaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
            <p className="text-xl text-gray-600">
              No restaurants found. Please try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-12">
            {displayRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.restaurant_id}
                restaurant={restaurant}
              />
            ))}
          </div>
        )}
      </div>

      {loggedIn && <Cart />}
    </main>
  );
};

export default Restaurants;
