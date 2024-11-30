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
          {selectedDeal ? 'Update Promo' : 'Create New Promo'}
        </h2>
        {/* Close Button */}
        <button
          onClick={() => setDealPopup(false)}
          className="text-white text-2xl hover:text-gray-200"
        >
          &times;
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
              className="py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition duration-200 w-full text-center"
            >
              Promo
            </button>
            <button
              onClick={() => setDealType("discount")}
              className="py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition duration-200 w-full text-center"
            >
              Discount
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
            <div className="mb-4">
              <label
                htmlFor="promo_code"
                className="block text-sm font-medium text-gray-700"
              >
                Promo Code
              </label>
              <input
                type="text"
                id="promo_code"
                value={newpromo.promo_code}
                onChange={(e) =>
                  setNewPromo((prev) => ({
                    ...prev,
                    promo_code: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="CXY6728"
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="promo_value"
                className="block text-sm font-medium text-gray-700"
              >
                Promo Value (%)
              </label>
              <input
                type="number"
                id="promo_value"
                value={newpromo.promo_value}
                onChange={(e) =>
                  setNewPromo((prev) => ({
                    ...prev,
                    promo_value: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="10"
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="min_spend"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Spend
              </label>
              <input
                type="number"
                id="min_spend"
                value={newpromo.Min_Total}
                onChange={(e) =>
                  setNewPromo((prev) => ({
                    ...prev,
                    Min_Total: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="250"
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                value={newpromo.start_date}
                onChange={(e) =>
                  setNewPromo((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                value={newpromo.end_date}
                onChange={(e) =>
                  setNewPromo((prev) => ({
                    ...prev,
                    end_date: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="limit"
                className="block text-sm font-medium text-gray-700"
              >
                Usage Limit
              </label>
              <input
                type="number"
                id="limit"
                name={selectedDeal ? 'usage_limit' : 'limit'}
                value={selectedDeal ? newpromo.usage_limit : newpromo.limit}
                onChange={(e) =>
                  setNewPromo((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter usage limit"
              />
            </div>
  
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
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
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                {selectedDeal ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-6">
          {/* Discount-specific popup */}
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
            <div className="mb-4">
              <label
                htmlFor="discount_value"
                className="block text-sm font-medium text-gray-700"
              >
                Discount Value (%)
              </label>
              <input
                type="number"
                id="discount_value"
                value={newDiscount.discount_value}
                onChange={(e) =>
                  setNewDiscount((prev) => ({
                    ...prev,
                    discount_value: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="10"
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                value={newDiscount.start_date}
                onChange={(e) =>
                  setNewDiscount((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
  
            <div className="mb-4">
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                value={newDiscount.end_date}
                onChange={(e) =>
                  setNewDiscount((prev) => ({
                    ...prev,
                    end_date: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
  
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                onClick={() => {
                  setSelectedDeal(null);
                  setDealPopup(false);
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
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

      if (response.status === 200) {
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
    <div className="min-h-screen bg-purple-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Restaurant Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage orders efficiently</p>
        </header>

        {/* Buttons for Promo Actions */}
        <div className="mb-8 flex justify-center space-x-4">
          <button
            onClick={() => {
              setDealPopup(true);
              console.log('selected deal' ,selectedDeal);
              
            }}
            className="bg-purple-500 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition duration-200"
          >
            New Deal
          </button>
          <button
            onClick={showDeals}
            className="bg-purple-500 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition duration-200"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Delivery Details
              </h2>
              <div className="space-y-4">
                <div className="text-gray-700">
                  <strong>Rider ID:</strong> {deliveryDetails[0].rider_id}
                </div>
                <div className="text-gray-700">
                  <strong>Rider Name:</strong> {deliveryDetails[0].rider_name}
                </div>
                <div className="text-gray-700">
                  <strong>Address:</strong> {deliveryDetails[0].address}
                </div>
                <button
                  className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Details
              </h2>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <>
                  <ul className="space-y-4 mb-4">
                    {selectedOrder.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <span className="font-semibold text-gray-700">
                            {item.dish_name}
                          </span>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-gray-700">
                          Rs. {item.sub_total}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    {/* Promo Value */}
                    {selectedOrder.promo_value !== "No Promo" && (
                      <div className="flex justify-between text-lg font-semibold text-gray-800">
                        <span>Promo applied:</span>
                        <span>{selectedOrder.promo_value}%</span>
                      </div>
                    )}
                    {/* Total Amount */}
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Total</span>
                      <span>Rs. {selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">No items in this order.</p>
              )}
              <button
                className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Manage Order
              </h2>
              <div className="mb-4">
                <p>
                  <strong>Order ID:</strong> {selectedOrder.order_id}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.address}
                </p>
                <p>
                  <strong>Current Status:</strong> {selectedOrder.status}
                </p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Dispatch Order
              </h2>
              <div className="mb-4">
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
        {/* Trigger the deals popup */}
        {showDealsPop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Current Deals</h2>
                <button
                  className="text-2xl text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setShowDeals(false);
                  }}
                >
                  &times; {/* Close button (×) */}
                </button>
              </div>

              <div className="space-y-4">
                {/* Display Promos */}
                {availablePromos.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Active Promos
                    </h3>
                    {availablePromos.map((promo) => (
                      <div
                        key={promo.promo_id}
                        className="flex justify-between items-center p-4 border-b"
                      >
                        <div>
                          <span className="font-semibold">
                            {promo.promo_code}
                          </span>
                          <p className="text-sm text-gray-600">
                            Discount: {promo.promo_value}%
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <FaEdit
                            className="text-blue-500 cursor-pointer"
                            onClick={() => updateDeal(promo.promo_id, 'promo')}
                          />
                          <FaTrash
                            className="text-red-500 cursor-pointer"
                            onClick={() =>
                              handleDelete(promo.promo_id, "promo")
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Display Discounts */}
                {availableDiscount.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Active Discount
                    </h3>
                    {availableDiscount.map((discount) => (
                      <div
                        key={discount.discount_id}
                        className="flex justify-between items-center p-4 border-b"
                      >
                        <div>
                          <p className="text-sm text-gray-600">
                            Discount: {discount.discount_value}%
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <FaEdit
                            className="text-blue-500 cursor-pointer"
                            onClick={() => updateDeal(discount.discount_id, 'discount')}
                          />
                          <FaTrash
                            className="text-red-500 cursor-pointer"
                            onClick={() =>
                              handleDelete(discount.discount_id, "discount")
                            }
                          />
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
