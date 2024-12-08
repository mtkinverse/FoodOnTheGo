import React, { useEffect, useState } from 'react';
import { FaUtensils, FaFire, FaStar, FaClock, FaStore } from 'react-icons/fa';
import TopRestaurants from './TopRestaurants';
import Cart from './Cart';
import { useUserContext } from '../contexts/userContext';
import Confetti from 'react-confetti';

const HomePage = () => {
  const { loggedIn, userData } = useUserContext();
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  useEffect(() => {
    if (loggedIn && userData?.role === 'Customer' && userData.isFirstOrder === true) {
        setIsFirstOrder(userData.isFirstOrder);
        const timeout = setTimeout(() => {
          setIsFirstOrder(false); 
        }, 10000);
        return () => clearTimeout(timeout);
    }
  }, [loggedIn, userData]);

  return (
    <>
      {isFirstOrder && loggedIn && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-400 text-white px-8 py-4 rounded-full shadow-lg flex items-center justify-center gap-4 animate-bounce">
          <div className="text-2xl">🎉 Congrats! 50% OFF on your first order! 🎉</div>
          <div className="text-4xl text-purple-700">🥳</div>
        </div>
      )}
      
      {/* Confetti animation */}
      {isFirstOrder && loggedIn && <Confetti />}

      <section className="bg-gradient-to-r from-purple-900 to-indigo-800 overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="relative w-64 h-64 lg:w-96 lg:h-96 flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src="/images/1.jpg"
                  alt="Delicious Food"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Outer animated ring */}
              <div className="absolute -inset-4 border-1 border-indigo/10 rounded-full animate-rotatePulse" />
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
                Explore Restaurants
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-purple-800 mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<FaUtensils className="animate-pulse text-yellow-400 text-4xl" />}
              title="Curated Restaurants"
              description="Handpicked top-quality dining options for your pleasure"
            />
            <FeatureCard
              icon={<FaStar className="animate-pulse text-green-400 text-4xl" />}
              title="Exclusive Offers"
              description="Enjoy special deals and discounts on your favorite meals"
            />
            <FeatureCard
              icon={<FaClock className="animate-spinSlow text-orange-400 text-4xl" />}
              title="On-Time Delivery"
              description="Your food arrives hot and fresh, right when you need it"
            />
          </div>
        </div>
      </section>

      <section id="topRestaurants" className="py-16 bg-white">
        <div className="container mx-auto px-2 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <FaStore className="text-purple-800 text-5xl" />
            <h2 className="text-4xl font-extrabold text-purple-800">Top Restaurants</h2>
          </div>

          <p className="text-center text-purple-700 text-xl font-semibold mb-8">
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
  <div className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-r from-indigo-50 to-purple-100">
    <div className="mb-6 text-purple-700 text-5xl">{icon}</div>

    <h3 className="text-2xl font-extrabold text-purple-800 mb-4 transition-colors duration-300 hover:text-purple-900">
      {title}
    </h3>

    <p className="text-purple-600 transition-colors duration-300 hover:text-purple-700">
      {description}
    </p>
  </div>
);

export default HomePage;
