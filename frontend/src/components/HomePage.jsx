import React from 'react';
import { FaUtensils, FaFire, FaStar, FaClock, FaStore } from 'react-icons/fa';
import TopRestaurants from './TopRestaurants';
import Cart from './Cart';
import { useUserContext } from '../contexts/userContext';

const HomePage = () => {
  const { loggedIn } = useUserContext();

  return (
    <>
      <section className="bg-gradient-to-r from-purple-900 to-indigo-800 overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="relative w-64 h-64 lg:w-96 lg:h-96 flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src="/images/1.jpg"
                  alt="Delicious Food"
                  className="animate-spinSlow w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-4 border-2 border-white/10 rounded-full animate-spin-slow" />
            </div>

            <div className="flex-1 max-w-xl text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                Savor Every Bite, <br />
                <span className="text-yellow-400">

                Delivered{" "}
                  <span className="text-yellow-400 animate-fadeBounce">
                    Fresh!
                  </span>
                </span>
              </h1>
              <p className="text-gray-300 text-xl mb-8">
                Indulge in your favorite meals from top restaurants. 
                Quick delivery, unmatched taste!
              </p>
              <a 
                href="#topRestaurants" 
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                Explore Menu
              </a>
            </div>
          </div>
        </div>
      </section>
 
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-purple-800 py-4">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-10">
            <FeatureCard
              icon={<FaUtensils className="animate-fadeBounce text-yellow-400 text-4xl" />}
              title="Curated Restaurants"
              description="Handpicked top-quality dining options for your pleasure"
            />
            <FeatureCard
              icon={<FaStar className="animate-fadeBounce text-green-400 text-4xl" />}
              title="Exclusive Offers"
              description="Enjoy special deals and discounts on your favorite meals"
            />
            <FeatureCard
              icon={<FaClock className="animate-fadeBounce text-orange-400 text-4xl" />}
              title="On-Time Delivery"
              description="Your food arrives hot and fresh, right when you need it"
            />
          </div>
        </div>
      </section>

      <section id="topRestaurants" className="py-10 bg-white">
        <div className="container mx-auto px-2 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaStore className="text-purple-800 text-5xl" />
            <h2 className="text-4xl font-extrabold text-purple-800">Top Restaurants</h2>
          </div>

          <p className="text-center text-purple-700 text-xl font-semibold mb-2">
            Discover the best-rated restaurants near you.
          </p>
          <TopRestaurants />
          
        </div>
      </section>

      {loggedIn && (
        <div className="fixed bottom-4 right-8 z-50">
          <Cart />
        </div>
      )}
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center bg-purple-50 p-4 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r from-indigo-100 to-purple-300">
    <div className="mb-4 text-purple-700 text-4xl">{icon}</div>

    <h3 className="text-2xl font-extrabold text-purple-800 mb-2 transition-colors duration-300 hover:text-purple-900">
      {title}
    </h3>

    <p className="text-purple-600 transition-colors duration-300 hover:text-purple-700">
      {description}
    </p>
  </div>
);

export default HomePage;