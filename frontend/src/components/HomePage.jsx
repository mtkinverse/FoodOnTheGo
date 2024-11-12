import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaUtensils, FaStar, FaClock } from 'react-icons/fa';
import TopRestaurants from '../Components/TopRestaurants';

const HomePage = () => {
  return (
    <>
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white py-24 overflow-hidden w-full">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between w-full text-center md:text-left">
          <div className="w-full md:w-1/2">
            <h1 className="text-6xl font-bold mb-4 animate-fade-in-up">
              Savor the <span className="text-yellow-300">Moment</span>
            </h1>
            <p className="text-xl mb-8 animate-fade-in-up animation-delay-200">
              Discover, order, and enjoy culinary excellence at your doorstep
            </p>
            <button className="bg-white text-red-600 rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400">
              Explore Flavors
            </button>
          </div>
        </div>
      </header>

      <section className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-16">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<FaUtensils className="text-red-600" />}
              title="Curated Restaurants"
              description="Handpicked top-quality dining options for your pleasure"
            />
            <FeatureCard
              icon={<FaStar className="text-yellow-400" />}
              title="Exclusive Offers"
              description="Enjoy special deals and discounts on your favorite meals"
            />
            <FeatureCard
              icon={<FaClock className="text-green-500" />}
              title="On-Time Delivery"
              description="Your food arrives hot and fresh, right when you need it"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-red-50 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-16">Top Restaurants</h2>
          <TopRestaurants />
        </div>
      </section>
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className="text-5xl mb-6 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
    <p className="text-gray-600 text-lg">{description}</p>
  </div>
);

export default HomePage;
