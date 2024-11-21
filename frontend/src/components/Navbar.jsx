// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";

// import {FaBars,FaChevronDown,FaUserCircle,FaPencilAlt,} from "react-icons/fa";
// import { NavLink } from "react-router-dom";
// import { useUserContext } from "../contexts/userContext";
// import { useCartContext } from "../contexts/cartContext";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const profileMenuRef = useRef(null); // Ref to handle outside click
//   const { loggedIn, signout, userData, setUserData,bikeDetails,setBikeDetails } = useUserContext();
//   const { cartCount } = useCartContext();
//   const [viewProfile, setViewProfile] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [passwordPopup,setPasswordPop] = useState(false);
//   const [newPassword,setNewPassword] = useState ({
//       first_entry : "",
//       second_entry: ""
//   });
//   const [passwordError,setError] = useState ("");
//   const [updatedDetails, setUpdated] = useState({
//     User_id: 0,
//     User_name: "",
//     Email_address: "",
//     phone_no: "",
//     role: "",
//   });
//   const [bikePopup,setBikePopup] = useState(false);
//   const handleDetailChange = (e) => {
//     const { name, value } = e.target;
//     setUpdated((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };
  
//   const handleBikeChange = (e) => {
//     e.preventDefault();
//     axios.post(`/api/updateVehicle/${userData.User_id}`,{bikeNo : bikeDetails.BikeNo})
//     .then(response => {
//       console.log('Bike id updated');
//       setBikePopup(false);
//     })
//     .catch(err => {
//       console.log("error updating bike");
//     })
//   }
//   useEffect(() => {
//     if (userData) {
//       setUpdated({
//         User_id: userData.User_id,
//         User_name: userData.User_name,
//         Email_address: userData.Email_address,
//         phone_no: userData.phone_no,
//         role: userData.role,
//       });
//     }
//   }, [userData]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target)
//       ) {
//         setIsProfileMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const signItOut = (e) => {
//     if (cartCount === 0) {
//       localStorage.removeItem(`${userData.User_id}_cart`);
//     }
//     e.preventDefault();
//     try {
//       signout();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const navItems = [
//     { label: "Home", path: "/" },
//     { label: "Restaurants", path: "/restaurants" },
//     { label: "About Us", path: "/about" },
//     { label: "Contact", path: "/contact" },
//   ];

//   if (!loggedIn || userData?.role === "Restaurant_Owner" || userData?.role === "Delivery_Rider") {
//     const index = navItems.findIndex((item) => item.label === "Restaurants");
//     if (index !== -1) {
//       navItems.splice(index, 1);
//     }
//   }
//   if (loggedIn && userData?.role === "Restaurant_Owner") {
//     navItems.push({ label: "Owned", path: "/ownedRestaurants" });
//   }

//   if (loggedIn && userData?.role === "Delivery_Rider") {
//     navItems.push({ label: "DashBoard", path: "/RiderDashboard" });
//   }

//   const handlePasswordChange = (e) => {
//     const {name,value} = e.target;
//     setNewPassword((prevPassword) => ({
//       ...prevPassword,
//       [name]: value,
//     }));
//   }

//   const handlePasswordSubmit = () => {
//         if(newPassword.first_entry !== newPassword.second_entry) {
//            setError("Passwords do not match");
//            setNewPassword({
//              first_entry: "",
//              second_entry: ""
//            })
//         }
//         else{
//            setPasswordPop(false);
//            handleSave();  
//            setNewPassword({
//             first_entry: "",
//             second_entry: ""
//            })
//         }
//   }

//   // Save updates
//   const handleSave = () => {  
//     setUserData(updatedDetails);
//       axios.post('/api/updateAccount',{userData : userData,password : newPassword.first_entry})
//      .then(response => {
//           console.log('Updated data in DB successfully');
//      })
//      .catch(error => {
//            console.log('ERror updating data');
//      })
//       console.log('Context data',userData);
//     setEditMode(false);
//     setError("");
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <img
//               src="images/logo.png"
//               alt="FoodGO Logo"
//               className="h-8 w-auto"
//             />
//             <h2 className="text-2xl font-bold text-purple-600">FoodGO</h2>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden sm:flex sm:space-x-8">
//             {navItems.map((item, index) => (
//               <NavLink
//                 key={index}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `${
//                     isActive ? "font-bold text-purple-700" : ""
//                   } text-sm font-medium text-purple-600 hover:text-purple-700 transition duration-300`
//                 }
//               >
//                 {item.label}
//               </NavLink>
//             ))}
//           </div>

