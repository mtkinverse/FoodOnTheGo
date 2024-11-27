import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Clock,
  MapPin,
  Phone,
  Store,
  Plus,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useUserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import AddRestaurantPopup from "../components/AddRestaurant";
import ManageRestaurant from "../components/ManageRestaurant"; // Import ManageRestaurant
import { useAlertContext } from "../contexts/alertContext";

const OwnedRestaurants = () => {
  const { setAlert } = useAlertContext();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false); // State to handle ManageRestaurant pop-up
  const [currentRestaurant, setCurrentRestaurant] = useState(null); // Store current restaurant data
  const { loggedIn, userData } = useUserContext();
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("/api/ownedRestaurants", {
        params: { owner_id: userData.User_id },
      });
      setRestaurants(response.data.ownedRestaurants);
      setError(null);
    } catch (err) {
      console.error("Error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  const [deleteRestaurantpop, setDeleteRestaurantPop] = useState(false);
  const [restaurantToDelete, setToDelete] = useState(null);

  const handleDeleteRestaurant = async () => {
       const name = restaurantToDelete.Restaurant_Name;
       const id = restaurantToDelete.Restaurant_id;
       try {
        console.log('Sending delete request for:', name, id, restaurantToDelete);
        const response = await axios.post(`/api/deleteRestaurant/${restaurantToDelete.Restaurant_id}`, {
            Restaurant_Image: restaurantToDelete.Restaurant_Image,
        });
        console.log('Backend response:', response);
    
        if (response.status === 200) {
            setAlert({ message: `Your restaurant ${name} has been deleted`, type: 'success' });
            setRestaurants((temp) => temp.filter((ele) => ele.Restaurant_id !== id));
            setDeleteRestaurantPop(false);
            setToDelete(null);
        }
    } catch (err) {
        console.error('Error occurred:', err);
        setAlert({ message: 'An error occurred', type: 'failure' });
    }
  };

  useEffect(() => {
    if (loggedIn) fetchRestaurants();
    else {
      setRestaurants([]);
      navigate("/");
    }
  }, [loggedIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <Store className="mx-auto h-16 w-16 text-indigo-500 mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Start Your Restaurant Journey
          </h3>
          <p className="text-gray-600 mb-8">
            Create your first restaurant listing and start managing your
            business online.
          </p>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Restaurant
          </button>
        </div>
        {isPopupOpen && (
          <AddRestaurantPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            fetchRestaurants={fetchRestaurants}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Your Restaurants
            </h2>
            <p className="mt-2 text-gray-600">
              You currently own {restaurants.length} restaurant
              {restaurants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Restaurant
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.Restaurant_id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.Restaurant_Image || "/default-restaurant.jpg"}
                  alt={restaurant.Restaurant_Name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                  {restaurant.Restaurant_Name}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-sm">{restaurant.Address}</span>
                  </div>

                  {restaurant.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 text-indigo-500 mr-2" />
                      <span className="text-sm">{restaurant.phone}</span>
                    </div>
                  )}

                  {restaurant.OpensAt && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                      <span className="text-sm">
                        Opens at {restaurant.OpensAt}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsManageOpen(true);
                      setCurrentRestaurant(restaurant); // Pass the entire restaurant object
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </button>
                  <button
                    onClick={() => {
                      setToDelete(restaurant);
                      setDeleteRestaurantPop(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Delete
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {deleteRestaurantpop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative text-center">
              <button
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
                onClick={() => {setToDelete(null) ; setDeleteRestaurantPop(false)}} 
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-black-600 mb-4">
                Delete Restaurant
              </h2>

              <p className="text-gray-800 mb-6">
                You are about to delete the restaurant{" "}
                <span className="font-semibold text-purple-600">
                  {restaurantToDelete.Restaurant_Name}
                </span>{" "}
                located at{" "}
                <span className="font-semibold text-purple-600">
                  {restaurantToDelete.Address}
                </span>
                .
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                  onClick={handleDeleteRestaurant} 
                >
                  Confirm
                </button>
                <button
                  className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                  onClick={() => setDeleteRestaurantPop(false)} 
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AddRestaurant Popup */}
        {isPopupOpen && (
          <AddRestaurantPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            fetchRestaurants={fetchRestaurants}
          />
        )}

        {/* ManageRestaurant Popup */}
        {isManageOpen && (
          <ManageRestaurant
            isOpen={isManageOpen}
            onClose={() => setIsManageOpen(false)}
            restaurant={currentRestaurant}
            fetchRestaurants={fetchRestaurants}
          />
        )}
      </div>
    </div>
  );
};

export default OwnedRestaurants;
