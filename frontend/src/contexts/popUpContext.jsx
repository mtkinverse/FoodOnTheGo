import React, { useState, useContext, useEffect, createContext } from "react";
import ComplaintLodger from "../popups/ComplaintLodger";

const popUpContext = createContext();

const PopUpContextProvider = ({ children }) => {

    const [complaint, setComplaint] = useState({
        desc: '', Order_id: undefined, restaurant_id: undefined
    });
    const [lodger,setLodger] = useState(false);
    const [adminComplaintPopup,setAdminComplaintPopup] = useState(false);
    
    return (
        <popUpContext.Provider
            value={{
                complaint,
                setComplaint,
                lodger,
                setLodger,
                adminComplaintPopup,
                setAdminComplaintPopup
            }}
        >
            {children}
            {lodger && <ComplaintLodger/>}
        </popUpContext.Provider>
    );
};

// Custom hook for using the popUpContext
export const usePopUpContext = () => useContext(popUpContext);

export default PopUpContextProvider;
