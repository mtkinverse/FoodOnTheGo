import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bike, Utensils, DollarSign, Package, CheckCircle, MapPin, X, AlertCircle } from 'lucide-react';
import { useAlertContext } from "../../contexts/alertContext";

const RiderDashboard = () => {
  const { userData, loggedIn, bikeDetails, setBikeDetails,setUserData } = useUserContext();
  const [bikePopup, setBikePopup] = useState(false);
  const [orderDetailPopup, setOrderDetailsPopup] = useState(false);
  const [analyzingOrder, analyzeOrder] = useState({});
  const [riderHistory, setHistory] = useState([]);
  const [pendingOrders, setPending] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState([]);
  const [tips,setTips] = useState(0);

  const navigate = useNavigate();
  const {setAlert} = useAlertContext();

  const getRestaurantInfo = async () => {
    try {
      const response = await axios.get(`/api/getRestaurantInfo/${userData.User_id}`);
      setRestaurantInfo(response.data);
    } catch (err) {
      console.log('Error getting restaurant info');
    }
  }
   
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`/api/getRiderHistory/${userData.User_id}`);
      setHistory(response.data.orders);
    } catch (err) {
      console.error("Error fetching rider history", err);
    }
  };
  
  const getTips = async () => {
    try {
      const response = await axios.get(`/api/getTips/${userData.User_id}`);
      if(response.data) setTips(response.data.tips);
    } catch (err) {
      console.log('Error fetching tips:', err);
    }
  };

  useEffect(() => {

  },[userData.status]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
    if (userData?.User_id) {
      getRestaurantInfo();
      fetchHistory();
      getTips();
  
      const intervalId = setInterval(() => {
        getTips();
      }, 500000);
    
      return () => clearInterval(intervalId);
    }
  }, [loggedIn, userData]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    } else if (!bikeDetails.BikeNo) {
      setBikePopup(true);
    }
  }, [loggedIn, bikeDetails]);


  const fetchPending = async () => {
    try {
      const response = await axios.get(`/api/getOrdersToDeliver/${userData.User_id}`);
      setPending(response.data.orders);
      console.log(response.data.orders)
    } catch (err) {
      console.error("Error fetching pending orders", err);
    }
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(() => {
      fetchPending();
    }, 40000); 
    return () => clearInterval(interval); 
  },[]);

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

  const setOrderAndDisplay = Order_id => {
    analyzeOrder(pendingOrders.find(ele => ele.Order_id === Order_id));
    setOrderDetailsPopup(true);
  }

  const handleOrderDelivery = e => {
    e.preventDefault();
    setOrderDetailsPopup(false);
    axios.post('/api/markDelivered/',JSON.stringify({Order_id : analyzingOrder.Order_id, Rider_id : userData.User_id}),{headers: {"Content-Type":"application/json"}})
    .then(res => {
      setAlert({
        message : 'Order marked as delivered',
        type : 'success'
      });

      setPending(pendingOrders.filter(ele => ele.Order_id !== analyzingOrder.Order_id))
      setHistory(riderHistory.concat(analyzingOrder));
      analyzeOrder({});
    })
    .catch(err => {
      console.log(err);
      setAlert({
        message : 'cannot mark ordered as delivered',
        type : 'failure'
      });
    })
  }
  
  const updateAvailabilityStatus = async () => {
    const updated_status = userData.status ? false : true;
    try {
      const response = await axios.post(`/api/updateMyStatus/${userData.User_id}`, { status: updated_status });
  
      if (response.status === 200) {
        setUserData((prevData) => ({
          ...prevData,
          status: updated_status,
        }));
        console.log('marked status',userData);
        const message = updated_status
          ? "You are now available for deliveries!"
          : "You are now unavailable for future deliveries until you mark yourself as available again!";
        setAlert( {
          message : message,
          type : 'success'
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setAlert({
        message : "Failed to update your availability status. Please try again later.",
        type : 'failure'
      });
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-purple-800">Rider Dashboard</h1>
          <button
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-medium transition duration-300 ease-in-out 
              ${userData.status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
              text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            onClick={updateAvailabilityStatus}
          >
            {userData.status ? (
              <>
                <AlertCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Mark Unavailable</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Mark Available</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl">
            <div className="bg-purple-100 rounded-full p-3">
              <Bike className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Your Bike</h2>
              <p className="text-xl font-bold text-purple-600">{bikeDetails.BikeNo || "Not Registered"}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl">
            <div className="bg-green-100 rounded-full p-3">
              <Utensils className="text-green-600 w-6 h-6" />
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

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl">
            <div className="bg-yellow-100 rounded-full p-3">
              <DollarSign className="text-yellow-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Today's Tips</h2>
              <p className="text-xl font-bold text-yellow-600">Rs.{tips}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-800">Orders To Deliver</h2>
              <Package className="text-purple-600 w-6 h-6" />
            </div>
            {Array.isArray(pendingOrders) && pendingOrders.length > 0 ? (
              <ul className="space-y-4">
                {pendingOrders.map((currentOrder) => (
                  <li key={currentOrder.Order_id} className="bg-purple-50 rounded-xl p-4 flex justify-between items-center transition-all duration-300 hover:bg-purple-100">
                    <div>
                      <span className="text-purple-600 font-semibold">Order #{currentOrder.Order_id}</span>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="mr-1 text-purple-400 w-4 h-4" />
                        {currentOrder.Address}
                      </p>
                    </div>
                    <button 
                      className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 flex items-center space-x-2"
                      onClick={() => setOrderAndDisplay(currentOrder.Order_id)}
                    >
                      <span>Details</span>
                      <Package className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 italic">No pending orders at the moment.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-800">Recent Deliveries</h2>
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            {Array.isArray(riderHistory) && riderHistory.length > 0 ? (
              <ul className="space-y-4">
                {riderHistory.slice(0, 3).map((historyItem, index) => (
                  <li key={index} className="bg-green-50 rounded-xl p-4 flex justify-between items-center transition-all duration-300 hover:bg-green-100">
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
          <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4 transition-all duration-300 transform hover:scale-105">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Register Your Vehicle</h2>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 flex items-center justify-center space-x-2"
              >
                <span>Submit</span>
                <Bike className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {orderDetailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md m-4 overflow-hidden transition-all duration-300 transform hover:scale-105">
            <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => {
                  setOrderDetailsPopup(false);
                }}
                className="text-white hover:text-purple-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4 p-6">
              <div>
                <label
                  htmlFor="CustomerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Customer Name
                </label>
                <input
                  id="CustomerName"
                  type="text"
                  value={analyzingOrder.Customer_Name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="NearbyPoint"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nearby Point
                </label>
                <input
                  id="NearbyPoint"
                  type="text"
                  value={analyzingOrder.NearbyPoint}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="PhoneNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Customer Mobile
                </label>
                <input
                  id="PhoneNo"
                  type="text"
                  value={analyzingOrder.PhoneNo}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
              </div>

              <button
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 text-sm sm:text-base w-full flex items-center justify-center space-x-2"
                onClick={handleOrderDelivery}
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark as Delivered</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;

