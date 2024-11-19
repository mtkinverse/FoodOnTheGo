import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaCartPlus, FaHeart } from "react-icons/fa"; // Added heart icon for favorite
import { useUserContext } from "../contexts/userContext";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { restaurant_id } = useParams();
  const navigate = useNavigate();
  const {loggedIn} = useUserContext();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`/api/menu/${restaurant_id}`);
        setMenuItems(response.data);
        console.log('menu items received: ',menuItems);
      } catch (err) {
        setError("Failed to fetch menu items.");
      } finally {
        setLoading(false);
      }
    };
    if(!loggedIn) navigate('/');
    fetchMenuItems();
  }, [restaurant_id,loggedIn]);

  if (menuItems.length === 0) navigate('/restaurants');
  if (loading) {
    return <div className="text-center py-10 bg-purple-50">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 bg-purple-50">{error}</div>;
  }

  return (
    <div className="bg-purple-50 min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div 
            key={item.menu_id} 
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border-2 border-purple-200"
          >
            <div className="absolute top-3 right-3 z-10">
              <button className="text-purple-600 hover:text-purple-800 transition">
                <FaHeart className="w-6 h-6" />
              </button>
            </div>
            <img 
              src={item.Item_image} 
              alt={item.Dish_Name} 
              className="w-full h-56 object-cover"
            />
            <div className="p-5 bg-white">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">{item.Dish_Name}</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-semibold text-purple-700">Rs.{item.Item_Price}</span>
                <span className="text-sm text-purple-500 bg-purple-100 px-2 py-1 rounded-full">
                  {item.Cuisine}
                </span>
              </div>
              <button 
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FaCartPlus className="mr-2 w-5 h-5" /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;