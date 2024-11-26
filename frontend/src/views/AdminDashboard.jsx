import React, { useEffect, useState ,setI } from "react";
import { useUserContext } from "../contexts/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaUtensils, FaTruck, FaEye, FaCog, FaMotorcycle ,FaBiking } from 'react-icons/fa';

const AdminDashboard = () => {
  const { getRestaurantOrders, restaurantOrders, loggedIn, setRestaurantOrders, userData } = useUserContext();
  const navigate = useNavigate();
  const [managePopup, toggleManagePopup] = useState(false);
  const [riders, setRiders] = useState([]);
  const [dispatchPopup, toggleDispatchPopup] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [viewdeliveryDetails,setDeliveryDetailsPopup] = useState(false);
  const [deliveryDetails,setDeliveryDetails] = useState(null);
  
  //ye karna hai
  const [newPromo,setNewpromo] = useState({
    promo_code : '',
    promo_value : '',
    start_date : '',
    end_date : '',
    status : 'active',
    limit : 0,
    restaurant_id : ''
  })

  const [promoPopup,setpromopopup] = useState(false);


  useEffect(() => {
    if (!loggedIn) navigate("/");
  }, [loggedIn, navigate]);
  
  useEffect(() => {

  },[restaurantOrders]);

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
  }, [dispatchPopup,userData.Location_id]);

  useEffect(() => {
    if(viewdeliveryDetails) {
      console.log('selected order out deliver ',selectedOrder);
      axios.get(`/api/getDeliveryDetails/${selectedOrder.order_id}`)
      .then((res) => {
          console.log('Delivery details fetched ',res.data);
          setDeliveryDetails(res.data);
      })
      .catch((err) => {
         console.log(err.message);
      })
    }
  },[selectedOrder]);

  const handleUpdateStatus = async (order, new_status) => {
    try {
      const response = await axios.post(`/api/updateOrder/${order.order_id}`, { status: new_status });
      if (response.status === 200) {
        const updatedOrder = { ...order, status: new_status };
        const updatedOrders = restaurantOrders.map((o) =>
          o.order_id === updatedOrder.order_id ? updatedOrder : o
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
      await handleUpdateStatus(selectedOrder, 'Out for delivery');
      const response = await axios.post(`/api/dispatchOrder/${selectedOrder.order_id}`, {rider_id: selectedRider.rider_id });

      if (response.status === 200) {
        const updatedOrder = { ...selectedOrder, rider_id: selectedRider.rider_id };
        const updatedOrders = restaurantOrders.map((order) =>
          order.order_id === updatedOrder.order_id ? updatedOrder : order
        );
        setRestaurantOrders(updatedOrders);
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
    const interval = setInterval(() => {
      getRestaurantOrders();
    }, 30000); 
    return () => clearInterval(interval); 
  }, [managePopup,dispatchPopup]); // Em

  useEffect(() => {
    if (!dispatchPopup) {
      setSelectedRider(null);
    }
  }, [dispatchPopup]);
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurant Admin Dashboard</h1>
          <p className="text-gray-600">Manage orders efficiently</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-yellow-500" /> Orders Placed
            </h2>
            {restaurantOrders.filter((order) => order.status === "Placed").length > 0 ? (
              restaurantOrders
                .filter((order) => order.status === "Placed")
                .map((order) => (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-gray-800">Order #{order.order_id}</span>
        <span className={`px-2 py-1 rounded-full text-sm ${
          order.status === "Placed" ? "bg-yellow-200 text-yellow-800" :
          order.status === "Preparing" ? "bg-blue-200 text-blue-800" :
          "bg-green-200 text-green-800"
        }`}>
          {order.status}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{order.address}</p>
      <div className="flex justify-end space-x-2">
          <button
            onClick={() => {setDetailsPopup(true); setSelectedOrder(order)}}
            className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-200 transition duration-300 flex items-center"
          >
            <FaEye className="mr-2" /> View Details
          </button>
          <button
            onClick={() => {toggleManagePopup(true);setSelectedOrder(order)}}
            className="bg-purple-100 text-purple-600 px-3 py-1 rounded-md hover:bg-purple-200 transition duration-300 flex items-center"
          >
            <FaCog className="mr-2" /> Manage
          </button>
      </div>
    </div>
                ))
            ) : (
              <p className="text-gray-500 italic">No orders placed yet!</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUtensils className="mr-2 text-blue-500" /> Orders In Process
            </h2>
            {restaurantOrders.filter((order) => order.status === "Preparing").length > 0 ? (
              restaurantOrders
                .filter((order) => order.status === "Preparing")
                .map((order) => (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-800">Order #{order.order_id}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === "Placed" ? "bg-yellow-200 text-yellow-800" :
                      order.status === "Preparing" ? "bg-blue-200 text-blue-800" :
                      "bg-green-200 text-green-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{order.address}</p>
                  <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {setDetailsPopup(true);setSelectedOrder(order)}}
                        className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-200 transition duration-300 flex items-center"
                      >
                        <FaEye className="mr-2" /> View Details
                      </button>
                      <button
                        onClick={() => {toggleDispatchPopup(true);setSelectedOrder(order)}}
                        className="bg-green-100 text-green-600 px-3 py-1 rounded-md hover:bg-green-200 transition duration-300 flex items-center"
                      >
                        <FaTruck className="mr-2" /> Dispatch
                      </button>
                  </div>
                </div>
                ))
            ) : (
              <p className="text-gray-500 italic">No orders in process!</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaTruck className="mr-2 text-green-500" /> Orders Out for Delivery
            </h2>
            {restaurantOrders.filter((order) => order.status === "Out for delivery").length > 0 ? (
              restaurantOrders
                .filter((order) => order.status === "Out for delivery")
                .map((order) => (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-800">Order #{order.order_id}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === "Placed" ? "bg-yellow-200 text-yellow-800" :
                      order.status === "Preparing" ? "bg-blue-200 text-blue-800" :
                      "bg-green-200 text-green-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{order.address}</p>
                  <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setDeliveryDetailsPopup(true);
                        }
                        }
                        className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-200 transition duration-300 flex items-center"
                      >
                        <FaEye className="mr-2" /> View Delivery Details
                      </button>
                  </div>
                </div>
                ))
            ) : (
              <p className="text-gray-500 italic">No orders out for delivery!</p>
            )}
          </section>
        </div>
        
        {
  deliveryDetails && viewdeliveryDetails  &&  (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Delivery Details</h2>
        <div className="space-y-4">
          <div className="text-gray-700">
            <strong>Rider ID:</strong> {deliveryDetails.rider_id}
          </div>
          <div className="text-gray-700">
            <strong>Rider Name:</strong> {deliveryDetails.rider_name}
          </div>
          <button
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                onClick={() =>{ 
                  setDeliveryDetailsPopup(false)
                  setDeliveryDetails(null)
                }}
              >
                Close
              </button>
        </div>
      </div>
    </div>
  )
}

        {detailsPopup && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <>
                  <ul className="space-y-4 mb-4">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <span className="font-semibold text-gray-700">{item.dish_name}</span>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-gray-700">Rs. {item.sub_total}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-lg font-semibold text-gray-800 border-t pt-4">
                    <span>Total</span>
                    <span>Rs. {selectedOrder.total}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">No items in this order.</p>
              )}
              <button
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                onClick={() => setDetailsPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {managePopup && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Order</h2>
              <div className="mb-4">
                <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                <p><strong>Current Status:</strong> {selectedOrder.status}</p>
              </div>
              <button
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
                onClick={() => handleUpdateStatus(selectedOrder, "Preparing")}
              >
                Change Status to Preparing
              </button>
              <button
                className="mt-4 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                onClick={() => toggleManagePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {dispatchPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Dispatch Order</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Rider</label>
                <select
                  value={selectedRider ? selectedRider.rider_id : ''}
                  onChange={(e) => {
                    const rider = riders.find((r) => r.rider_id === Number(e.target.value));
                    setSelectedRider(rider);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                  onClick={() => {
                    toggleDispatchPopup(false);
                    setSelectedRider(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleDispatch}
                  disabled={!selectedRider}
                >
                  Dispatch Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