//           <div className="flex items-center space-x-4">
//             {loggedIn ? (
//               <div className="relative">
//                 <button
//                   onClick={toggleProfileMenu}
//                   className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700"
//                 >
//                   <FaUserCircle className="h-8 w-8 text-purple-600" />
//                   <span className="text-sm font-medium">
//                     {userData.User_name}
//                   </span>
//                   <FaChevronDown
//                     className={`transform ${
//                       isProfileMenuOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {isProfileMenuOpen && (
//                   <div
//                     ref={profileMenuRef}
//                     className="absolute right-0 mt-2 w-48 bg-purple-600 border border-purple-600 rounded-md shadow-lg z-10"
//                   >
//                     <button
//                       className="block px-4 py-2 text-sm text-white hover:bg-purple-800"
//                       onClick={() => setViewProfile(true)}
//                     >
//                       View Profile
//                     </button>
//                     {userData.role === "Customer" && (
//                       <button
//                       className="block px-4 py-2 text-sm text-white hover:bg-purple-800">
//                       View Past Orders
//                     </button> )}
//                      {userData.role === "Customer" && (
//                     <button className="block px-4 py-2 text-sm text-white hover:bg-purple-800">
//                       Track Order
//                     </button>
//                     )}
//                     {userData.role === 'Delivery_Rider' &&  (<button
//                       className="block px-4 py-2 text-sm text-white hover:bg-purple-800"
//                       onClick={() => setBikePopup(true)}
//                     >
//                       Change Vehicle Details
//                     </button> )}

//                     <button
//                       onClick={signItOut}
//                       className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-purple-800"
//                     >
//                       Sign Out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <NavLink
//                 to="/login"
//                 className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition duration-300"
//               >
//                 Login
//               </NavLink>
//             )}
//           </div>
          
//           {
//             bikePopup && (
//               <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
//               Update Your Vehicle
//             </h2>
//             <p className="text-gray-700 text-sm text-center mb-6">
//               Please provide your new bike's number plate .
//             </p>
//             <form className="space-y-4" onSubmit={handleBikeChange}>
//               <div>
//                 <label
//                   htmlFor="numberPlate"
//                   className="block text-gray-600 text-sm font-medium mb-1"
//                 >
//                   Bike Number Plate
//                 </label>
//                 <input
//                   id="numberPlate"
//                   type="text"
//                   name="BikeNo"
//                   value={bikeDetails.BikeNo || ""}
//                   onChange={(e) =>
//                     setBikeDetails((prev) => ({
//                       ...prev,
//                       BikeNo: e.target.value,
//                     }))
//                   }
//                   className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//             )
//           }
//           {viewProfile && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    
//     <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">

//     <button
//         className="absolute top-4  text-purple-600 hover:text-purple-800 text-xl"
//         onClick={() => setViewProfile(false)} // Toggle edit mode
//       >
//        X
//       </button>

//       <button
//         className="absolute top-4 right-2 text-purple-600 hover:text-purple-800 text-xl"
//         onClick={() => setEditMode(!editMode)} // Toggle edit mode
//       >
//         <FaPencilAlt />
//       </button>

//       <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
//         Your Profile
//       </h2>

//       {/* Name */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Name
//         </label>
//         <div className="flex items-center">
//           <input
//             type="text"
//             name ="User_name"
//             value={updatedDetails.User_name}
//             onChange={handleDetailChange}
//             readOnly={!editMode}
//             className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>
//       </div>

//       {/* Email */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Email
//         </label>
//         <div className="flex items-center">
//           <input
//             type="email"
//             name="Email_address"
//             value={updatedDetails.Email_address}
//             onChange={handleDetailChange}
//             readOnly={!editMode}
//             className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>
//       </div>

//       {/* Phone */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Phone
//         </label>
//         <div className="flex items-center">
//           <input
//             type="text"
//             name="phone_no"
//             value={updatedDetails.phone_no}
//             onChange={handleDetailChange}
//             readOnly={!editMode}
//             className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>
//       </div>

//       {/* Change Password */}
//       <div className="mb-4">
//         <button
//           onClick={() => setPasswordPop(true)}
//           className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
//         >
//           Change Password
//         </button>
//       </div>
      
//       {passwordPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
//             <button
//               className="absolute top-2 right-2 text-purple-600 hover:text-purple-800 text-xl"
//               onClick={() => setPasswordPop(false)}
//             >
//               X
//             </button>

//             <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
//               Change Password
//             </h2>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 name = "first_entry"
//                 value={newPassword.first_entry}
//                 onChange={handlePasswordChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm New Password
//               </label>
//               <input
//                 type="password"
//                 name = "second_entry"
//                 value={newPassword.second_entry}
//                 onChange={handlePasswordChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//               />
//             </div>
//             {/* Error Message */}
//             {passwordError && (
//               <div className="mb-4 text-red-500 text-sm text-center">
//                 {passwordError}
//               </div>
//             )}

//             {/* Save Button */}
//             <div className="mb-4">
//               <button
//                 onClick={handlePasswordSubmit}
//                 className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Save Button */}
//       {editMode && (
//         <div className="mb-4">
//           <button
//             onClick={handleSave}
//             className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
//           >
//             Save Changes
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// )}

//           {/* Mobile Menu */}
//           <div className="sm:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="text-purple-600 hover:text-purple-700 focus:outline-none"
//             >
//               <FaBars className="h-6 w-6" />
//             </button>
//           </div>

