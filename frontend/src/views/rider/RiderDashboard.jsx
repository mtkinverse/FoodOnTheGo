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
  const navigate = useNavigate();

  const DashboardContent = () => (
    <div className="container mx-auto p-4 space-y-4">
        <div className="text-purple-500 text-4xl">
        <FaMotorcycle />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800">Your Bike</h3>
        <p className="text-gray-600 text-sm">
          Number: <span className="font-semibold text-purple-700">{bikeDetails.BikeNo || "Not Registered"}</span>
        </p>
      </div>
      <section className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-purple-700">Orders To Deliver</h2>
          <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">
            Manage
          </button>
        </div>
        <ul className="space-y-1 text-sm">
          {Array.isArray(pendingOrders) && pendingOrders.length > 0 ? (
            pendingOrders.map((currentOrder) => (
              <li
                className="border-b pb-1 text-gray-700"
                key={currentOrder.Order_id}
              >
                {currentOrder.Order_id} - deliver to {currentOrder.Address}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">Nothing to deliver!</li>
          )}
        </ul>
      </section>

      {/* Completed Deliveries Section */}
      <section className="bg-purple-50 rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-purple-700">Completed Deliveries</h2>
          <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">
            History
          </button>
        </div>
        <ul className="space-y-1 text-sm">
          {Array.isArray(riderHistory) && riderHistory.length > 0 ? (
            riderHistory.slice(0, 3).map((historyItem, index) => (
              <li key={index} className="text-purple-600">
                {historyItem.Order_id} - delivered on {historyItem.Order_date}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">Nothing delivered yet</li>
          )}
        </ul>
      </section>

      {/* Earnings Section
      <section className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-md p-4 text-white">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Earnings</h2>
          <button className="bg-white text-purple-700 px-3 py-1 rounded text-sm hover:bg-gray-100">
            Details
          </button>
        </div>
        <p className="text-base font-semibold">Total: $500</p>
      </section> */}
    </div>
  );

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
   // fetchPending();
  }, []);

  const handleBikeRegistration = async (e) => {
    e.preventDefault();
    try {
        console.log("Sending request",bikeDetails.BikeNo,userData.User_id);
      await axios.post(`/api/addVehicle/${userData.User_id}`, {
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
