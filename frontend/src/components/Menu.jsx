import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaCartPlus, FaHeart, FaUtensils } from "react-icons/fa";
import { useUserContext } from "../contexts/userContext";
import { useCartContext } from "../contexts/cartContext";
import Cart from "./Cart";

const Menu = () => {
  const { restaurant_name, restaurant_id } = useParams();
  const navigate = useNavigate();
  const { loggedIn, userData } = useUserContext();
  const { handleAddToCart } = useCartContext(userData.User_id);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`/api/menu/${restaurant_id}`);
        const menuItems = response.data;
        const updatedMenuItems = menuItems.map(item => ({
          ...item,
          restaurant_name: restaurant_name
        }));
        setMenuItems(updatedMenuItems);
      } catch (err) {
        setError("Failed to fetch menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurant_id, restaurant_name, navigate]);

  const categories = ["All", ...new Set(menuItems.map(item => item.Cuisine))];
  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.Cuisine === selectedCategory);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="animate-pulse text-purple-600 text-2xl">Loading menu...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen text-red-600">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaUtensils className="text-purple-600 text-2xl" />
              <h1 className="text-2xl md:text-3xl font-bold text-purple-900">
                {restaurant_name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto overflow-x:hidden px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.menu_id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={item.Item_image}
                  alt={item.Dish_Name}
                  className="w-full h-48 object-cover"
                />
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm 
                           hover:bg-white transition-colors duration-300"
                >
                  <FaHeart className="w-5 h-5 text-purple-600 hover:text-purple-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  {item.Dish_Name}
                </h3>
                <p className="text-sm text-purple-600 mb-3">{item.Cuisine}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-purple-700">
                    Rs.{item.Item_Price}
                  </span>
                  <button
                    disabled={!loggedIn}
                    onClick={() => handleAddToCart(item)}
                    className={`flex items-center space-x-2 px-4 py-2 
                      ${!loggedIn ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                      text-white rounded-lg transition-colors duration-300`}
                    
                  >
                    <FaCartPlus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Component */}
      {loggedIn && <div className="fixed bottom-0 right-0 m-4 z-20">
        <Cart />
      </div> }
    </div>
     
  );
};

export default Menu;