import axios from "axios";
import React, { useState } from "react";
import { createContext, useContext,useEffect } from "react";
import { useAlertContext } from "./alertContext";
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

  const {setAlert} = useAlertContext();
  
  //for rider
  const [bikeDetails,setBikeDetails] = useState({
     BikeNo : ""
  })
  

  // const [errors, setErrors] = useState({ email: "", password: "" });
  const [orders,setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]); // ye customer ke hain
  const [pastOrders, setPastOrders] = useState([]);// ye bhi
  

  const [restaurantOrders,setRestaurantOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/getAllOrders/${userData.User_id}`);
  
      const current = [];
      const past = [];
  
      response.data.forEach(order => {
        // Check order status
        if (
          order.status === 'Placed' ||
          order.status === 'Preparing' ||
          order.status === 'Out for delivery'
        ) {
          current.push(order);
        } else if (order.status === 'Delivered') {
          past.push(order);
        }
      });
  
      current.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)); // Sort in descending order (most recent first)
      past.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)); // Sort in descending order (most recent first)
  
      setOrders(response.data);
      setCurrentOrders(current);
      setPastOrders(past);
  
    } catch (err) {
      console.log('Error fetching customer orders');
    }
  };
  
  
  useEffect(() => {
    if (userData.User_id !== 0 && userData.role === "Customer") {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders();
      }, 30000); // Refresh orders every 30 seconds
      return () => clearInterval(interval); 
    }
  }, [userData.User_id]);
  
  useEffect(() => {
    
    
  },[currentOrders,pastOrders]);
  
  useEffect(() => {
    if (userData.User_id !== 0 && userData.role === "Customer") {
      fetchOrders();
    }
  },[restaurantOrders]);
  
  const login = async (recvData) => {
    try {
      const res = await axios.post("/api/login",JSON.stringify({
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
            phone_no: res.data.Phone_no,
            role: res.data.role,
            status: res.data.Available
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
        }
        else if(res.data.role === "Restaurant_Admin"){
          tempUserData = {
            User_id: res.data.Admin_id,
            User_name: res.data.Admin_Name,
            Location_id: res.data.Location_id,
            Email_address: res.data.Email_address,
            phone_no: res.data.Phone_no,
            role: res.data.role,
          }
        }
         else {
          throw new Error("Unknown role");
        }

        setUserData(tempUserData);
        setLoggedIn(true);
        setBikeDetails(bikeData);
        setAlert({
          message : 'Login successful',
          type: 'success'
        })
        
      } else {
        throw new Error(res.message || "Unexpected error occurred");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      const serverError = err.response?.data?.message || "An error occurred";
      setAlert({
        message: serverError,
        type: "failure",
      });
      
    }
  };

  const signout = async () => {
    axios
      .post("/api/logout", JSON.stringify(userData), { withCredentials: true })
      .then( async (res) => {
        if ((res.status = 200)) {
          await Promise.all([
            setLoggedIn(false),
            setUserData({
              User_id: 0, User_name: "", Email_address: "",phone_no: "",role: "",
           })
          ]);
          
        }
      })
      .catch((err) => {
        console.log("failed signout");
      });
  };

  //this is for admin
  const getRestaurantOrders = () => {
    axios
    .get(`/api/getOrders/${userData.Location_id}`)
    .then(res => {
      setRestaurantOrders(res.data.orders);
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
        currentOrders,
        setCurrentOrders,
        pastOrders,
        fetchOrders,
        getRestaurantOrders,
        restaurantOrders,
        setRestaurantOrders,
        setPastOrders
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;
