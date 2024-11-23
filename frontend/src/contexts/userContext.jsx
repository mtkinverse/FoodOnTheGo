import axios from "axios";
import React, { useState } from "react";
import { createContext, useContext,useEffect } from "react";
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // const host = 'http://localhost:8800';
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    User_id: 0,
    User_name: "",
    Email_address: "",
    phone_no: "",
    role: "",
  });

  //for rider
  const [bikeDetails,setBikeDetails] = useState({
     BikeNo : ""
  })

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [orders,setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  //  this is what API response looks like [
//     {
//         "order_id": 75645,
//         "order_date": "2024-11-21T19:00:00.000Z",
//         "order_time": "17:29:50",
//         "customer_id": 99191,
//         "restaurant_name": "KFC",
//         "total_amount": 5800,
//         "items": [
//             {
//                 "item_id": 18051,
//                 "dish_name": "Zinger Burger",
//                 "quantity": 1,
//                 "sub_total": 700
//             },
//             {
//                 "item_id": 18052,
//                 "dish_name": "French Fries",
//                 "quantity": 1,
//                 "sub_total": 300
//             },
//             {
//                 "item_id": 18053,
//                 "dish_name": "Mighty Zinger",
//                 "quantity": 4,
//                 "sub_total": 4800
//             }
//         ]
//     },
//     {
//         "order_id": 75647,
//         "order_date": "2024-11-21T19:00:00.000Z",
//         "order_time": "17:53:08",
//         "customer_id": 99191,
//         "restaurant_name": "14th Street Pizza",
//         "total_amount": 3900,
//         "items": [
//             {
//                 "item_id": 18056,
//                 "dish_name": "Chicken Tikka ",
//                 "quantity": 3,
//                 "sub_total": 1800
//             },
//             {
//                 "item_id": 18057,
//                 "dish_name": "Slice for one",
//                 "quantity": 3,
//                 "sub_total": 2100
//             }
//         ]
//     }
// ]

const fetchOrders = async () => {
  try {
    const response = await axios.get(`/api/getAllOrders/${userData.User_id}`);
    console.log(response.data);

    const current = [];
    const past = [];

    response.data.forEach(order => {
      console.log("Here in looping");
      if (order.status === 'Placed' || order.status === 'Preparing' ||order.status === 'Out for delivery') {
        console.log("Pushing into current");
        current.push(order);
      } else if (order.Order_Status === 'Delivered') {
        console.log("pushing into past");
        past.push(order);
      }
    });
    setOrders(response.data);
    setCurrentOrders(current);
    setPastOrders(past);
  } catch (err) {
    console.log('Error fetching customer orders');
  }
};

useEffect(() => {
  if (userData.User_id !== 0) {
    fetchOrders();
  }
}, [userData.User_id]);
  
  useEffect(() => {
    console.log("Current orders updated ",currentOrders);
    console.log("Past ORders updated ",pastOrders);
  },[currentOrders,pastOrders]);

  const login = async (recvData) => {
    try {
      const res = await axios.post(
        "/api/login",
        JSON.stringify({
          email: recvData.email,
          password: recvData.password,
          role: recvData.role,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        console.log("Login successful. Response data:", res.data);
        console.log(res.data.role);
        let tempUserData;
        let bikeData;
        // Check the role and adjust the destructuring accordingly
        if (res.data.role === "Customer") {
          tempUserData = {
            User_id: res.data.Customer_id,
            User_name: res.data.Customer_Name,
            Email_address: res.data.Email_address,
            phone_no: res.data.phone_no,
            role: res.data.role,
          };
        } else if (res.data.role === "Delivery_Rider") {
          tempUserData = {
            User_id: res.data.Rider_id,
            User_name: res.data.Rider_name,
            Email_address: res.data.Email_address,
            phone_no: res.data.phone_no,
            role: res.data.role,
          };
          bikeData = {
            BikeNo : res.data.BikeNo
          };
        } else if (res.data.role === "Restaurant_Owner") {
          tempUserData = {
            User_id: res.data.Owner_id,
            User_name: res.data.Owner_Name,
            Email_address: res.data.Email_address,
            phone_no: res.data.phone_no,
            role: res.data.role,
          };
        }else if(res.data.role === 'Restaurant_Admin'){
          tempUserData = {
            User_id: res.data.Admin_id,
            User_name: res.data.Admin_Name,
            Email_address: res.data.Email_address,
            phone_no: res.data.Phone_no,
            role: res.data.role,
            Branch_id : res.data.Branch_id
          };
        }
         else {
          throw new Error("Unknown role");
        }

        // Set the state with the correct user data
        setUserData(tempUserData);
        setBikeDetails(bikeData);
        setLoggedIn(true);
        console.log("User data set for:", tempUserData);
        
      } else {
        throw new Error(res.message || "Unexpected error occurred");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setErrors(err.response.data.errors);
      console.log(errors);
    }
  };

  const signout = () => {

    axios
      .post("/api/logout", JSON.stringify(userData), { withCredentials: true })
      .then((res) => {
        if ((res.status = 200)) {
          setLoggedIn(false);
          console.log("uC: signedout");
          // alert("user logout successful");
          // navigate('/');
        }
      })
      .catch((err) => {
        console.log("failed signout");
        alert("signout fail");
      });
  };

  const getRestaurantOrders = () => {
    axios
    // .get('/api/getOrders/' + userData.Branch_id)
    .get('/api/getOrders/' + 1234)
    .then(res => {
      setCurrentOrders(res.data.orders);
    })
    .catch(err => {
      console.log('getting orders failed ',err.message);
    })
  }

  return (
    <UserContext.Provider
      value={{
        login,
        loggedIn,
        setLoggedIn,
        userData,
        signout,
        setUserData,
        bikeDetails,
        setBikeDetails,
        errors,
        setErrors,
        currentOrders,
        setCurrentOrders,
        pastOrders,
        fetchOrders,
        getRestaurantOrders
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;
