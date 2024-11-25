import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBiking, FaBox, FaCheckCircle, FaDollarSign, FaUtensils, FaMapMarkerAlt } from 'react-icons/fa';

const RiderDashboard = () => {
  const { userData, loggedIn, bikeDetails, setBikeDetails } = useUserContext();
  const [bikePopup, setBikePopup] = useState(false);
  const [riderHistory, setHistory] = useState([]);
  const [pendingOrders, setPending] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState([]);
  const navigate = useNavigate();
  
  const getRestaurantInfo = async () => {
    try {
      const response = await axios.get(`/api/getRestaurantInfo/${userData.User_id}`);
      setRestaurantInfo(response.data);
    } catch (err) {
      console.log('Error getting restaurant info');
    }
  }

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
    if (userData?.User_id) {
      getRestaurantInfo();
    }
  }, [loggedIn, navigate, userData]);
   
  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    } else if (!bikeDetails.BikeNo) {
      setBikePopup(true);
    }
  }, [loggedIn, navigate, bikeDetails]);

  const fetchHistory = async () => {
    try {
      const response = await axios.post(`/api/getRiderHistory/${userData.User_id}`);
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching rider history", err);
    }
  };

  const fetchPending = async () => {
    try {
      const response = await axios.post(`/api/getOrdersToDeliver/${userData.User_id}`);
      setPending(response.data);
    } catch (err) {
      console.error("Error fetching pending orders", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchPending();
  }, []);

  const handleBikeRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/setVehicle/${userData.User_id}`, {
        bikeNo: bikeDetails.BikeNo,
      });
      console.log("Vehicle registered");
      setBikePopup(false); 
    } catch (err) {
      console.error("Error registering bike", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8">Rider Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4">
            <div className="bg-indigo-100 rounded-full p-3">
              <FaBiking className="text-indigo-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Your Bike</h2>
              <p className="text-xl font-bold text-indigo-600">{bikeDetails.BikeNo || "Not Registered"}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4">
            <div className="bg-green-100 rounded-full p-3">
              <FaUtensils className="text-green-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Restaurant</h2>
              {restaurantInfo.length > 0 ? (
                <div>
                  <p className="text-xl font-bold text-green-600">{restaurantInfo[0].restaurant_name}</p>
                  <p className="text-sm text-gray-500">{restaurantInfo[0].address}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No restaurant assigned</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <FaDollarSign className="text-yellow-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Today's Earnings</h2>
              <p className="text-xl font-bold text-yellow-600">$45.00</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-indigo-800">Orders To Deliver</h2>
              <FaBox className="text-indigo-600 text-2xl" />
            </div>
            {Array.isArray(pendingOrders) && pendingOrders.length > 0 ? (
              <ul className="space-y-4">
                {pendingOrders.map((currentOrder) => (
                  <li key={currentOrder.Order_id} className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-indigo-600 font-semibold">Order #{currentOrder.Order_id}</span>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-1 text-indigo-400" />
                        {currentOrder.Address}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300">
                      Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 italic">No pending orders at the moment.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-800">Recent Deliveries</h2>
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
            {Array.isArray(riderHistory) && riderHistory.length > 0 ? (
              <ul className="space-y-4">
                {riderHistory.slice(0, 3).map((historyItem, index) => (
                  <li key={index} className="bg-green-50 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-green-600 font-semibold">Order #{historyItem.Order_id}</span>
                      <p className="text-sm text-gray-600 mt-1">{historyItem.Order_date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 italic">No completed deliveries yet.</p>
            )}
          </div>
        </div>
      </div>

      {bikePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Register Your Vehicle</h2>
            <p className="text-gray-600 mb-6">Please provide your bike's number plate to continue.</p>
            <form onSubmit={handleBikeRegistration} className="space-y-4">
              <div>
                <label htmlFor="bikeNo" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Number Plate
                </label>
                <input
                  id="bikeNo"
                  type="text"
                  value={bikeDetails.BikeNo || ""}
                  onChange={(e) => setBikeDetails((prev) => ({ ...prev, BikeNo: e.target.value }))}
                  placeholder="Enter your bike's number plate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;

