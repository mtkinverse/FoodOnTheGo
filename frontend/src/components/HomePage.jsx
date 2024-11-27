import React, { useEffect, useState } from 'react';
import { FaUtensils, FaStar, FaClock } from 'react-icons/fa';
import TopRestaurants from './TopRestaurants';
import Cart from './Cart';
import { useUserContext } from '../contexts/userContext';
import axios from 'axios';
import RatingPopup from './RateOrder';

const HomePage = () => {
  const { loggedIn, userData } = useUserContext();
  const [lastOrder, setLastOrder] = useState(null);
  const [showRatePopup, setShowRatePopup] = useState(false);

  const fetchLastOrder = async () => {
    try {
      const response = await axios.get(`/api/getLastOrder/${userData.User_id}`);
      if (response.data && response.data.Review_id === null) { 
        setLastOrder(response.data);
        setShowRatePopup(true); 
      } else {
        setLastOrder(null);  
        setShowRatePopup(false); 
      }
    } catch (err) {
      console.error('Error fetching last order:', err);
    }
  };
  

  useEffect(() => {
    if (loggedIn && userData?.role === 'Customer' ) {
      fetchLastOrder();
    }
  }, [loggedIn]);

  // Close the pop-up after rating
  const handleRateOrderClose = () => {
    setShowRatePopup(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-purple-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-purple-800 mb-4">Delicious Food, Delivered to You</h1>
          <p className="text-xl text-purple-600 mb-8">Order from your favorite restaurants with just a few clicks!</p>
          <button className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition duration-300">
            Order Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-purple-800 mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<FaUtensils className="text-purple-600 text-4xl" />}
              title="Curated Restaurants"
              description="Handpicked top-quality dining options for your pleasure"
            />
            <FeatureCard
              icon={<FaStar className="text-purple-600 text-4xl" />}
              title="Exclusive Offers"
              description="Enjoy special deals and discounts on your favorite meals"
            />
            <FeatureCard
              icon={<FaClock className="text-purple-600 text-4xl" />}
              title="On-Time Delivery"
              description="Your food arrives hot and fresh, right when you need it"
            />
          </div>
        </div>
      </section>

      {/* Top Restaurants Section */}
      <section className="py-20 bg-purple-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-purple-800 mb-12">Top Restaurants</h2>
          <TopRestaurants />
        </div>
      </section>

      {loggedIn && <Cart />}

      {showRatePopup && lastOrder !== null && (
        <RatingPopup 
          order={lastOrder} 
          onClose={handleRateOrderClose} 
        />
      )}

    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-purple-800 mb-2">{title}</h3>
    <p className="text-purple-600">{description}</p>
  </div>
);

export default HomePage;
