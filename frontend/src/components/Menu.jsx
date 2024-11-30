import React, { useState, useEffect } from "react";
import { FaStar, FaInfoCircle, FaSearch, FaPlus, FaTag,FaTimes } from "react-icons/fa";
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
  const { handleAddToCart, cart } = useCartContext(userData.User_id);

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews,setReviews] = useState([]);
  const [reviewsPopup,setReviewspop] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantResponse = await axios.get(
          `/api/getRestaurant/${restaurant_id}`
        );
        setRestaurant(restaurantResponse.data);

        const menuResponse = await axios.get(`/api/menu/${restaurant_id}`);
        setMenuItems(menuResponse.data);
        
        const reviewsResponse = await axios.get(`/api/getReviews/${restaurant_id}`);
        setReviews(reviewsResponse.data);

        const dealsResponse = await axios.get(
          `/api/getPromos/${restaurant_id}`
        );
        setDeals(dealsResponse.data);

        const uniqueCategories = [
          "All",
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
      (selectedCategory === "All" || item.Cuisine === selectedCategory) &&
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
        if (a === "other") return 1; // Handle "other" category to be last
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
            <button className="text-gray-600 flex items-center hover:text-gray-800"
              onClick={() => setReviewspop(true)}
            >
              <FaInfoCircle className="w-3 h-3 mr-1" />
              <span>Reviews</span>
            </button>
          </div>
        </div>
      </div>
       
      {
  reviewsPopup && (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/40 p-4">
      {/* Popup Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-4/5 lg:w-[700px] max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Popup Header */}
        <div className="bg-purple-500 text-white py-3 px-6 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          
          {/* Close Button */}
          <button
            className="text-white hover:text-purple-200 transition-colors"
            onClick={() => setReviewspop(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Reviews Section */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-purple-50/50">
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-purple-50 border border-purple-100 rounded-xl shadow-md hover:shadow-lg hover:bg-purple-200 transition-shadow p-4 flex items-start space-x-4"
              >
                {/* Left Side - Review Content */}
                <div className="flex-grow space-y-3">
                  {/* Review Header with Rating */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const starValue = review.Rating;
                        
                        // Full star
                        if (star <= Math.floor(starValue)) {
                          return (
                            <FaStar 
                              key={star} 
                              className="w-5 h-5 text-yellow-400" 
                            />
                          );
                        }
                        
                        // Half star
                        if (star === Math.ceil(starValue) && starValue % 1 !== 0) {
                          return (
                            <div key={star} className="relative">
                              <FaStar className="w-5 h-5 text-gray-300 absolute" />
                              <FaStar 
                                className="w-5 h-5 text-yellow-400 overflow-hidden absolute" 
                                style={{
                                  clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                                }} 
                              />
                            </div>
                          );
                        }
                        
                        // Empty star
                        return (
                          <FaStar 
                            key={star} 
                            className="w-5 h-5 text-gray-300" 
                          />
                        );
                      })}
                      <span className="text-sm text-gray-700 font-medium ml-2">
                        {review.Rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Description */}
                  {review.Review_Description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.Review_Description}
                    </p>
                  )}
                </div>

                {/* Right Side - Customer Name */}
                <div className="w-40 text-right">
                  <p className="text-sm text-gray-500 font-medium">
                    -- {review.customer_name }
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              <p className="text-lg">No reviews available yet.</p>
              <p className="text-sm mt-2">Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
                  : "bg-gray-100 text-gray-800 hover:bg-purple-200"
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
                className="bg-purple-50 shadow-sm rounded-lg p-3 border border-gray-200 hover:bg-purple-200 hover:scale-105 transform transition-all duration-300 ease-in-out"
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
                className="flex justify-between items-start bg-purple-50 p-3 rounded-lg border border-gray-100 transition-all duration-300 ease-in-out 
          hover:border-purple-300 hover:bg-purple-200 hover:shadow-lg hover:scale-105"
              >
                <div className="flex-1 min-w-0 pr-2 my-2">
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

                <div className="flex items-center gap-2 my-auto h-full">
                  {item.Item_image && (
                    <img
                      src={item.Item_image}
                      alt={item.Dish_Name}
                      className="w-16 h-16 object-cover rounded-lg transition-all duration-300 transform hover:scale-110" // Increased image size and hover effect
                    />
                  )}
                  <button
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:border-purple-500 transition-colors group"
                    aria-label={`Add ${item.Dish_Name} to cart`}
                    disabled={!loggedIn}
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
