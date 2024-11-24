import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
   
const AdminDashboard = () => {
  const { getRestaurantOrders, restaurantOrders, loggedIn, setRestaurantOrders, userData } = useUserContext();
  const navigate = useNavigate();
  const [managePopup, toggleManagePopup] = useState(false);
  const [riders, setRiders] = useState([]); 
  const [dispatchPopup, toggleDispatchPopup] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  useEffect(() => {
    if (!loggedIn) navigate("/");
  }, [loggedIn]);

  useEffect(() => {
    if (dispatchPopup) {
      axios
        .get(`/api/getAvaliableRiders/${userData.Location_id}`)
        .then((res) => {
          console.log("setting riders ", res.data);
          setRiders(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [dispatchPopup, userData.Location_id]);
 
  const handleUpdateStatus = async (order, new_status) => {
    try {
      const response = await axios.post(`/api/updateOrder/${order.order_id}`, {status: new_status});
      if(response.status === 200){
        const updatedOrder = { ...order, status: new_status };
        const updatedOrders = restaurantOrders.map((order) =>
          order.order_id === updatedOrder.order_id ? updatedOrder : order
        );
        setRestaurantOrders(updatedOrders);
        toggleManagePopup(false);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };
  
  const handleDispatch = async () => {
    if (!selectedOrder || !selectedRider) return;

    try {
      // First update the order status 
      await handleUpdateStatus(selectedOrder, 'Out for delivery');   
      // Then update the rider status and rider_id in orders
      const response = await axios.post(`/api/updateRiderStatus/${selectedRider.rider_id}`, { status: false, order_id : selectedOrder.order_id });
      
      if (response.status === 200) {
        const updatedRiders = riders.map((rider) =>
          rider.rider_id === selectedRider.rider_id ? { ...rider, status: false } : rider
        );
        let order = selectedOrder;
        const updatedOrder = { ...order, rider_id: selectedRider.rider_id };
        const updatedOrders = restaurantOrders.map((order) =>
          order.order_id === updatedOrder.order_id ? updatedOrder : order
        );
       
        setRestaurantOrders(updatedOrders);
        setRiders(updatedRiders);
        toggleDispatchPopup(false);
        setSelectedRider(null);
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error dispatching order or updating rider status:', err);
    }
  };

  useEffect(() => {
    getRestaurantOrders();
  }, []);

  useEffect(() => {
    if (!dispatchPopup) {
      setSelectedRider(null);
    }
  }, [dispatchPopup]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="text-center text-purple-700">
        <h1 className="text-3xl font-bold">Restaurant Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Manage orders efficiently</p>
      </div>

     {/* Orders Placed Section */}
<section className="bg-white rounded-lg shadow-md p-4">
  <div className="flex justify-start items-center mb-3">
    <h2 className="text-xl font-bold text-purple-700">Orders Placed</h2>
  </div>
  <ul className="space-y-2">
    {restaurantOrders.filter((order) => order.status === "Placed").length > 0 ? (
      restaurantOrders
        .filter((order) => order.status === "Placed")
        .map((order) => (
          <li key={order.order_id} className="border-b pb-2 text-gray-700">
            <div className="flex justify-between">
              <div>
                <span className="font-semibold text-purple-500">Order ID:</span>{" "}
                {order.order_id} - {order.address}
              </div>
              <div className="space-x-4 flex items-center">
                {/* View Details Button */}
                <button
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={() => {
                    setSelectedOrder(order); // Set the selected order
                    setDetailsPopup(true); // Show the details popup
                  }}
                >
                  View Details
                </button>
                
                {/* Manage Order Button */}
                <button
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={() => {
                    setSelectedOrder(order); // Set the selected order
                    toggleManagePopup(true); // Show the manage popup
                  }}
                >
                  Manage Order
                </button>
              </div>
            </div>
          </li>
        ))
    ) : (
      <li className="text-gray-500 italic">No orders placed yet!</li>
    )}
  </ul>
</section>


      {/* Order Details Popup */}
      {detailsPopup && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
              Order Details
            </h2>
            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <li
                      key={index}
                      className="border-b pb-2 text-gray-700 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-semibold text-purple-500 block">
                          {item.dish_name}
                        </span>
                        <p className="text-sm text-gray-600 italic">
                          {`Qty: ${item.quantity}`}
                        </p>
                      </div>
                      <span className="text-gray-500 text-right">
                        Subtotal: Rs. {item.sub_total}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>Rs.{selectedOrder.total}</span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">No items in this order.</p>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
                onClick={() => setDetailsPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Manage Order Popup */}
{managePopup && selectedOrder && (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-purple-700">Manage Order</h3>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => toggleManagePopup(false)} // Close the popup
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Order Details */}
        <div className="text-gray-700">
          <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
          <p><strong>Address:</strong> {selectedOrder.address}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
        </div>

        {/* Status Update Button */}
        <div className="flex justify-center">
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 ease-in-out"
            onClick={() => handleUpdateStatus(selectedOrder,"Preparing")}
          >
            Change Status to Preparing
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Orders Preparing Section */}
      <section className="bg-purple-50 rounded-lg shadow-md p-4">
        <div className="flex justify-start items-center mb-3">
          <h2 className="text-xl font-bold text-purple-700">
            Orders In Process
          </h2>
        </div>
        <ul className="space-y-2">
          {restaurantOrders.filter((order) => order.status === "Preparing")
            .length > 0 ? (
            restaurantOrders
              .filter((order) => order.status === "Preparing")
              .map((order) => (
                <li
                  key={order.order_id}
                  className="border-b pb-2 text-gray-700"
                >
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold text-purple-500">
                        Order ID:
                      </span>{" "}
                      {order.order_id} - {order.address}
                    </div>
                    <div className="space-x-2">
                      <button
                        className="bg-purple-600 text-white py-1 px-2 rounded-lg hover:bg-purple-700"
                        onClick={() => { 
                          toggleDispatchPopup(true) 
                          setSelectedOrder(order); 
                        }}
                      >
                        Dispatch Order
                      </button>
                    </div>
                  </div>
                </li>
              ))
          ) : (
            <li className="text-gray-500 italic">No orders in process!</li>
          )}
        </ul>
      </section>
      
      {dispatchPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">Dispatch Order</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Rider</label>
              <select
                value={selectedRider ? selectedRider.rider_id : ''}
                onChange={(e) => {
                  const rider = riders.find((r) => r.rider_id === Number(e.target.value));
                  setSelectedRider(rider);
                }}
                
                className="w-full p-2 border border-gray-300 rounded-lg bg-purple-50"
              >
                <option value="">Select a Rider</option>
                {riders.map((rider) => (
                  <option key={rider.rider_id} value={rider.rider_id}>
                    {rider.rider_name} - Bike no {rider.bikeNo}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                onClick={() => {
                  toggleDispatchPopup(false);
                  setSelectedRider(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleDispatch}
                disabled={!selectedRider}
              >
                Dispatch Order
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Orders Out for Delivery Section */}
      <section className="bg-blue-50 rounded-lg shadow-md p-4">
        <div className="flex justify-start items-center mb-3">
          <h2 className="text-xl font-bold text-blue-700">
            Orders Out for Delivery
          </h2>
        </div>
        <ul className="space-y-2">
          {restaurantOrders.filter(
            (order) => order.status === "Out for delivery"
          ).length > 0 ? (
            restaurantOrders
              .filter((order) => order.status === "Out for delivery")
              .map((order) => (
                <li
                  key={order.order_id}
                  className="border-b pb-2 text-gray-700"
                >
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold text-blue-500">
                        Order ID:
                      </span>{" "}
                      {order.order_id} - {order.address}
                    </div>
                    <div className="space-x-2">
                      <button
                        className="bg-purple-600 text-white py-1 px-2 rounded-lg hover:bg-purple-700"
                        onClick={() => 
                        {
                            setDetailsPopup(true);
                            setSelectedOrder(order);
                        }
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))
          ) : (
            <li className="text-gray-500 italic">
              No orders out for delivery!
            </li>
          )}
        </ul>
      </section>

    

    </div>
  );
};

export default AdminDashboard;
