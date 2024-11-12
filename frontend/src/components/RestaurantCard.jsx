import { FaStar, FaHamburger, FaUtensils, FaClock } from 'react-icons/fa';
import { Card, Button } from 'react-bootstrap';

const RestaurantCard = ({ restaurant }) => {
  // Determine the number of full stars and half stars for the rating
  const fullStars = Math.floor(restaurant.Rating);
  const halfStar = restaurant.Rating % 1 !== 0;

  return (
    <div className="flex justify-center p-6">
      <Card className="max-w-sm w-full bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
        {/* Image section */}
        <div className="w-full h-60 overflow-hidden">
          <Card.Img
            variant="top"
            src={restaurant.Restaurant_Image}
            alt={restaurant.Restaurant_Name}
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
          />
        </div>

        <Card.Body className="p-6">
          {/* Restaurant Name */}
          <Card.Title className="text-3xl font-bold text-gray-800 mb-4">{restaurant.Restaurant_Name}</Card.Title>
          
          {/* Rating Section with Full and Half Stars */}
          <div className="flex items-center mt-2 mb-3">
            {[...Array(fullStars)].map((_, index) => (
              <FaStar key={`full-${index}`} className="text-yellow-500" />
            ))}
            {halfStar && <FaStar key="half" className="text-yellow-500" />}
            <span className="ml-2 text-gray-600">{restaurant.Rating}</span>
          </div>
          
          {/* Open/Close Times with Clock Icon */}
          <div className="flex items-center text-sm text-gray-500 mt-2 mb-4">
            <FaClock className="text-gray-500 mr-2" />
            <span className="font-semibold text-gray-700">{restaurant.OpensAt} - {restaurant.ClosesAt}</span>
          </div>
          
          {/* Burger and Fork Icons */}
          <div className="flex items-center justify-start mb-4">
            <FaHamburger className="text-gray-500 mr-4" />
            <FaUtensils className="text-gray-500" />
          </div>
          
          {/* Button */}
          <Button variant="primary" className="mt-4 w-full py-3 rounded-lg text-white font-semibold hover:bg-red-700 transition duration-300 ease-in-out">
            View Details
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RestaurantCard;
