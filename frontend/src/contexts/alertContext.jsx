import React, { useState, useContext, useEffect, createContext } from "react";
import PopupAlert from "../components/PopupAlert";

const AlertContext = createContext();

const AlertContextProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        message: "",
        type: "", // "success" or "failure"
    });
    const [popup, setPopup] = useState(false);

    // Close the popup and reset the alert state
    const onClose = () => {
        setPopup(false);
        setAlert({
            message: "",
            type: "",
        });
    };

    // Automatically open the popup when there is a new message
    useEffect(() => {
        if (alert.message) {
            setPopup(true);
        }
    }, [alert]);

    return (
        <AlertContext.Provider
            value={{
                alert,
                setAlert,
            }}
        >
            {children}
            {popup && (
                <PopupAlert
                    message={alert.message}
                    type={alert.type}
                    handleClose={onClose}
                />
            )}
        </AlertContext.Provider>
    );
};

// Custom hook for using the AlertContext
export const useAlertContext = () => useContext(AlertContext);

export default AlertContextProvider;
