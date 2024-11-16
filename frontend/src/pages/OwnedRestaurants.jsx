import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, Phone, Store, AlertCircle } from 'lucide-react';
import { useUserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

const OwnedRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {loggedIn,userData} = useUserContext();
   const navigate = useNavigate();


    const fetchRestaurants = async () => {
      try {
        console.log(userData); // Ensure userData is defined and contains User_id
        const response = await axios.post('/api/ownedRestaurants', { owner_id: userData.User_id });
        console.log('Response:', response.data); // Log the response to inspect its structure
        setRestaurants(response.data.ownedRestaurants); // Ensure this matches your backend response
        setError(null);
      } catch (err) {
        console.error('Error:', err.response?.data); // Log detailed error info
        setError(err.response?.data?.message || 'Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    if(loggedIn) fetchRestaurants();
    else {setRestaurants([]); navigate('/')}
  }, [loggedIn]);

  console.log("Restaurants: ",restaurants);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center p-8">
        <Store className="mx-auto h-12 w-12 text-purple-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Restaurants Found</h3>
        <p className="text-gray-600">You don't own any restaurants yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-purple-900">Your Restaurants</h2>
        <p className="text-gray-600 mt-2">Manage and view your restaurant portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div 
            key={restaurant.Restaurant_id} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="bg-purple-50 p-4">
              <h3 className="text-xl font-semibold text-purple-900">{restaurant.Restaurant_Name}</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-600">{restaurant.address || 'Address not available'}</span>
                </div>
                
                {restaurant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-600">{restaurant.phone}</span>
                  </div>
                )}
                
                {restaurant.OpensAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-600">{restaurant.OpensAT}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
                  onClick={() => {/* Add your manage restaurant logic here */}}
                >
                  Manage Restaurant (update menu)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnedRestaurants;