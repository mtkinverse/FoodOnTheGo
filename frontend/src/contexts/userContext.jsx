import axios from "axios";
import React, { useState } from "react";
import { createContext,useContext } from "react";

const UserContext = createContext();

const UserContextProvider = ({children}) => {
    const host = 'http://localhost:8800';
    const [loggedIn,setLoggedIn] = useState(false);
    const [userData,setUserData] = useState({
        Customer_id: 0,
        Customer_Name: "",
        Email_address: "",
        phone_no: ""
    })

    const login = recvData => {
        try {

            axios.post(host + '/login', JSON.stringify({
              email : recvData.email,
              password : recvData.password
            })
            ,{
              headers : {
                "Content-Type" : "application/json"
              },
              withCredentials : true
            }
          ).then(res => {

            if(res.status === 200){
                
                setUserData(res.data); // y state update nahi ho rhi agr y update ho jae to user ka data frontend pr preserve rhe ga or display kr skte
                console.log('setting state to ',res.data);    
                setLoggedIn(true);

            }
            else throw res.message;
        })
        }
        catch(err){
            console.error(err.response?.data || err.message);
        }

    }   

    const signout = () => {
        axios
      .post( host + '/logout',JSON.stringify(userData),{withCredentials : true})
      .then(res => {
        if(res.status = 200){
          setLoggedIn(false);
          console.log('uC: signedout')
          alert('user logout successful');
        }
      }).catch(err =>{
        console.log('failed signout')
        alert('signout fail');
      })
      ;
    }
    return(
        <UserContext.Provider
            value={
                {
                    login,
                    loggedIn,
                    setLoggedIn,
                    userData,
                    signout
                }
            }
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;