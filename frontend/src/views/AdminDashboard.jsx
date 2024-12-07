import React, { useEffect, useState, setI } from "react";
import { useUserContext } from "../contexts/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaUtensils,
  FaTruck,
  FaEye,
  FaCog,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useAlertContext } from "../contexts/alertContext";
import { X, Truck, User,Calendar, DollarSign, Hash, Users , MapPin ,ShoppingBag, Tag, CreditCard, Package, Clock, ChefHat, Percent, Edit2, Trash2  } from 'lucide-react';

const DealsPopup = ({ setDealPopup,selectedDeal,setSelectedDeal }) => {
  const [dealType, setDealType] = useState(null);
  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const [newDiscount, setNewDiscount] = useState({
    discount_value: "",
    start_date: "",
    end_date: "",
  });

  const [newpromo, setNewPromo] = useState({
    promo_code: "",
    promo_value: "",
    start_date: "",
    end_date: "",
    limit: 0,
    Min_Total: 0,
  });

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  };

  useEffect(()=>{
    if(selectedDeal){
      if(selectedDeal.Type === 'discount') setNewDiscount({...selectedDeal, start_date : formatDate(selectedDeal.start_date), end_date : formatDate(selectedDeal.end_date)})
      if(selectedDeal.Type === 'promo') setNewPromo({...selectedDeal, start_date : formatDate(selectedDeal.start_date), end_date : formatDate(selectedDeal.end_date)})
        setDealType(selectedDeal.Type)      
    }
  
  },[])

  // const [NewPromoPopup, setNewPromoPopup] = useState(false);

  const handlePromoSubmit = async () => {

    try {
      const response = await axios.post(
        `/api/addPromo/${userData.Location_id}`,
        newpromo
      );
      if (response.status === 200) {
        setAlert({
          message: "New promo added",
          type: "success",
        });
        setDealPopup(false);
        setNewPromo({
          promo_code: "",
          promo_value: "",
          start_date: "",
          end_date: "",
          limit: 0,
          Min_Total: 0,
        });
      }
    } catch (err) {
      console.log(err.response);
      setAlert({
        message: "Error adding promo",
        type: "failure",
      });
    } finally {
      setDealType(null);
    }
  };

  const handlePromoUpdate = () => {
    let temp;
    console.log('New promo is ',newpromo);
    if(dealType === 'promo') temp = { ...newpromo, Type : 'promo'};
    else temp = {...newDiscount, Type : 'discount'}
    console.log('sending update request for deal ',temp);
    axios.post('/api/updateDeal',JSON.stringify(temp),{
      withCredentials : true,
      headers: {
        'Content-Type': 'application/json' // Explicitly set Content-Type to JSON
      }
    })
    .then(res => {
      setSelectedDeal(null);
      setAlert({ message : 'Deal updated',type : 'success'})
    })
    .catch(err => {
      console.log(err.message);
      setAlert({ message : 'Cannot update deal',type : 'failure'})
    })
    .finally(()=>{
      setDealType(null);
      setDealPopup(false);
    })
  }

  const handleDiscountSubmit = async () => {

    try {
      console.log("Sending request for", newDiscount);

      const response = await axios.post(
        `/api/addDiscount/${userData.Location_id}`,
        newDiscount
      );

      if (response.status === 201 || response.status === 200) {
        setAlert({
          message: "New discount added successfully!",
          type: "success",
        });

        setDealPopup(false);
        setNewDiscount({
          discount_value: "",
          start_date: "",
          end_date: "",
        });
      } else if (response.status === 409) {
        setAlert({
          message:
            response.data.message ||
            "You can only have one active flat discount.",
          type: "failure",
        });
      }
    } catch (err) {
      console.error(err.response);

      setAlert({
        message:
          err.response?.data?.message ||
          "An error occurred while adding the discount. Please try again later.",
        type: "failure",
      });
    } finally {
      setDealType(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {selectedDeal ? 'Update Deal' : 'Create New Deal'}
          </h2>
          <button
            onClick={() => setDealPopup(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {!dealType ? (
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Select Deal Type
            </h3>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setDealType("promo")}
                className="py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition duration-200 w-full text-center flex items-center justify-center space-x-2"
              >
                <Percent size={20} />
                <span>Promo</span>
              </button>
              <button
                onClick={() => setDealType("discount")}
                className="py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition duration-200 w-full text-center flex items-center justify-center space-x-2"
              >
                <DollarSign size={20} />
                <span>Discount</span>
              </button>
            </div>
          </div>
        ) : dealType === "promo" ? (
          <div className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedDeal) {
                  setSelectedDeal({ ...newpromo, Type: dealType });
                  handlePromoUpdate();
                } else {
                  handlePromoSubmit();
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="promo_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      id="promo_code"
                      value={newpromo.promo_code}
                      onChange={(e) => setNewPromo((prev) => ({ ...prev, promo_code: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                      placeholder="CXY6728"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="promo_value" className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Value (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      id="promo_value"
                      value={newpromo.promo_value}
                      onChange={(e) => setNewPromo((prev) => ({ ...prev, promo_value: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="min_spend" className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Spend
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      id="min_spend"
                      value={newpromo.Min_Total}
                      onChange={(e) => setNewPromo((prev) => ({ ...prev, Min_Total: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                      placeholder="250"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      id="start_date"
                      value={newpromo.start_date}
                      onChange={(e) => setNewPromo((prev) => ({ ...prev, start_date: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      id="end_date"
                      value={newpromo.end_date}
                      onChange={(e) => setNewPromo((prev) => ({ ...prev, end_date: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      id="limit"
                      name={selectedDeal ? 'usage_limit' : 'limit'}
                      value={selectedDeal ? newpromo.usage_limit : newpromo.limit}
                      onChange={(e) => setNewPromo((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                      placeholder="Enter usage limit"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
                  onClick={() => {
                    setSelectedDeal(null);
                    setDealType(null);
                    setDealPopup(false);
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
                >
                  {selectedDeal ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedDeal) {
                  setSelectedDeal({ ...newDiscount, Type: dealType });
                  handlePromoUpdate();
                } else {
                  handleDiscountSubmit();
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      id="discount_value"
                      value={newDiscount.discount_value}
                      onChange={(e) => setNewDiscount((prev) => ({ ...prev, discount_value: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      id="start_date"
                      value={newDiscount.start_date}
                      onChange={(e) => setNewDiscount((prev) => ({ ...prev, start_date: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      id="end_date"
                      value={newDiscount.end_date}
                      onChange={(e) => setNewDiscount((prev) => ({ ...prev, end_date: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
                  onClick={() => {
                    setSelectedDeal(null);
                    setDealPopup(false);
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
                >
                  {selectedDeal ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const {
    getRestaurantOrders,
    restaurantOrders,
    loggedIn,
    setRestaurantOrders,
    userData,
  } = useUserContext();
  const navigate = useNavigate();
  const [managePopup, toggleManagePopup] = useState(false);
  const [riders, setRiders] = useState([]);
  const [dispatchPopup, toggleDispatchPopup] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [viewdeliveryDetails, setDeliveryDetailsPopup] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  const { setAlert } = useAlertContext();

  const [availablePromos, setAvailablePromos] = useState([]);
  const [availableDiscount, setAvailableDiscount] = useState([]);
  const [showDealsPop, setShowDeals] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState({});

  const showDeals = () => {
    axios
      .get(`/api/getCurrentDeals/${userData.Location_id}`)
      .then((res) => {
        setAvailablePromos(res.data.promos);
        setAvailableDiscount(res.data.discounts);
        setShowDeals(true);
      })
      .catch((err) => setAlert({ message: err.message, type: "failure" }));
  };

  const [dealPopup, setDealPopup] = useState(false);

  useEffect(() => {
    if (!loggedIn) navigate("/");
    setSelectedDeal(null);
  }, [loggedIn, navigate]);

  useEffect(() => {}, [restaurantOrders]);

  const getRiders = async () => {
    try {
      const res = await axios.get(
        `/api/getAvaliableRiders/${userData.Location_id}`
      );
      if (JSON.stringify(res.data) !== JSON.stringify(riders)) {
        console.log("Updating riders data");
        setRiders(res.data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (dispatchPopup) {
      getRiders();
      const interval = setInterval(() => {
        getRiders();
      }, 100000);

      return () => clearInterval(interval);
    }
  }, [dispatchPopup]);

  useEffect(() => {
    if (viewdeliveryDetails) {
      console.log("selected order out deliver ", selectedOrder);
      axios
        .get(`/api/getDeliveryDetails/${selectedOrder.order_id}`)
        .then((res) => {
          console.log("Delivery details fetched ", res.data);
          setDeliveryDetails(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [viewdeliveryDetails]);

  const handleUpdateStatus = async (order, new_status) => {
    try {
      const response = await axios.post(`/api/updateOrder/${order.order_id}`, {
        status: new_status,
      });
      if (response.status === 200) {
        const updatedOrder = { ...order, status: new_status };
        const updatedOrders = restaurantOrders.map((o) =>
          o.order_id === updatedOrder.order_id ? updatedOrder : o
        );
        setRestaurantOrders(updatedOrders);
        toggleManagePopup(false);
        setAlert({
          message: "Preparing the order..",
          type: "success",
        });
      }
    } catch (err) {
      setAlert({
        message: "Error updating Order status",
        type: "failure",
      });
    }
  };

  const handleDispatch = async () => {
    if (!selectedOrder || !selectedRider) return;

    try {
      await handleUpdateStatus(selectedOrder, "Out for delivery");
      const response = await axios.post(
        `/api/dispatchOrder/${selectedOrder.order_id}`,
        { rider_id: selectedRider.rider_id }
      );
      const order = {
        customer_name : selectedOrder.customer_name,
        customer_email : selectedOrder.email_address,
        order_id : selectedOrder.order_id,
        rider_id : selectedRider.rider_id,
        rider_email: selectedRider.email_address,
        rider_name : selectedRider.rider_name,
        rider_contact : selectedRider.Phone_No,
        delivery_addres : selectedOrder.address,
        total_amount : selectedOrder.total_amount
      }
      const res = await axios.post('/api/send-status-email',order);
      if (response.status === 200 && res.status === 200) {
        const updatedOrder = {
          ...selectedOrder,
          rider_id: selectedRider.rider_id,
        };
        const updatedOrders = restaurantOrders.map((order) =>
          order.order_id === updatedOrder.order_id ? updatedOrder : order
        );
        setRestaurantOrders(updatedOrders);
        toggleDispatchPopup(false);
        setSelectedRider(null);
        setSelectedOrder(null);

        setAlert({
          message: "Order dispatched",
          type: "success",
        });
      }
    } catch (err) {
      setAlert({
        message: "Error dispatching order",
        type: "failure",
      });
    }
  };

  useEffect(() => {
    getRestaurantOrders();
    const interval = setInterval(() => {
      getRestaurantOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [managePopup, dispatchPopup]);

  useEffect(() => {
    if (!dispatchPopup) {
      setSelectedRider(null);
    }
  }, [dispatchPopup]);
  
  const handleDelete = async (deal_id, deal_type) => {
    try {
      const response = await axios.post(`/api/deleteDeal/${deal_id}`, {
        Type: deal_type,
        Location_id: userData.Location_id,
      });

      if (response.status === 200) {
        setAlert({ message: `Deleted ${deal_type}`, type: "success" });

        if (deal_type === "promo") {
          setAvailablePromos(
            availablePromos.filter((ele) => ele.promo_id !== deal_id)
          );
        } else {
          setAvailableDiscount(
            availableDiscount.filter((ele) => ele.discount_id !== deal_id)
          );
        }
      }
    } catch (err) {
      setAlert({ message: `Error deleting ${deal_type}`, type: "failure" });
    }
  };

  const updateDeal = (promoId,Type) => {
    let temp;
    if(Type === 'promo') temp = {...availablePromos.find(ele => ele.promo_id === promoId), Type}; 
    else temp = {...availableDiscount.find(ele => ele.discount_id === promoId),Type}; 
    
    console.log('temp is :' , temp);
    setSelectedDeal(temp); 
    setShowDeals(false);
    setDealPopup(true);
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Restaurant Admin Dashboard
          </h1>
          <p className="text-gray-700 text-lg">Manage orders efficiently</p>
        </header>

        {/* Buttons for Promo Actions */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              setDealPopup(true);
              console.log('selected deal', selectedDeal);
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-purple-800 hover:shadow-lg transition duration-200 ease-in-out"
          >
            New Deal
          </button>
          <button
            onClick={showDeals}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-purple-800 hover:shadow-lg transition duration-200 ease-in-out"
          >
            View Deals
          </button>
        </div>
        {dealPopup && <DealsPopup setDealPopup={setDealPopup} selectedDeal = {selectedDeal} setSelectedDeal={setSelectedDeal} />}

        {/* Grid Section for Orders */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-yellow-500" /> Orders Placed
            </h2>
            {restaurantOrders.filter((order) => order.status === "Placed")
              .length > 0 ? (
              restaurantOrders
                .filter((order) => order.status === "Placed")
                .map((order) => (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-800">
                        Order #{order.order_id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "Placed"
                            ? "bg-yellow-200 text-yellow-800"
                            : order.status === "Preparing"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{order.address}</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setDetailsPopup(true);
                          setSelectedOrder(order);
                        }}
                        className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-200 transition duration-300 flex items-center"
                      >
                        <FaEye className="mr-2" /> View Details
                      </button>
                      <button
                        onClick={() => {
                          toggleManagePopup(true);
                          setSelectedOrder(order);
                        }}
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
            {restaurantOrders.filter((order) => order.status === "Preparing")
              .length > 0 ? (
              restaurantOrders
                .filter((order) => order.status === "Preparing")
                .map((order) => (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-800">
                        Order #{order.order_id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "Placed"
                            ? "bg-yellow-200 text-yellow-800"
                            : order.status === "Preparing"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{order.address}</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setDetailsPopup(true);
                          setSelectedOrder(order);
                        }}
                        className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-200 transition duration-300 flex items-center"
                      >
                        <FaEye className="mr-2" /> View Details
                      </button>
                      <button
                        onClick={() => {
                          toggleDispatchPopup(true);
                          setSelectedOrder(order);
                        }}
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
              <FaTruck className="mr-2 text-green-500" /> Orders Out for
              Delivery
            </h2>
            {restaurantOrders.filter(
              (order) => order.status === "Out for delivery"
            ).length > 0 ? (
              restaurantOrders
                .filter((order) => order.status === "Out for delivery")
                .map((order) => (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-800">
                        Order #{order.order_id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "Placed"
                            ? "bg-yellow-200 text-yellow-800"
                            : order.status === "Preparing"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{order.address}</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setDeliveryDetailsPopup(true);
                        }}
                        className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-200 transition duration-300 flex items-center"
                      >
                        <FaEye className="mr-2" /> View Delivery Details
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 italic">
                No orders out for delivery!
              </p>
            )}
          </section>
        </div>


{deliveryDetails && viewdeliveryDetails && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ease-out scale-95 hover:scale-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Delivery Details</h2>
        <button 
          onClick={() => {
            setDeliveryDetailsPopup(false);
            setDeliveryDetails(null);
          }}
          className="text-white hover:text-gray-200 transition-colors duration-200"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4 text-gray-700">
          <Truck size={24} className="text-indigo-500" />
          <span className="font-medium">Rider ID:</span>
          <span className="font-light text-gray-600 ml-auto">{deliveryDetails[0].rider_id}</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-700">
          <User size={24} className="text-indigo-500" />
          <span className="font-medium">Rider Name:</span>
          <span className="font-light text-gray-600 ml-auto">{deliveryDetails[0].rider_name}</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-700">
          <MapPin size={24} className="text-indigo-500" />
          <span className="font-medium">Address:</span>
          <span className="font-light text-gray-600 ml-auto">{deliveryDetails[0].address}</span>
        </div>
      </div>
      
      {/* Close Button */}
      <div className="px-6 pb-6">
        <button
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            setDeliveryDetailsPopup(false);
            setDeliveryDetails(null);
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


{detailsPopup && selectedOrder && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 ease-out scale-95 hover:scale-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <ShoppingBag className="mr-2" size={24} />
          Order Details
        </h2>
        <button 
          onClick={() => setDetailsPopup(false)}
          className="text-white hover:text-gray-200 transition-colors duration-200"
          aria-label="Close details"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-6">
        {selectedOrder.items && selectedOrder.items.length > 0 ? (
          <>
            <ul className="space-y-4 mb-6">
              {selectedOrder.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 pb-4"
                >
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <ShoppingBag className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">
                        {item.dish_name}
                      </span>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Rs. {item.sub_total}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {selectedOrder.promo_value !== "No Promo" && (
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-gray-700 flex items-center">
                    <Tag className="mr-2 text-green-500" size={20} />
                    Promo applied:
                  </span>
                  <span className="font-semibold text-green-600">{selectedOrder.promo_value}% OFF</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold text-gray-800 flex items-center">
                  <CreditCard className="mr-2 text-purple-600" size={24} />
                  Total
                </span>
                <span className="font-bold text-purple-600">Rs. {selectedOrder.total_amount}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic flex items-center justify-center h-32">
            <ShoppingBag className="mr-2 text-gray-400" size={24} />
            No items in this order.
          </p>
        )}
      </div>

      <div className="px-6 pb-6">
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setDetailsPopup(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{managePopup && selectedOrder && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ease-out scale-95 hover:scale-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Package className="mr-2" size={24} />
          Manage Order
        </h2>
        <button 
          onClick={() => toggleManagePopup(false)}
          className="text-white hover:text-gray-200 transition-colors duration-200"
          aria-label="Close manage order"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <p className="flex items-center text-gray-700">
            <Package className="mr-2 text-purple-600" size={20} />
            <strong className="mr-2">Order ID:</strong> {selectedOrder.order_id}
          </p>
          <p className="flex items-center text-gray-700">
            <MapPin className="mr-2 text-purple-600" size={20} />
            <strong className="mr-2">Address:</strong> {selectedOrder.address}
          </p>
          <p className="flex items-center text-gray-700">
            <Clock className="mr-2 text-purple-600" size={20} />
            <strong className="mr-2">Current Status:</strong> 
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
              {selectedOrder.status}
            </span>
          </p>
        </div>
        
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center"
          onClick={() => handleUpdateStatus(selectedOrder, "Preparing")}
        >
          <ChefHat className="mr-2" size={20} />
          Change Status to Preparing
        </button>
        
        <button
          className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
          onClick={() => toggleManagePopup(false)}
        >
          <X className="mr-2" size={20} />
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      {dispatchPopup && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ease-out scale-95 hover:scale-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Truck className="mr-2" size={24} />
          Dispatch Order
        </h2>
        <button 
          onClick={() => {
            toggleDispatchPopup(false);
            setSelectedRider(null);
          }}
          className="text-white hover:text-gray-200 transition-colors duration-200"
          aria-label="Close dispatch popup"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Rider
          </label>
          <select
            value={selectedRider ? selectedRider.rider_id : ""}
            onChange={(e) => {
              const rider = riders.find(
                (r) => r.rider_id === Number(e.target.value)
              );
              setSelectedRider(rider);
            }}
            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
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
            className="bg-gray-100 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
              toggleDispatchPopup(false);
              setSelectedRider(null);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleDispatch}
            disabled={!selectedRider}
          >
            Dispatch Order
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        {/* Trigger the deals popup */}
        {showDealsPop && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 ease-out scale-95 hover:scale-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Tag className="mr-2" size={24} />
          Current Deals
        </h2>
        <button 
          onClick={() => setShowDeals(false)}
          className="text-white hover:text-gray-200 transition-colors duration-200"
          aria-label="Close deals popup"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {availablePromos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Tag className="mr-2 text-purple-600" size={20} />
              Active Promos
            </h3>
            {availablePromos.map((promo) => (
              <div
                key={promo.promo_id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div>
                  <span className="font-semibold text-purple-700">{promo.promo_code}</span>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Percent className="mr-1" size={16} />
                    Discount: {promo.promo_value}%
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateDeal(promo.promo_id, 'promo')}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    aria-label="Edit promo"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.promo_id, "promo")}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label="Delete promo"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {availableDiscount.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Percent className="mr-2 text-purple-600" size={20} />
              Active Discount
            </h3>
            {availableDiscount.map((discount) => (
              <div
                key={discount.discount_id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Percent className="mr-1" size={16} />
                    Discount: {discount.discount_value}%
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateDeal(discount.discount_id, 'discount')}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    aria-label="Edit discount"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(discount.discount_id, "discount")}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label="Delete discount"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default AdminDashboard;
