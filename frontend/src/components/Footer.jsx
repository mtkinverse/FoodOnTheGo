import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const SocialIcon = ({ icon, href }) => (
  <a href={href} className="text-purple-600 hover:text-purple-400 transition duration-300">
    {icon}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-white text-purple-600 py-10 md:py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-6 md:mb-0">
            <SocialIcon icon={<FaFacebook size={24} />} href="#" />
            <SocialIcon icon={<FaTwitter size={24} />} href="#" />
            <SocialIcon icon={<FaInstagram size={24} />} href="#" />
          </div>
          <div className="text-center md:text-right">
            <p className="text-base md:text-lg font-medium">
              &copy; 2024 BOIS Restaurant. All rights reserved.
            </p>
            <p className="text-sm md:text-base text-purple-500 mt-2">
              Crafted with love by our team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;