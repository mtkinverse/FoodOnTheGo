import React, { useState, useEffect } from "react";
import axios from "axios";
import { Repeat, Store } from "lucide-react";
import RestaurantCard from "../components/RestaurantCard";
import SearchBar from "../components/SearchBar";
import { useUserContext } from "../contexts/userContext";
import Cart from "../components/Cart";

const Restaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loggedIn, userData } = useUserContext();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [orderAgain, setOrderAgain] = useState([]);
  
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

      if(loggedIn){
          const res = await axios.get(`/api/orderAgain/${userData.User_id}`);
          console.log('Order again section ' ,res.data);
          if(res.status === 200) setOrderAgain(res.data);
      }
    } catch (error) {
      setRestaurantData([]);
      setFilteredRestaurants([]);
      setOrderAgain([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Order Again Section */}
        {loggedIn && Array.isArray(orderAgain) && orderAgain.length > 0 && (
          <div className="mb-12 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-center py-6 space-x-3">
              <Repeat className="text-purple-600" size={24} />
              <h2 className="text-3xl font-bold text-gray-800">Order Again</h2>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="grid grid-flow-col auto-cols-max gap-6 pb-4">
                {orderAgain.map((restaurant) => (
                  <div key={restaurant.Restaurant_id}>
                    <RestaurantCard 
                      key={restaurant.Restaurant_id}
                      restaurant={restaurant} 
                      flag = {'Reorder'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Restaurants Section */}
        <div className="bg-white rounded-xl shadow-md p-6 w-[90vw] max-w-7xl">
          
          <div className="py-2">

              <div className="flex items-center justify-center py-6 space-x-3">
                <Store className="text-purple-600" size={34} />
                <h1 className="text-3xl font-bold text-gray-800">All Restaurants</h1>
              </div>
              <SearchBar onSearch={handleSearch} />

          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px] w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center w-full">
              <p className="text-xl text-gray-600">
                No restaurants found. Please try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.Restaurant_id}
                  restaurant={restaurant}
                  flag = {'View Menu'}

                />
              ))}
            </div>
          )}
        </div>
  

        {loggedIn && (
        <div className="fixed bottom-4 right-8 z-50">
          <Cart />
        </div>
      )}
      </div>
  );
};

export default Restaurants;