import axios from "axios";
import React, { useState } from "react";
import { createContext, useContext } from "react";

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
        let userData;

        // Check the role and adjust the destructuring accordingly
        if (res.data.role === "Customer") {
          userData = {
            User_id: res.data.Customer_id,
            User_name: res.data.Customer_Name,
            Email_address: res.data.Email_address,
            phone_no: res.data.phone_no,
            role: res.data.role,
          };
        } else if (res.data.role === "Delivery_Rider") {
          userData = {
            User_id: res.data.Rider_id,
            User_name: res.data.Rider_name,
            Email_address: res.data.Email_address,
            phone_no: res.data.phone_no,
            role: res.data.role,
          };
        } else if (res.data.role === "Restaurant_Owner") {
          userData = {
            User_id: res.data.Owner_id,
            User_name: res.data.Owner_Name,
            Email_address: res.data.Email_address,
            phone_no: res.data.phone_no,
            role: res.data.role,
          };
        } else {
          throw new Error("Unknown role");
        }

        // Set the state with the correct user data
        setUserData(userData);
        setLoggedIn(true);

        console.log("User data set for:", userData);
      } else {
        throw new Error(res.message || "Unexpected error occurred");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  const signout = () => {
    axios
      .post("api/logout", JSON.stringify(userData), { withCredentials: true })
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
  return (
    <UserContext.Provider
      value={{
        login,
        loggedIn,
        setLoggedIn,
        userData,
        signout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;
