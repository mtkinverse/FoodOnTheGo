import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaCartPlus, FaShoppingCart,  FaTrash, FaPlus, FaMinus,FaHeart,FaUtensils} from "react-icons/fa";
import { useUserContext } from "../contexts/userContext";
import { useCart } from "../hooks/useCart";

const Menu = () => {
  const { restaurant_name, restaurant_id } = useParams();
  const navigate = useNavigate();
  const { loggedIn, userData } = useUserContext(); 
  const { 
    cart,
    cartCount,
    handleAddToCart,
    handleDecrement,
    handleIncrement,
    handleRemove
  } = useCart(userData.User_id);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartPopup, setCartPopup] = useState(false);

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
  
    if (!loggedIn) navigate("/");
    fetchMenuItems();
  }, [restaurant_id, restaurant_name, loggedIn, navigate]);
  

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.Item_Price * item.quantity), 0);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6 relative">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center mb-6">
          <FaUtensils className="mr-4 text-purple-600 text-3xl" />
          <h1 className="text-4xl font-bold text-purple-900">
            {restaurant_name}
          </h1>
        </div>

        <div className="space-y-6">
          {menuItems.map((item) => (
            <div 
              key={item.menu_id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden 
                         flex items-center transform transition 
                         duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="w-1/3 relative">
                <img 
                  src={item.Item_image} 
                  alt={item.Dish_Name} 
                  className="w-full h-56 object-cover"
                />
                <button 
                  className="absolute top-4 right-4 text-white hover:text-red-300"
                >
                  <FaHeart className="w-7 h-7" />
                </button>
              </div>
              
              <div className="w-2/3 p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">
                    {item.Dish_Name}
                  </h3>
                  <p className="text-purple-600 mb-2">{item.Cuisine}</p>
                  <span className="text-2xl font-bold text-purple-700">
                    Rs.{item.Item_Price}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-6 py-3 bg-purple-600 text-white 
                             rounded-lg hover:bg-purple-700 
                             transition duration-300 
                             flex items-center"
                >
                  <FaCartPlus className="mr-2" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 right-8 z-40">
          <div className="relative">
            <button
              onClick={() => setCartPopup(true)}
              className="bg-purple-600 text-white p-4 rounded-full 
                         shadow-2xl hover:bg-purple-700 
                         transition-all duration-300 flex 
                         items-center justify-center"
            >
              <FaShoppingCart className="w-7 h-7" />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 
                bg-red-500 text-white text-xs font-bold 
                rounded-full h-6 w-6 flex items-center 
                justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        <div 
          className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl 
                      transform transition-transform duration-300 z-50
                      ${cartPopup ? 'translate-x-0' : 'translate-x-full'}`}

        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-900">
                Your Cart
              </h2>
              <button 
                onClick={() => setCartPopup(false)}
                className="text-red-500 hover:text-red-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.menu_id} 
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div>
                      <h3 className="font-bold text-purple-900">
                        {item.Dish_Name}
                      </h3>
                      <p className="text-purple-600">
                        Rs.{item.Item_Price}
                      </p>
                      <p className="text-purple-600">
                        {item.restaurant_name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleDecrement(item.Item_id)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleIncrement(item.Item_id)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <FaPlus />
                      </button>
                      <button 
                        onClick={() => handleRemove(item.Item_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-6 border-t flex justify-between items-center">
              <span className="text-xl font-bold text-purple-900">Total: Rs.{getTotalAmount()}</span>
              <button
                onClick={() => navigate(`/checkout/${restaurant_id}`)}
                className="w-full bg-purple-600 text-white py-3 
                           rounded-lg hover:bg-purple-700 
                           transition duration-300"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
