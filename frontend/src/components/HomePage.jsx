import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaUtensils, FaStar, FaClock } from 'react-icons/fa';
import TopRestaurants from '../Components/TopRestaurants';
import { useUserContext } from '../contexts/userContext';
import Cart from './Cart';

const HomePage = () => {
  const {loggedIn} = useUserContext();
  return (
    <>
      {/* Header Section with purple-White Gradient */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-32 overflow-hidden w-full mx-0">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between w-full text-center md:text-left">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-6xl font-extrabold mb-6 animate-fade-in-up">
              Savor the <span className="text-yellow-300">Moment</span>
            </h1>
            <p className="text-xl mb-10 animate-fade-in-up animation-delay-200">
  Discover, order, and enjoy culinary excellence at your doorstep. {!loggedIn && <p>Login now to place an order! </p>}
</p>

            <button className="bg-white text-purple-600 rounded-full px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400">
              Explore Flavors
            </button>
          </div>
       
        </div>
      </header>

      <section className="py-24 bg-white w-full mx-0">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-semibold text-center text-gray-800 mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <FeatureCard
              icon={<FaUtensils className="text-purple-600" />}
              title="Curated Restaurants"
              description="Handpicked top-quality dining options for your pleasure"
            />
            <FeatureCard
              icon={<FaStar className="text-yellow-500" />}
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

      {/* Top Restaurants Section */}
      <section className="py-24 bg-purple-50 w-full mx-0">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-semibold text-center text-gray-800 mb-16">Top Restaurants</h2>
          <TopRestaurants />
        </div>
      </section>
      
      {loggedIn && <Cart/>}
    </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-8 text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-4 border border-gray-200">
    <div className="text-5xl mb-6 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
    <p className="text-gray-600 text-lg">{description}</p>
  </div>
);

export default HomePage;
