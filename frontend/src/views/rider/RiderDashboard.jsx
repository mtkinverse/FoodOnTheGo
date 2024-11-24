import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMotorcycle } from "react-icons/fa";

const RiderDashboard = () => {
  const { userData, loggedIn, bikeDetails, setBikeDetails } = useUserContext();
  const [bikePopup, setBikePopup] = useState(false);
  const [riderHistory, setHistory] = useState([]);
  const [pendingOrders, setPending] = useState([]);
  const [restaurantInfo,setRestaurantInfo] = useState([]);
  const navigate = useNavigate();
  
  const getRestaurantInfo = async() => {
    console.log('Sending get restaurant info request');
      axios.get(`/api/getRestaurantInfo/${userData.User_id}`)
      .then(response =>{
         setRestaurantInfo(response.data);
      })
      .catch(err =>{
        console.log('Error getting restaurant info');
      })
  }


  const DashboardContent = () => (
    <div className="container mx-auto p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center space-x-4 text-purple-600">
        <FaMotorcycle size={40} />
        <h1 className="text-4xl font-extrabold text-gray-800">Your Dashboard</h1>
      </div>
  
      {/* Bike Information */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-2xl font-semibold text-gray-800">Your Bike</h3>
        <p className="text-gray-600 text-sm">
          Number: <span className="font-semibold text-purple-700">{bikeDetails.BikeNo || "Not Registered"}</span>
        </p>
      </div>
  
      {/* Restaurant Information */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-2xl font-semibold text-gray-800">Restaurant Working At:</h3>
        <p className="text-gray-600 text-sm">
          {restaurantInfo.length > 0
            ? `${restaurantInfo[0].restaurant_name} - Address: ${restaurantInfo[0].address}`
            : "No restaurant assigned yet."}
        </p>
      </div>
  
      {/* Orders To Deliver Section */}
      <section className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-700">Orders To Deliver</h2>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition duration-200">
            Manage
          </button>
        </div>
        <ul className="space-y-2">
          {Array.isArray(pendingOrders) && pendingOrders.length > 0 ? (
            pendingOrders.map((currentOrder) => (
              <li key={currentOrder.Order_id} className="flex justify-between items-center text-gray-700 border-b pb-2">
                <span>{currentOrder.Order_id} - Deliver to {currentOrder.Address}</span>
                <button className="text-purple-500 hover:text-purple-700 text-sm">Details</button>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">Nothing to deliver!</li>
          )}
        </ul>
      </section>
  
      {/* Completed Deliveries Section */}
      <section className="bg-purple-50 rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-700">Completed Deliveries</h2>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition duration-200">
            History
          </button>
        </div>
        <ul className="space-y-2">
          {Array.isArray(riderHistory) && riderHistory.length > 0 ? (
            riderHistory.slice(0, 3).map((historyItem, index) => (
              <li key={index} className="text-purple-600">
                {historyItem.Order_id} - Delivered on {historyItem.Order_date}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">Nothing delivered yet</li>
          )}
        </ul>
      </section>
  
      {/* Earnings Section  */}
      {/* 
      <section className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-md p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Earnings</h2>
          <button className="bg-white text-purple-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition duration-200">
            Details
          </button>
        </div>
        <p className="text-2xl font-semibold">Total: $500</p>
      </section>
      */}
    </div>
  );
  
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
   // fetchHistory();
    fetchPending();
  }, []);

  const handleBikeRegistration = async (e) => {
    e.preventDefault();
    try {
        console.log("Sending request",bikeDetails.BikeNo,userData.User_id);
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
    <div className="container mx-auto p-4 space-y-4">
      {bikePopup ? (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
              Register Your Vehicle
            </h2>
            <p className="text-gray-700 text-sm text-center mb-6">
              Please provide your bike's number plate to continue.
            </p>
            <form className="space-y-4" onSubmit={handleBikeRegistration}>
              <div>
                <label
                  htmlFor="numberPlate"
                  className="block text-gray-600 text-sm font-medium mb-1"
                >
                  Bike Number Plate
                </label>
                <input
                  id="numberPlate"
                  type="text"
                  name="BikeNo"
                  value={bikeDetails.BikeNo || ""}
                  onChange={(e) =>
                    setBikeDetails((prev) => ({
                      ...prev,
                      BikeNo: e.target.value,
                    }))
                  }
                  placeholder="Enter your bike's number plate"
                  className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <DashboardContent />
      )}
    </div>
  );
};

export default RiderDashboard;
