import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  CheckCircle,
  Bike
} from "lucide-react";
import {
  FaBars,
  FaChevronDown,
  FaUserCircle,
  FaPencilAlt,
  FaTimes,
  FaCheckCircle
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import { useCartContext } from "../contexts/cartContext";
import { useAlertContext } from "../contexts/alertContext";
import RatingPopup from "./RateOrder";
import { useNavigate } from "react-router-dom";

const ShowPastOrders = ({
  pastOrders,
  pastPopup,
  pastOrdersPopup,
  promptForReview,
  setSelectedOrder,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (pastPopup) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === pastOrders.length - 1 ? prev : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <>
      {pastPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-purple-50 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-purple-700 border-b border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Past Orders
                  </h2>
                  <p className="text-sm text-white">
                    You have {pastOrders.length} past orders
                  </p>
                </div>
                <button
                  onClick={() => {
                    pastOrdersPopup(false);
                    document.body.style.overflow = "unset";
                  }}
                  className="text-purple-400 hover:text-purple-600 transition-colors"
                  aria-label="Close past orders view"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div className="relative p-4">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  role="region"
                  aria-label="Order carousel"
                >
                  {pastOrders.map((order, index) => (
                    <div
                      key={order.order_id}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="bg-white rounded-md border border-purple-200 p-4 shadow-sm space-y-4">
                        {/* Order Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-purple-800">
                              Order #{order.order_id}  |   {order.restaurant_name}
                            </h3>
                            <p className="text-sm ">
                              <strong > {formatDate(order.order_date)}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium ">
                              Delivery Address
                              <span className="text-sm text-gray-700">
                             <strong>  {order.address}</strong>
                            </span>
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium  mb-1">
                              Order Items
                            </p>
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm"
                                >
                                  <span >
                                    {item.dish_name}{" "}
                                    <span className="text-purple-800">
                                      (x{item.quantity})
                                    </span>
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    Rs {item.sub_total}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">
                                Total
                              </span>
                              <span className="text-lg font-bold text-purple-700">
                                Rs {order.total_amount}
                              </span>
                            </div>
                          </div>
                          <div className="pt-4">
                            {order.review_id === null ? (
                              <button
                                onClick={() => {
                                  promptForReview(true);
                                  setSelectedOrder(order);
                                  pastOrdersPopup(false);
                                }}
                                className="flex items-center justify-center text-white bg-purple-600 hover:bg-purple-800 rounded-full py-2 px-6 text-sm font-semibold transition-colors"
                              >
                                Leave a Review
                              </button>
                            ) : (
                              <button
                                className="flex items-center justify-center text-white bg-green-500 hover:bg-green-600 rounded-full py-2 px-6 text-sm font-semibold transition-colors"
                                disabled
                              >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Reviewed
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Previous order"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
              )}

              {currentSlide < pastOrders.length - 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Next order"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              )}

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {pastOrders.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentSlide ? "bg-purple-600" : "bg-gray-300"
                    }`}
                    aria-label={`Go to order ${idx + 1}`}
                    aria-current={idx === currentSlide ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


function ShowCurrentOrders({
  currentOrders,
  cancelOrder,
  currentPopup,
  CurrentOrdersPopup,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (currentPopup) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === currentOrders.length - 1 ? prev : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };
  
  
  const shouldBlink = (stage, currentStatus) => {
    const stages = ["Placed", "Preparing", "Out for delivery", "Delivered"];
    const currentIdx = stages.indexOf(currentStatus);
    const stageIdx = stages.indexOf(stage);
    return stageIdx <= currentIdx;
  };

  return (
    <>
      {currentPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-purple-700 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Current Orders
                  </h2>
                  <p className="text-sm text-white mt-1">
                    You have {currentOrders.length} orders in process
                  </p>
                </div>
                <button
                  onClick={() => {
                    CurrentOrdersPopup(false);
                    document.body.style.overflow = "unset";
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close orders view"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div className="relative p-6">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  role="region"
                  aria-label="Order carousel"
                >
                  {currentOrders.map((order, index) => (
                    <div
                      key={order.order_id}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div className="bg-white rounded-xl border border-purple-100 p-6 shadow-md space-y-6">
                        {/* Order Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-purple-700">
                              Order #{order.order_id} |   {order.restaurant_name}
                            </h3>
                   
                          </div>
                          {(order.status === "Placed" ||
                            order.status === "Preparing") && (
                            <button
                              onClick={() => cancelOrder(order.order_id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                              aria-label={`Cancel order #${order.order_id}`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                            {[
                              "Placed",
                              "Preparing",
                              "Out for delivery",
                              "Delivered",
                            ].map((stage, idx) => (
                              <span
                                key={stage}
                                className={`text-center w-1/4 ${
                                  idx <=
                                  [
                                    "Placed",
                                    "Preparing",
                                    "Out for delivery",
                                    "Delivered",
                                  ].indexOf(order.status)
                                    ? "text-purple-600 font-medium"
                                    : ""
                                }`}
                              >
                                {stage}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {[
                              "Placed",
                              "Preparing",
                              "Out for delivery",
                              "Delivered",
                            ].map((stage, idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 flex-1 rounded-full transition-opacity duration-200 ${
                                  idx <=
                                  [
                                    "Placed",
                                    "Preparing",
                                    "Out for delivery",
                                    "Delivered",
                                  ].indexOf(order.status)
                                    ? "bg-purple-600"
                                    : "bg-gray-300"
                                } ${
                                  shouldBlink(stage, order.status)
                                    ? "animate-pulse" // two same properties were applied
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {/* Order Details */}
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium ">
                              Delivery Address: <span className="text-sm mt-1" > 
                              {order.address}
                              </span>
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">
                              Order Items
                            </p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm"
                                >
                                  <span>
                                    {item.dish_name}{"  "}
                                    <span className="text-purple-800">
                                      (x{item.quantity})
                                    </span>
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    Rs {item.sub_total}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">
                                Total
                              </span>
                              <span className="text-lg font-bold text-purple-600">
                                Rs {order.total_amount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  aria-label="Previous order"
                >
                  <ChevronLeft className="w-6 h-6 text-purple-600" />
                </button>
              )}

              {currentSlide < currentOrders.length - 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  aria-label="Next order"
                >
                  <ChevronRight className="w-6 h-6 text-purple-600" />
                </button>
              )}

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {currentOrders.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentSlide ? "bg-purple-600" : "bg-gray-300"
                    }`}
                    aria-label={`Go to order ${idx + 1}`}
                    aria-current={idx === currentSlide ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null); // Ref to handle outside click
  const {
    loggedIn,
    signout,
    userData,
    setUserData,
    bikeDetails,
    setBikeDetails,
    currentOrders,
    setCurrentOrders,
    pastOrders,
  } = useUserContext();

  const { setAlert } = useAlertContext();
  const { cartCount } = useCartContext();
  const [viewProfile, setViewProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordPopup, setPasswordPop] = useState(false);

  const [reviewPopup, promptForReview] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [newPassword, setNewPassword] = useState({
    first_entry: "",
    second_entry: "",
  });
  const [updatedDetails, setUpdated] = useState({
    User_id: 0,
    User_name: "",
    Email_address: "",
    phone_no: "",
    role: "",
  });
  const [bikePopup, setBikePopup] = useState(false);
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setUpdated((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [currentPopup, CurrentOrdersPopup] = useState(false);

  const cancelOrder = (order_id) => {
    axios
      .post(`/api/cancelOrder/${order_id}`,{Email : userData.Email_address,Name:userData.User_name})
      .then((response) => {
        
        const updatedOrders = currentOrders.filter(
          (order) => order.order_id !== order_id
        );
        setCurrentOrders(updatedOrders);
      })
      .catch((err) => {
        console.error("Error deleting the requested order", err);
      });
  };

  const [pastPopup, pastOrdersPopup] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleBikeChange = (e) => {
    e.preventDefault();
    axios
      .post(`/api/setVehicle/${userData.User_id}`, {
        bikeNo: bikeDetails.BikeNo,
      })
      .then((response) => {
        
        setBikePopup(false);
      })
      .catch((err) => {
        
      });
  };
  useEffect(() => {
    if (userData) {
      setUpdated({
        User_id: userData.User_id,
        User_name: userData.User_name,
        Email_address: userData.Email_address,
        phone_no: userData.phone_no,
        role: userData.role,
      });
    }
    setIsProfileMenuOpen(false);
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const signItOut = (e) => {
    if (cartCount === 0) {
      localStorage.removeItem(`${userData.User_id}_cart`);
    }
    e.preventDefault();
    try {
      signout();
      navigate('/');
    } catch (err) {
      
    }
  };

  const [deletePop, deleteAccountpop] = useState(false);

  const deleteAccount = async () => {
    const User_id = updatedDetails.User_id;
    const role = updatedDetails.role;
    try {
      signout();
      
      const response = await axios.post(`/api/deleteAccount/${User_id}`, {
        role,
      });
      if (response.status === 200) {
        setAlert({ message: "Account deleted, Goodbye!", type: "success" });
        deleteAccountpop(false);
      }
    } catch (err) {
      setAlert({
        message: "Error deleting account, Try Again!",
        type: "success",
      });
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Restaurants", path: "/restaurants" },
    // { label: "About Us", path: "/about" },
    // { label: "Contact", path: "/contact" },
  ];

  if (
    userData?.role === "Restaurant_Owner" ||
    userData?.role === "Delivery_Rider" ||
    userData?.role === "Restaurant_Admin"
  ) {
    const index = navItems.findIndex((item) => item.label === "Restaurants");
    if (index !== -1) {
      navItems.splice(index, 1);
    }
  }

  if (loggedIn && userData?.role === "Restaurant_Owner") {
    while (navItems.length > 0) navItems.pop();
    navItems.push({ label: "Owned", path: "/ownedRestaurants" });
  }

  if (loggedIn && userData?.role === "Delivery_Rider") {
    while (navItems.length > 0) navItems.pop();
    navItems.push({ label: "DashBoard", path: "/RiderDashboard" });
  }

  if (loggedIn && userData?.role === "Restaurant_Admin") {
    while (navItems.length > 0) navItems.pop();
    navItems.push({ label: "DashBoard", path: "/AdminDashboard" });
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPassword((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = () => {
    if (newPassword.first_entry !== newPassword.second_entry) {
      setAlert({ message: "Passwords do no match", type: "failure" });
      setNewPassword({
        first_entry: "",
        second_entry: "",
      });
    } else {
      setPasswordPop(false);
      handleSave();
      setNewPassword({
        first_entry: "",
        second_entry: "",
      });
    }
  };

  // Save updates
  const handleSave = () => {
    setUserData(updatedDetails);
    axios
      .post("/api/updateAccount", {
        userData: updatedDetails,
        password: newPassword.first_entry,
      })
      .then((response) => {
        
      })
      .catch((error) => {
        
      });
    
    setEditMode(false);
    setAlert({ message: "Account updated", type: "success" });
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="FoodGO Logo"
              className="h-8 w-auto"
            />
            <h2 className="text-2xl font-extrabold text-purple-600">FoodGO</h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center justify-between w-full">
            {/* Navigation Links - Centered */}
            <div className="flex-grow flex justify-center space-x-8">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "font-bold text-purple-700" : ""
                    } text-sm no-underline font-medium hover:border-b hover:transition-all hover:px-2 hover:duration-300 border-purple-700  text-purple-600 hover:text-purple-700 transition-all duration-300`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Login Button - Right aligned */}
            {!loggedIn && (
              <NavLink
                to="/login"
                className="inline-flex items-center no-underline px-4 py-2 border border-purple-600 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition duration-300"
              >
                Login
              </NavLink>
            )}
          </div>

          <div className="flex items-center space-x-4">
  {loggedIn && (
    <div className="relative">
      <button
        onClick={toggleProfileMenu}
        className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700 focus:outline-none"
      >
        <FaUserCircle className="hidden sm:block h-8 w-8 text-purple-600" />
        
        {/* Username with conditional green dot */}
        <div className="flex items-center space-x-1">
          <span className="hidden sm:inline font-medium">
            {userData.User_name.split(" ")[0]}
          </span>
          {userData.role === "Customer" && currentOrders.length > 0 && (
            <div className="hidden sm:inline w-3 h-3 bg-green-500 rounded-full animate-pulse sm:ml-1"></div>
          )}
        </div>

        <FaChevronDown
          className={`hidden sm:block h-5 w-5 text-purple-600 transform transition-transform duration-300 ease-in-out ${
            isProfileMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isProfileMenuOpen && (
        <div
          ref={profileMenuRef}
          className="absolute right-0 mt-2 w-max max-w-xs bg-purple-600 border border-purple-600 rounded-md shadow-lg z-20"
        >
          <button
            className="block w-full px-4 py-2 text-sm text-white hover:bg-purple-800"
            onClick={() => {
              setViewProfile(true);
              setIsProfileMenuOpen(false);
            }}
          >
            View Profile
          </button>

          {(userData.role === "Customer" ||
            userData.role === "Delivery_Rider") && (
            <button
              className="block w-full px-4 py-2 text-sm text-white hover:bg-purple-800"
              onClick={() => {
                deleteAccountpop(true);
                setIsProfileMenuOpen(false);
              }}
            >
              Delete Account
            </button>
          )}

          {userData.role === "Customer" && (
            <button
              className="block w-full px-4 py-2 text-sm text-white hover:bg-purple-800"
              onClick={() => {
                pastOrdersPopup(true);
                setIsProfileMenuOpen(false);
              }}
            >
              View Past Orders
            </button>
          )}
{userData.role === "Customer" && currentOrders.length > 0 && (
  <div className="flex items-center px-4 py-2 text-sm text-white hover:bg-purple-800">
    <button
      className="flex-1 text-left"
      onClick={() => {
        CurrentOrdersPopup(true);
        setIsProfileMenuOpen(false);
      }}
    >
      Current Orders
    </button>
    <div className="ml-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
  </div>
)}


          {userData.role === "Delivery_Rider" && (
            <button
              className="block w-full px-4 py-2 text-sm text-white hover:bg-purple-800"
              onClick={() => {
                setBikePopup(true);
                setIsProfileMenuOpen(false);
              }}
            >
              Change Vehicle Details
            </button>
          )}

          <button
            onClick={signItOut}
            className="block w-full px-4 py-2 text-sm text-white hover:bg-purple-800"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )}
</div>


          {/* Mobile Menu Toggle */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-purple-600 hover:text-purple-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-20">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? "bg-purple-100 text-purple-700 font-bold"
                          : "text-purple-600 hover:bg-purple-100 hover:text-purple-700"
                      } transition duration-300`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {!loggedIn && (
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? "bg-purple-100 text-purple-700 font-bold"
                          : "text-purple-600 hover:bg-purple-100 hover:text-purple-700"
                      } transition duration-300`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                )}

                {/* Mobile Profile Section */}
                {/* Mobile Profile Section */}
{loggedIn && (
  <div className="border-t border-purple-200 pt-4">
    <div className="flex items-center px-3 space-x-3">
      <FaUserCircle className="h-8 w-8 text-purple-600" />
      <div>
        <div className="text-base font-medium text-purple-700">
          {userData.User_name}
        </div>
        <div className="text-sm text-purple-500">
          {userData.Email_address}
        </div>
      </div>
    </div>
    <div className="mt-3 space-y-1">
      <button
        onClick={() => {
          setViewProfile(true);
          setIsMenuOpen(false);
        }}
        className="block w-full text-left px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-100 hover:text-purple-700"
      >
        View Profile
      </button>

      {(userData.role === "Customer" ||
        userData.role === "Delivery_Rider") && (
        <button
          onClick={() => deleteAccountpop(true)}
          className="block w-full text-left px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-100 hover:text-purple-700"
        >
          Delete Account
        </button>
      )}

      {userData.role === "Customer" && currentOrders.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-100 hover:text-purple-700">
          <button
            className="flex-1 text-left"
            onClick={() => {
              CurrentOrdersPopup(true);
              setIsMenuOpen(false);
            }}
          >
            View Current Orders
          </button>
          <div className="ml-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {userData.role === "Customer" && pastOrders.length > 0 && (
        <div className="mt-3 space-y-1">
          <button
            className="block w-full text-left px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-100 hover:text-purple-700"
            onClick={() => {
              pastOrdersPopup(true);
              setIsMenuOpen(false);
            }}
          >
            View Past Orders
          </button>
        </div>
      )}

      {userData.role === "Delivery_Rider" && (
        <button
          onClick={() => {
            setBikePopup(true);
            setIsMenuOpen(false);
          }}
          className="block w-full text-left px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-100 hover:text-purple-700"
        >
          Change Vehicle Details
        </button>
      )}

      <button
        onClick={(e) => {
          signItOut(e);
          setIsMenuOpen(false);
        }}
        className="block w-full text-left px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-100 hover:text-purple-700"
      >
        Sign Out
      </button>
    </div>
  </div>
)}

              </div>
            </div>
          )}

          {pastPopup && (
            <ShowPastOrders
              pastOrders={pastOrders}
              pastPopup={pastPopup}
              pastOrdersPopup={pastOrdersPopup}
              promptForReview={promptForReview}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {reviewPopup && (
            <RatingPopup
              order={selectedOrder}
              onClose={() => promptForReview(false)}
            />
          )}
          {currentPopup && (
            <ShowCurrentOrders
              currentOrders={currentOrders}
              cancelOrder={cancelOrder}
              currentPopup={currentPopup}
              CurrentOrdersPopup={CurrentOrdersPopup}
            />
          )}

{bikePopup && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105">
      <h2 className="text-3xl font-semibold text-purple-700 text-center mb-5">
        Update Your Vehicle
      </h2>
      <p className="text-gray-600 text-base text-center mb-6">
        Please provide your new bike's number plate.
      </p>
      <form className="space-y-5" onSubmit={handleBikeChange}>
        <div>
          <label
            htmlFor="numberPlate"
            className="block text-gray-700 text-sm font-medium mb-2"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Submit</span>
          <Bike className="w-5 h-5 text-white" />
        </button>
      </form>
    </div>
  </div>
)}

          {viewProfile && (
            <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transform transition-all duration-300 hover:scale-[1.01]">
                <button
                  className="absolute top-4 left-4 text-purple-600 hover:text-purple-800 transition-colors duration-200 z-10"
                  onClick={() => setViewProfile(false)}
                >
                  <FaTimes className="text-2xl" />
                </button>

                <button
                  className="absolute top-4 right-4 text-purple-600 hover:text-purple-800 transition-colors duration-200 z-10"
                  onClick={() => setEditMode(!editMode)}
                >
                  <FaPencilAlt className="text-xl" />
                </button>

                <div className="p-6 space-y-6">
                  <h2 className="text-3xl font-extrabold text-purple-600 text-center mb-6 tracking-tight">
                    Your Profile
                  </h2>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="User_name"
                      value={updatedDetails.User_name}
                      onChange={handleDetailChange}
                      readOnly={!editMode}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg text-gray-700 
            bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
            transition-all duration-300 ease-in-out"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="Email_address"
                      value={updatedDetails.Email_address}
                      onChange={handleDetailChange}
                      readOnly={!editMode}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg text-gray-700 
            bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
            transition-all duration-300 ease-in-out"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone_no"
                      value={updatedDetails.phone_no}
                      onChange={handleDetailChange}
                      readOnly={!editMode}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg text-gray-700 
            bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
            transition-all duration-300 ease-in-out"
                    />
                  </div>

                  {/* Change Password */}
                  <div className="mb-4">
                    <button
                      onClick={() => setPasswordPop(true)}
                      className="w-full py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 
            transition duration-300 ease-in-out transform hover:scale-[1.02]"
                    >
                      Change Password
                    </button>
                  </div>

                  {passwordPopup && (
                    <div className="fixed inset-0  backdrop-blur-sm  flex justify-center items-center z-50">
                      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
                        <button
                          className="absolute top-4 right-4 text-purple-600 hover:text-purple-800"
                          onClick={() => setPasswordPop(false)}
                        >
                          <FaTimes className="text-2xl" />
                        </button>

                        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
                          Change Password
                        </h2>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="first_entry"
                            value={newPassword.first_entry}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 
                  transition-all duration-300 ease-in-out"
                          />
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="second_entry"
                            value={newPassword.second_entry}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 
                  transition-all duration-300 ease-in-out"
                          />
                        </div>

                        <div className="mb-4">
                          <button
                            onClick={handlePasswordSubmit}
                            className="w-full py-3 text-white bg-purple-600 rounded-lg 
                  hover:bg-purple-700 transition duration-300 ease-in-out 
                  transform hover:scale-[1.02]"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  {editMode && (
                    <div className="mb-4">
                      <button
                        onClick={handleSave}
                        className="w-full py-3 text-white bg-purple-600 rounded-lg 
              hover:bg-purple-700 transition duration-300 ease-in-out 
              transform hover:scale-[1.02]"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {deletePop && (
            <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative max-w-full">
                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 text-purple-600 hover:text-purple-800 text-2xl"
                  onClick={() => deleteAccountpop(false)}
                >
                  <FaTimes />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
                  Are you sure you want to delete your account?
                </h2>

                {/* Buttons */}
                <div className="flex justify-between items-center space-x-4">
                  {/* Cancel Button */}
                  <button
                    onClick={() => deleteAccountpop(false)}
                    className="w-1/2 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                  >
                    Cancel
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={deleteAccount}
                    className="w-1/2 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
