import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import { Card, Button } from "react-bootstrap";

const TopRestaurants = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/home');
        console.log(response);
        if (Array.isArray(response.data)) {
          setRestaurantData(response.data);
          console.log(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setRestaurantData([]);
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setRestaurantData([]);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsToShow, restaurantData.length - itemsToShow)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsToShow, 0));
  };

  const visibleRestaurants = restaurantData.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className={`text-indigo-600 p-2 rounded-full bg-gray-200 hover:bg-indigo-400 transition-colors ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft size={24} />
        </button>

        <div className="flex justify-center space-x-4 overflow-hidden">
          {visibleRestaurants.map((restaurant) => (
            <Card key={restaurant.Restaurant_id} style={{ width: '18rem' }} className="mb-4">
              <Card.Img
                variant="top"
                src={restaurant.Restaurant_Image || '/path/to/default-image.jpg'} // Fallback image
                alt={restaurant.Restaurant_Name}
              />
              <Card.Body>
                <Card.Title>{restaurant.Restaurant_Name}</Card.Title>
                <div className="flex items-center">
                  {/* Render star rating based on Rating value, with fallback to 0 if Rating is invalid */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      className={i < (parseFloat(restaurant.Rating) || 0) ? "text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{restaurant.Rating}</span>
                </div>
                <Card.Text>
                  <strong>Opens At:</strong> {restaurant.OpensAt} <br />
                  <strong>Closes At:</strong> {restaurant.ClosesAt}
                </Card.Text>
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        <button
          onClick={handleNext}
          className={`text-indigo-600 p-2 rounded-full bg-gray-200 hover:bg-indigo-400 transition-colors ${
            currentIndex >= restaurantData.length - itemsToShow ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentIndex >= restaurantData.length - itemsToShow}
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default TopRestaurants;
