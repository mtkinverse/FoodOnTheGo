import React, { useState, useEffect } from "react";
import { FaStar, FaInfoCircle, FaSearch, FaPlus, FaTag } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCartContext } from "../contexts/cartContext";
import { useUserContext } from "../contexts/userContext";
import { useAlertContext } from "../contexts/alertContext";
import Cart from "./Cart";

const RestaurantMenu = () => {
  const { restaurant_id } = useParams();
  const { setAlert } = useAlertContext();
  const navigate = useNavigate();
  const { loggedIn, userData } = useUserContext();
  const { handleAddToCart } = useCartContext(userData.User_id);

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantResponse = await axios.get(
          `/api/getRestaurant/${restaurant_id}`
        );
        setRestaurant(restaurantResponse.data);

        const menuResponse = await axios.get(`/api/menu/${restaurant_id}`);
        setMenuItems(menuResponse.data);

        const dealsResponse = await axios.get(
          `/api/getPromos/${restaurant_id}`
        );
        setDeals(dealsResponse.data);

        const uniqueCategories = [
          "Popular",
          ...new Set(menuResponse.data.map((item) => item.Cuisine)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRestaurantData();
  }, [restaurant_id]);

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "Popular" || item.Cuisine === selectedCategory) &&
      (searchTerm.trim() === "" ||
        item.Dish_Name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!restaurant)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  return (
    <div className="max-w-full mx-auto p-4 md:p-6">
      {/* Restaurant Header */}
      <div className="flex gap-4 items-start mb-8">
        <img
          src={restaurant.Restaurant_Image}
          alt={restaurant.Restaurant_Name}
          className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover bg-gray-100"
        />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {restaurant.Restaurant_Name}
          </h1>
          <div className="flex flex-wrap items-center text-sm mb-2 gap-2">
            <span className="text-purple-500">{restaurant.Address}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
              <span className="font-semibold">{restaurant.Rating}</span>
              <span className="text-gray-500 ml-1">
                {" "}
                ({Math.floor(restaurant.review_count)})+
              </span>
            </div>
            <button className="text-gray-600 flex items-center hover:text-gray-800">
              <FaInfoCircle className="w-4 h-4 mr-1" />
              <span>View Reviews</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Deals */}
      <div className="mb-8">
        {Array.isArray(deals) && deals.length > 0 && (
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Available Deals
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  <FaTag className="w-4 h-4" />
                  <span>{deal.promo_value}% OFF</span>
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Code: <span className="font-bold">{deal.promo_code}</span>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                Minimum Order:{" "}
                <span className="font-medium">Rs. {deal.Min_Total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar and Categories */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search in menu"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide sm:justify-start">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

     {/* Menu Items */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {filteredItems.map((item, index) => (
    <div
      key={index}
      className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 hover:border-purple-100 transition-colors"
    >
      <div className="flex-1 min-w-0 mr-4">
        {/* Dish Name */}
        <h3 className="font-semibold text-lg mb-1 truncate">{item.Dish_Name}</h3>

        <div className="flex items-center gap-2">
          {/* Original Price with line-through (if discount applied) */}
          {item.discounted_price && item.discounted_price < item.Item_Price ? (
            <>
              <span className="text-gray-400 line-through text-sm">
                Rs. {item.Item_Price}
              </span>
              {/* Discounted Price */}
              <span className="text-purple-500 font-semibold">
                Rs. {item.discounted_price}
              </span>
            </>
          ) : (
            /* Show only original price if no discount */
            <span className="text-purple-500 font-semibold">
              Rs. {item.Item_Price}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Item Image */}
        {item.Item_image && (
          <img
            src={item.Item_image}
            alt={item.Dish_Name}
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
          />
        )}
        {/* Add to Cart Button */}
        <button
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:border-purple-500 transition-colors group"
          aria-label={`Add ${item.Dish_Name} to cart`}
          onClick={() => handleAddToCart(item)}
        >
          <FaPlus className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  ))}



        {/* Cart Component */}
        {loggedIn && (
          <div className="fixed bottom-0 right-0 m-4 z-20">
            <Cart />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
