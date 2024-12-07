import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaTags,
  FaSearch,
  FaPlus,
  FaTag,
  FaTimes,
  FaMapMarkerAlt,
  FaCopy,
  FaShoppingCart
} from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCartContext } from "../contexts/cartContext";
import { useUserContext } from "../contexts/userContext";
import { useAlertContext } from "../contexts/alertContext";
import Cart from "./Cart";

const MenuItemCard = ({ item, handleAddToCart }) => {
  const { loggedIn } = useUserContext();

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (item.discounted_price && item.discounted_price < item.Item_Price) {
      return Math.round(
        ((item.Item_Price - item.discounted_price) / item.Item_Price) * 100
      );
    }
    return 0;
  };

  const discountPercentage = calculateDiscountPercentage();

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-50">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-purple-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-md">
          <FaTags className="w-3 h-3" />
          <span>{discountPercentage}% OFF</span>
        </div>
      )}

      {/* Item Image */}
      <div className="relative h-40 overflow-hidden">
        {item.Item_image ? (
          <img
            src={item.Item_image}
            alt={item.Dish_Name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-purple-100 flex items-center justify-center">
            <FaShoppingCart className="text-purple-300 w-16 h-16" />
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-4 space-y-3">
        {/* Dish Name */}
        <h3 className="text-lg font-bold text-purple-900 line-clamp-2 mb-2">
          {item.Dish_Name}
        </h3>
{/* Fire Tag */}
{item.popular && (
  <div className=" absolute top-7 left-3 z-10 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg flex items-center space-x-2 z-10">
  <span className="font-extrabold">popular</span>
  </div>
)}


        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Discounted Price */}
            {item.discounted_price && item.discounted_price < item.Item_Price ? (
              <>
                <span className="text-purple-600 font-bold text-base">
                  Rs. {item.discounted_price.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  Rs. {item.Item_Price}
                </span>
              </>
            ) : (
              <span className="text-purple-600 font-bold text-base">
                Rs. {item.Item_Price}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`w-10 h-10 flex items-center justify-center 
              rounded-full transition-all duration-300 
              ${
                loggedIn
                  ? "bg-purple-500 hover:bg-purple-600 text-white hover:shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
            onClick={() => handleAddToCart(item)}
            disabled={!loggedIn}
            aria-label={`Add ${item.Dish_Name} to cart`}
          >
            <FaPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};


const DealCard = ({ deal }) => {
  const {setAlert} = useAlertContext();
  const copyPromoCode = () => {
    navigator.clipboard.writeText(deal.promo_code);
    setAlert({message: 'Code copied! 🎉',type: 'success'});
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-purple-100">
      {/* Top Gradient Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaTag className="text-yellow-400 w-5 h-5" />
          <span className="text-white font-bold text-lg">
            {deal.promo_value}% OFF
          </span>
        </div>
        <button 
          onClick={copyPromoCode}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
          title="Copy Promo Code"
        >
          <FaCopy className="w-4 h-4" />
        </button>
      </div>

      {/* Deal Details */}
      <div className="p-4 space-y-3">
        {/* Promo Code Section */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-600 text-sm">Promo Code:</span>
            <span className="ml-2 font-bold text-purple-800 bg-purple-100 px-2 py-1 rounded-full text-sm">
              {deal.promo_code}
            </span>
          </div>
        </div>

        {/* Minimum Order Information */}
        <div className="flex items-center space-x-2 text-gray-700">
          <FaShoppingCart className="w-5 h-5 text-purple-600" />
          {deal.Min_Total > 0 ? (
            <span className="text-sm">
              Minimum Order: 
              <span className="font-bold ml-1 text-purple-800">
                Rs. {deal.Min_Total}
              </span>
            </span>
          ) : (
            <span className="text-green-600 font-medium text-sm flex items-center">
              No Minimum Order! 🎉
            </span>
          )}
        </div>

      
      </div>
    </div>
  );
};

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
  const [reviews, setReviews] = useState([]);
  const [reviewsPopup, setReviewspop] = useState(false);
  const [popularItems,setPopularItems] = useState([]);
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantResponse = await axios.get(
          `/api/getRestaurant/${restaurant_id}`
        );
        setRestaurant(restaurantResponse.data);

        const menuResponse = await axios.get(`/api/menu/${restaurant_id}`);
        setMenuItems(menuResponse.data);
        
        const popularResponse = await axios.get(`/api/getPopularItems/${restaurant_id}`);
        setPopularItems(popularResponse.data);

        const reviewsResponse = await axios.get(
          `/api/getReviews/${restaurant_id}`
        );
        setReviews(reviewsResponse.data);
          
        const dealsResponse = await axios.get(
          `/api/getPromos/${restaurant_id}`
        );
        setDeals(dealsResponse.data);

        const uniqueCategories = [
          "All",
          ...new Set(menuResponse.data.map((item) => item.Cuisine)),
        ];

        const updatedMenuItems = menuResponse.data.map(menuItem => {
          const isPopular = popularResponse.data.some(popularItem => popularItem.Item_id === menuItem.Item_id);
        
          return {
            ...menuItem,
            popular: isPopular,  
          };
        });
        setMenuItems(updatedMenuItems);
        console.log('trying to preint categories');
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
        {/* Restaurant Overview */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-8 bg-gradient-to-r from-purple-900 to-indigo-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
          <img
            src={restaurant.Restaurant_Image}
            alt={restaurant.Restaurant_Name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md ring-4 ring-white"
          />
    
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold mb-2 truncate text-white hover:text-purple-700 transition-colors duration-300">
              {restaurant.Restaurant_Name}
            </h1>
    
            <div className="text-sm sm:text-base text-white mb-3 truncate flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {restaurant.Address}
            </div>
    
            <div className="flex items-center gap-4 text-sm sm:text-base">
              <div className="flex items-center bg-yellow-100 px-3 py-1.5 rounded-full">
                <svg
                  className="text-yellow-500 w-5 h-5 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-gray-800">{restaurant.Rating}</span>
                <span className="text-gray-600 ml-1.5">
                  ({Math.floor(restaurant.review_count)}+)
                </span>
              </div>
    
              <button
                className="flex items-center text-purple-700 bg-white px-4 py-1.5 rounded-full shadow-sm hover:bg-purple-50 hover:shadow-md transition-all duration-300"
                onClick={() => setReviewspop(true)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Reviews</span>
              </button>
            </div>
          </div>
    
          {restaurant.discount_value && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-yellow-400 text-white text-sm font-extrabold px-6 py-2 rounded-bl-2xl shadow-lg transform rotate-12 translate-x-2 -translate-y-2">
              {restaurant.discount_value}% OFF
            </div>
          )}

        </div>
       {/* Available Deals */}
       { Array.isArray(deals) && deals.length > 0 && (
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold mb-5 text-purple-900 flex items-center">
          <FaTag className="mr-3 text-yellow-500" />
          Available Deals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deals.map((deal, index) => (
            <DealCard key={index} deal={deal} />
          ))}
        </div>
      </div>
    
      )}
      



      {reviewsPopup && (
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
                            if (
                              star === Math.ceil(starValue) &&
                              starValue % 1 !== 0
                            ) {
                              return (
                                <div key={star} className="relative">
                                  <FaStar className="w-5 h-5 text-gray-300 absolute" />
                                  <FaStar
                                    className="w-5 h-5 text-yellow-400 overflow-hidden absolute"
                                    style={{
                                      clipPath:
                                        "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
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
                        -- {review.customer_name}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                  <p className="text-lg">No reviews available yet.</p>
                  <p className="text-sm mt-2">
                    Be the first to share your experience!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

  {/* Search Bar */}
  <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search in menu"
              className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-extrabold transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-purple-500 text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-purple-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

   

      {Object.entries(groupedCategories).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-extrabold mb-5 text-purple-900 flex items-center">
            <span className="mr-3 text-purple-600">•</span>
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <MenuItemCard 
                key={index} 
                item={item} 
                handleAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        </div>
      ))}

      {/* Cart Component */}
      {loggedIn && (
        <div className="fixed bottom-4 right-8 z-50">
          <Cart />
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;