import React  from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaUtensils, FaStar, FaClock } from 'react-icons/fa';

const SocialIcon = ({ icon, href }) => (
    <a href={href} className="text-white hover:text-yellow-300 transition duration-300">
      {icon}
    </a>
  );

const Footer = () => {
    return(
        <>
        <section className="py-20 bg-gradient-to-b from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8">Stay Connected</h2>
          <p className="text-xl mb-8">Join our community for exclusive offers and culinary adventures</p>
          <form className="flex flex-col md:flex-row justify-center max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-full md:rounded-r-none w-full md:w-2/3 mb-4 md:mb-0 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 text-lg"
            />
            <button className="bg-yellow-400 text-red-800 rounded-full md:rounded-l-none px-8 py-4 font-semibold hover:bg-yellow-300 transition duration-300 text-lg">
              Join Now
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-lg mb-4 md:mb-0">© 2024 Your Food App. All rights reserved.</p>
            <div className="flex space-x-8">
              <SocialIcon icon={<FaFacebook size={24} />} href="#" />
              <SocialIcon icon={<FaTwitter size={24} />} href="#" />
              <SocialIcon icon={<FaInstagram size={24} />} href="#" />
            </div>
          </div>
        </div>
      </footer>
    </>
    );
}

export default Footer;