import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAlertContext } from '../contexts/alertContext';
import { useUserContext } from '../contexts/userContext';
const RatingPopup = ({ order, onClose }) => {
  const {setPastOrders,pastOrders} = useUserContext();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const {setAlert} = useAlertContext();
  
  const handleSubmit = async () => {
      try{
        console.log('sending submit review',order.order_id,rating,description);
        const response = await axios.post(`/api/reviewOrder/${order.order_id}`, { rating, description });
        const newReviewId = response.data.review_id; 
    
        setPastOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) => {
            if (o.order_id === order.order_id) {
              return { ...o, review_id: newReviewId }; 
            }
            return o;
          });
          return updatedOrders; 
        });
          setAlert({message: 'Thankyou for your review!!',type:'success'});
        
          onClose();
      }
      catch(err){

      }
  };

  return (
    <div className="fixed inset-0 bg-white backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 hover:bg-purple-700 rounded-full p-2 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold">Rate Your Experience</h2>
          <p className="text-sm text-purple-100 mt-2">
            Order ID: {order.order_id} | {order.restaurant_name}
          </p>
        </div>

        {/* Rating Section */}
        <div className="p-6">
          <div className="flex justify-center space-x-3 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(num)}
                className={`
                  group relative transition-all duration-300 
                  ${
                    hoverRating >= num
                      ? 'text-yellow-400'
                      : rating >= num
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }
                `}
              >
                <StarIcon 
                  className={`
                    h-10 w-10 
                    transform transition-all duration-300
                    ${
                      (hoverRating >= num || rating >= num)
                        ? 'scale-110'
                        : 'scale-100 hover:scale-110'
                    }
                  `} 
                />
                <span className="sr-only">Rate {num} stars</span>
              </button>
            ))}
          </div>

          {/* Description Textarea */}
          <textarea
            placeholder="Tell us about your experience (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 mb-4 resize-none h-24"
          />

          {/* Submit Button */}
          {message ? (
            <p className="text-red-500 text-center mb-4">{message}</p>
          ) : (
            <button
              onClick={handleSubmit}
              className="
                w-full py-3 
                bg-gradient-to-r from-purple-600 to-purple-800 
                text-white rounded-lg 
                hover:from-purple-700 hover:to-purple-900
                transition duration-300 
                transform hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
              "
            >
              Submit Rating
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;