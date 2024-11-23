import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import {ChevronRight} from 'lucide-react'
import axios from "axios";

const AdminDashboard = () => {
  const { getRestaurantOrders, currentOrders } = useUserContext();
  const [managePopup, toggleManagePopup] = useState(false);
  const [riders,setRiders] = useState([]);
  const [dispatchPopup, toggleDispatchPopup] = useState(false);

  const [orderDetails, setOrderDetails] = useState({
    Customer_name: '', Address: ''
  });

  useEffect(()=>{
    axios
    .get('/api/getAvaliableRiders')
    .then(res => {
      console.log('setting riders ',res.data.riders);
      
      setRiders(res.data.riders);
    }).catch(err => {
      console.log(err.message);
    })
  },[])

  const ManageIt = (id) => {
    const order = currentOrders.find(order => order.Order_id === id);
    if (order) {
      setOrderDetails(order);
      toggleManagePopup(true);
    }
  };


  const DispatchIt = id => {
    

  }

  const changeRider = value => {
    setOrderDetails(prev => ({
      ...prev,
      Delivered_by_id : value
    }))
  }

  const userOrders = [
    { id: 1, customerName: "John Doe", orderDetails: "Pizza, Salad", status: "In Process" },
    { id: 2, customerName: "Jane Smith", orderDetails: "Pasta, Soup", status: "Placed" },
  ];

  const ordersInProcess = [
    { id: 3, customerName: "Alice Brown", orderDetails: "Burger, Fries", chef: "Chef Mike" },
    { id: 4, customerName: "Bob Martin", orderDetails: "Sushi, Tea", chef: "Chef Alice" },
  ];

  useEffect(() => {
    // async function fetchOrders() {
    //   await getRestaurantOrders();
    // }
    // fetchOrders();
    getRestaurantOrders();
  }, [])

  return (
    <>
      <div className="container mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="text-center text-purple-700">
          <h1 className="text-3xl font-bold">Restaurant Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage orders efficiently</p>
        </div>

        {/* Orders Placed by Users Section */}
        <section className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-start items-center mb-3">
            <h2 className="text-xl font-bold text-purple-700">Orders Placed</h2>

          </div>
          <ul className="space-y-2">
            {console.log('placed orders are ', currentOrders.filter(ele => ele.Order_status === 'Placed'))}
            {console.log(currentOrders.filter(ele => ele.Order_status === 'Preparing'))}
            {currentOrders.length > 0 ? (
              currentOrders.filter(ele => ele.Order_status === 'Placed').map((order) => (
                <li key={order.Order_id} className="border-b pb-2 text-gray-700">
                  <div className="justify-between flex flex-row flex-wrap-reverse">
                    <div>
                      <span className="font-semibold text-purple-500">
                        {order.Customer_name}
                      </span>{" "}
                      - {order.Address}{" "}
                      <span className="text-sm text-gray-500 italic">({order.Order_status})</span>
                    </div>
                    <div>
                      <button className="bg-purple-600 text-white py-1 px-2 mx-1 rounded-lg hover:bg-purple-700 w-full sm:w-auto" onClick={() => ManageIt(order.Order_id)}>Manage</button>
                      <button className="bg-purple-600 text-white py-1 px-2 rounded-lg hover:bg-purple-700 w-full sm:w-auto" onClick={() => { DispatchIt(order.Order_id) }}>Dispatch</button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No orders placed yet!</li>
            )}
          </ul>
        </section>

        {/* Orders In Process Section */}
        <section className="bg-purple-50 rounded-lg shadow-md p-4">
          <div className="flex justify-start items-center mb-3">
            <h2 className="text-xl font-bold text-purple-700">Orders In Process</h2>
          </div>
          <ul className="space-y-2">
            {currentOrders.length > 0 ? (
              currentOrders.filter(ele => ele.Order_status === 'Preparing').map((order) => (
                <li key={order.Order_id} className="text-gray-700">
                  <span className="font-semibold text-purple-500">
                    {order.Customer_name}
                  </span>{" "}
                  - {order.Address}
                  {order.Delivered_by_id &&
                    <span className="text-purple-600">{' Delivered by ' + order.Delivered_by_id}</span>
                  }
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No orders in process!</li>
            )}
          </ul>
        </section>
      </div>

      {managePopup
        &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              Manage Order
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="Customer_name"
                  className="w-full border rounded-lg py-2 px-3 text-gray-700"
                  value={orderDetails.Customer_name}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="price"
                  name="Address"
                  className="w-full border rounded-lg py-2 px-3 text-gray-700"
                  value={orderDetails.Address}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Rider
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={orderDetails.Delivered_by_id}
                    onChange={(e) => changeRider(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  >
                    {riders.length > 0 ?
                      riders.map(ele => (
                        <option value={ele.Rider_id}>{ele.Rider_name}</option>
                      ))
                      :
                      <option value="">No Rider Available</option>
                    }
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={16} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
                  onClick={() => { setOrderDetails({}); toggleManagePopup(false); }}
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
};

export default AdminDashboard;
