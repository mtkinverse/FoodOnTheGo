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

    const menuInterval = setInterval(async () => {
      try {
        const menuResponse = await axios.get(`/api/menu/${restaurant_id}`);
        setMenuItems(menuResponse.data);
      } catch (error) {
        console.error("Error refetching menu items:", error);
      }
    }, 30000);

    const promosInterval = setInterval(async () => {
      try {
        const dealsResponse = await axios.get(
          `/api/getPromos/${restaurant_id}`
        );
        setDeals(dealsResponse.data);
      } catch (error) {
        console.error("Error refetching promos:", error);
      }
    }, 180000);

    return () => {
      clearInterval(menuInterval);
      clearInterval(promosInterval);
    };
  }, [restaurant_id]);

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "Popular" || item.Cuisine === selectedCategory) &&
      (searchTerm.trim() === "" ||
        item.Dish_Name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedCategories = Object.fromEntries(
    Object.entries(
      filteredItems.reduce((acc, item) => {
        // Normalize the category name to lowercase
        const category = (item.Category || "Other").toLowerCase();
  
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {})
    )
    // Sort the categories alphabetically, putting "Other" last
    .sort(([a], [b]) => {
      if (a === "other") return 1;  // Handle "other" category to be last
      if (b === "other") return -1;
      return a.localeCompare(b);
    })
  );
  
  
  if (!restaurant)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Restaurant Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start mb-6">
        <img
          src={restaurant.Restaurant_Image}
          alt={restaurant.Restaurant_Name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold mb-1 truncate">
            {restaurant.Restaurant_Name}
          </h1>
          <div className="text-xs sm:text-sm text-purple-500 mb-1 truncate">
            {restaurant.Address}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 w-3 h-3 mr-1" />
              <span className="font-semibold">{restaurant.Rating}</span>
              <span className="text-gray-500 ml-1">
                ({Math.floor(restaurant.review_count)}+)
              </span>
            </div>
            <button className="text-gray-600 flex items-center hover:text-gray-800">
              <FaInfoCircle className="w-3 h-3 mr-1" />
              <span>Reviews</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search in menu"
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
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

      {/* Available Deals */}
      {Array.isArray(deals) && deals.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            Available Deals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deals.map((deal, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-lg p-3 border border-gray-200"
              >
                <div className="flex flex-col gap-1">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 w-fit">
                    <FaTag className="w-3 h-3" />
                    <span>{deal.promo_value}% OFF</span>
                  </div>
                  <div className="text-xs">
                    Code: <span className="font-bold">{deal.promo_code}</span>
                  </div>
                  <div className="text-xs text-gray-700">
                    Min. Order:{" "}
                    <span className="font-medium">Rs. {deal.Min_Total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      {Object.entries(groupedCategories).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start bg-white p-3 rounded-lg border border-gray-100 hover:border-purple-100 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {item.Dish_Name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {item.Item_Price > (item.discounted_price || 0) && (
                      <span className="text-gray-400 line-through text-xs">
                        Rs. {item.Item_Price}
                      </span>
                    )}

                    {/* Display discounted price if it exists */}
                    {item.discounted_price &&
                    item.discounted_price < item.Item_Price ? (
                      <span className="text-purple-500 font-semibold text-xs">
                        Rs. {item.discounted_price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-purple-500 font-semibold text-xs">
                        Rs. {item.Item_Price}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.Item_image && (
                    <img
                      src={item.Item_image}
                      alt={item.Dish_Name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <button
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:border-purple-500 transition-colors group"
                    aria-label={`Add ${item.Dish_Name} to cart`}
                    onClick={() => handleAddToCart(item)}
                  >
                    <FaPlus className="w-3 h-3 text-purple-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Cart Component */}
      {loggedIn && (
        <div className="fixed bottom-4 right-8 z-0">
          <Cart />
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
