import React, { useEffect, useState } from 'react';
import { FaUtensils, FaFire,FaStar, FaClock } from 'react-icons/fa';
import TopRestaurants from './TopRestaurants';
import Cart from './Cart';
import { useUserContext } from '../contexts/userContext';

const HomePage = () => {
  const { loggedIn, userData } = useUserContext();

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
          <a href="#topRestaurants" className='no-underline text-white'>
            <button className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition duration-300">
              Order Now
            </button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-purple-800 py-4">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-10">
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
<section id='topRestaurants' className="py-20 bg-purple-100">
  <div className="container mx-auto px-6">
    {/* Section Title with Icon Next to It */}
    <div className="flex justify-center items-center mb-2">
      <h2 className="text-4xl font-bold text-purple-800 flex items-center">
        Top Restaurants
      </h2>
    </div>

    {/* Top Restaurants List */}
    <TopRestaurants />
  </div>
</section>

      {loggedIn && <Cart />}


    </>
  );
};
const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center bg-purple-50 p-4 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-purple-100">
    <div className="mb-4 text-purple-700 text-4xl">{icon}</div>

    {/* Title */}
    <h3 className="text-2xl font-semibold text-purple-800 mb-2 transition-colors duration-300 hover:text-purple-900">
      {title}
    </h3>

    {/* Description */}
    <p className="text-purple-600 transition-colors duration-300 hover:text-purple-700">
      {description}
    </p>
  </div>
);

export default HomePage;
