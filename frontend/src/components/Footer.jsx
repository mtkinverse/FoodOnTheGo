import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="text-purple-900 hover:text-indigo-900 transition-all duration-300 transform hover:scale-110"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-300 to-indigo-300 text-white py-12 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="text-3xl font-extrabold mb-2 tracking-wider">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-indigo-600">
                FOOD ON THE GO
              </span>
            </h3>
            <p className="text-sm md:text-bas text-purple-900 font-extrabold ">
              Delicious food, delivered to your doorstep
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex justify-center md:justify-end space-x-6 mb-4">
              <SocialIcon icon={<FaFacebook size={28} />} href="#" />
              <SocialIcon icon={<FaTwitter size={28} />} href="#" />
              <SocialIcon icon={<FaInstagram size={28} />} href="#" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm md:text-base text-purple-900 font-medium">
                &copy; 2024 Restaurant. All rights reserved.
              </p>
              <p className="text-xs md:text-sm text-purple-900 mt-1">
                Crafted with <span className='animate-pulse'>❤️  </span>by our development team
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm">
  <div className="flex flex-wrap justify-center space-x-4">
    <a
      href="#"
      className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:from-purple-400 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
    >
      Privacy Policy
    </a>
    <a
      href="#"
      className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:from-purple-400 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
    >
      Terms of Service
    </a>
    <a
      href="#"
      className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:from-purple-400 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
    >
      Contact Us
    </a>
  </div>
</div>

      </div>
    </footer>
  );
};

export default Footer;

