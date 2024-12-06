import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="text-purple-500 hover:text-purple-600 transition duration-300 transform hover:scale-110"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

const Footer = () => {
  return (
    <footer 
      className="bg-white text-gray-800 py-8 md:py-12 relative z-10"
      style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-extrabold text-purple-600 mb-2">FOOD ON THE GO</h3>
            <p className="text-sm md:text-base">Delicious food, delivered to your doorstep</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 mb-4">
              <SocialIcon icon={<FaFacebook size={24} />} href="#" />
              <SocialIcon icon={<FaTwitter size={24} />} href="#" />
              <SocialIcon icon={<FaInstagram size={24} />} href="#" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm md:text-base font-medium">
                &copy; 2024 BOIS Restaurant. All rights reserved.
              </p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Crafted with love by our culinary team
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-purple-200 text-center text-sm text-gray-600">
          <a href="#" className="hover:text-purple-600 transition duration-300 mr-4">Privacy Policy</a>
          <a href="#" className="hover:text-purple-600 transition duration-300 mr-4">Terms of Service</a>
          <a href="#" className="hover:text-purple-600 transition duration-300">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