//           {/* Mobile Menu */}
//           {isMenuOpen && (
//             <div className="sm:hidden mt-2 space-y-1">
//               {navItems.map((item, index) => (
//                 <NavLink
//                   key={index}
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `block px-4 py-2 text-sm font-medium ${
//                       isActive
//                         ? "text-purple-700 font-bold"
//                         : "text-purple-600 hover:text-purple-700"
//                     } transition duration-300`
//                   }
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.label}
//                 </NavLink>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import {FaBars,FaChevronDown,FaUserCircle,FaPencilAlt,FaTimes} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import { useCartContext } from "../contexts/cartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null); // Ref to handle outside click
  const { loggedIn, signout, userData, setUserData,bikeDetails,setBikeDetails } = useUserContext();
  const { cartCount } = useCartContext();
  const [viewProfile, setViewProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordPopup,setPasswordPop] = useState(false);
  const [newPassword,setNewPassword] = useState ({
      first_entry : "",
      second_entry: ""
  });
  const [passwordError,setError] = useState ("");
  const [updatedDetails, setUpdated] = useState({
    User_id: 0,
    User_name: "",
    Email_address: "",
    phone_no: "",
    role: "",
  });
  const [bikePopup,setBikePopup] = useState(false);
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setUpdated((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  const handleBikeChange = (e) => {
    e.preventDefault();
    axios.post(`/api/updateVehicle/${userData.User_id}`,{bikeNo : bikeDetails.BikeNo})
    .then(response => {
      console.log('Bike id updated');
      setBikePopup(false);
    })
    .catch(err => {
      console.log("error updating bike");
    })
  }
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
    } catch (err) {
      console.log(err);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Restaurants", path: "/restaurants" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  if (!loggedIn || userData?.role === "Restaurant_Owner" || userData?.role === "Delivery_Rider") {
    const index = navItems.findIndex((item) => item.label === "Restaurants");
    if (index !== -1) {
      navItems.splice(index, 1);
    }
  }
  if (loggedIn && userData?.role === "Restaurant_Owner") {
    navItems.push({ label: "Owned", path: "/ownedRestaurants" });
  }

  if (loggedIn && userData?.role === "Delivery_Rider") {
    navItems.push({ label: "DashBoard", path: "/RiderDashboard" });
  }

  const handlePasswordChange = (e) => {
    const {name,value} = e.target;
    setNewPassword((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }));
  }

  const handlePasswordSubmit = () => {
        if(newPassword.first_entry !== newPassword.second_entry) {
           setError("Passwords do not match");
           setNewPassword({
             first_entry: "",
             second_entry: ""
           })
        }
        else{
           setPasswordPop(false);
           handleSave();  
           setNewPassword({
            first_entry: "",
            second_entry: ""
           })
        }
  }

  // Save updates
  const handleSave = () => {  
    setUserData(updatedDetails);
      axios.post('/api/updateAccount',{userData : updatedDetails,password : newPassword.first_entry})
     .then(response => {
          console.log('Updated data in DB successfully');
     })
     .catch(error => {
           console.log('ERror updating data');
     })
      console.log('Context data',userData);
    setEditMode(false);
    setError("");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="images/logo.png"
              alt="FoodGO Logo"
              className="h-8 w-auto"
            />
            <h2 className="text-2xl font-bold text-purple-600">FoodGO</h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive ? "font-bold text-purple-700" : ""
                  } text-sm font-medium text-purple-600 hover:text-purple-700 transition duration-300`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <FaUserCircle className="h-8 w-8 text-purple-600" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {userData.User_name}
                  </span>
                  <FaChevronDown
                    className={`transform ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 mt-2 w-48 bg-purple-600 border border-purple-600 rounded-md shadow-lg z-10"
                  >
                    <button
                      className="block px-4 py-2 text-sm text-white hover:bg-purple-800"
                      onClick={() => setViewProfile(true)}
                    >
                      View Profile
                    </button>
                    {userData.role === "Customer" && (
                      <button
                      className="block px-4 py-2 text-sm text-white hover:bg-purple-800">
                      View Past Orders
                    </button> )}
                     {userData.role === "Customer" && (
                    <button className="block px-4 py-2 text-sm text-white hover:bg-purple-800">
                      Track Order
                    </button>
                    )}
                    {userData.role === 'Delivery_Rider' &&  (<button
                      className="block px-4 py-2 text-sm text-white hover:bg-purple-800"
                      onClick={() => setBikePopup(true)}
                    >
                      Change Vehicle Details
                    </button> )}

                    <button
                      onClick={signItOut}
                      className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-purple-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition duration-300"
              >
                Login
              </NavLink>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-purple-600 hover:text-purple-700 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
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
                      {userData.role === 'Delivery_Rider' && (
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

          {/* Rest of the existing code remains the same (bike popup, view profile, etc.) */}
          {bikePopup && (
            // Existing bike popup code
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
                  Update Your Vehicle
                </h2>
                <p className="text-gray-700 text-sm text-center mb-6">
                  Please provide your new bike's number plate .
                </p>
                <form className="space-y-4" onSubmit={handleBikeChange}>
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
          )}

{viewProfile && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    
    <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">

    <button
        className="absolute top-4  text-purple-600 hover:text-purple-800 text-xl"
        onClick={() => setViewProfile(false)} // Toggle edit mode
      >
       X
      </button>

      <button
        className="absolute top-4 right-2 text-purple-600 hover:text-purple-800 text-xl"
        onClick={() => setEditMode(!editMode)} // Toggle edit mode
      >
        <FaPencilAlt />
      </button>

      <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
        Your Profile
      </h2>

      {/* Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name ="User_name"
            value={updatedDetails.User_name}
            onChange={handleDetailChange}
            readOnly={!editMode}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="flex items-center">
          <input
            type="email"
            name="Email_address"
            value={updatedDetails.Email_address}
            onChange={handleDetailChange}
            readOnly={!editMode}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name="phone_no"
            value={updatedDetails.phone_no}
            onChange={handleDetailChange}
            readOnly={!editMode}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-4">
        <button
          onClick={() => setPasswordPop(true)}
          className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
        >
          Change Password
        </button>
      </div>
      
      {passwordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-purple-600 hover:text-purple-800 text-xl"
              onClick={() => setPasswordPop(false)}
            >
              X
            </button>

            <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
              Change Password
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name = "first_entry"
                value={newPassword.first_entry}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name = "second_entry"
                value={newPassword.second_entry}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            {/* Error Message */}
            {passwordError && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {passwordError}
              </div>
            )}

            {/* Save Button */}
            <div className="mb-4">
              <button
                onClick={handlePasswordSubmit}
                className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
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
            className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  </div>
)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;