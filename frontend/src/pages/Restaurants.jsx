
import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import SearchBar from "../components/SearchBar";
import { useUserContext } from "../contexts/userContext";
import Cart from "../components/Cart";

const Restaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loggedIn } = useUserContext();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const handleSearch = (term) => {
    if (term.trim() === "") {
      setFilteredRestaurants(restaurantData);
    } else {
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
      const data = Array.isArray(response.data) ? response.data : [];
      setRestaurantData(data);
      setFilteredRestaurants(data);
    } catch (error) {
      setRestaurantData([]);
      setFilteredRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-8">
          All restaurants
        </h1>

        <SearchBar onSearch={handleSearch} />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">
              No restaurants found. Please try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
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

