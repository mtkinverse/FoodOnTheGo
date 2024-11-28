import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./userContext";
import axios from "axios";
import { useAlertContext } from "./alertContext";

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const DELIVERY_CHARGES = 150;

  const { loggedIn, userData, fetchOrders } = useUserContext();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { setAlert } = useAlertContext();
  const [promo, setPromo] = useState({
    promo_code: '',
    promo_code: '',
    promo_value: 0,
    min_total : 0
  }); //user enters;
  
  const getSubTotal = () =>{ 
    let sub_total = cart.reduce((total, item) => total + item.Item_Price * item.quantity, 0);
    return sub_total;
  }


  const getDiscountedTotal = () => {
    let discountedTotal = getSubTotal();

    if (promo.promo_id) {
      discountedTotal -= discountedTotal * (1 - promo.promo_value / 100);
    }
    return discountedTotal > 0 ? discountedTotal : 0; 
  };

  const getTotalAmount = () => {
    console.log(promo);
    const discountedTotal = getDiscountedTotal();
    const totalAmount = discountedTotal + DELIVERY_CHARGES ; 
    return isNaN(totalAmount) ? 0 : totalAmount;
  };
  

  useEffect(() => {
    if (loggedIn && userData?.User_id) {
      const storage_name = `${userData.User_id}_cart`;
      const storedCart = localStorage.getItem(storage_name);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, [loggedIn, userData?.User_id]);

  useEffect(() => {
    if (userData?.User_id) {
      const storage_name = `${userData.User_id}_cart`;
      localStorage.setItem(storage_name, JSON.stringify(cart));
    }
    setCartCount(cart.reduce((count, item) => count + item.quantity, 0));
  }, [cart, userData?.User_id]);


  const placeOrder = async (addressRecv, pointNear) => {
    const total = getTotalAmount();
    let items = [];
  
    cart.forEach((ele) => {
      items = items.concat({
        Item_id: ele.Item_id,
        quantity: ele.quantity,
        Order_id: null,
      });
    });
  
    // Handle promo code validation if present
    let tempP = promo; // Ensure you use the latest promo from the context
  
    if (promo.promo_code !== "") {
      try {
        const response = await axios.get(
          `/api/getPromoDetails/${cart[0].Menu_id}`,
          {
            params: { promo_code: promo.promo_code, user_id: userData.User_id },
          }
        );
        if (response.status === 200 && response.data) {
          const temp = response.data;
          tempP = {
            promo_id: temp.promo_id,
            promo_code: promo.promo_code,
            promo_value: temp.promo_value,
            min_total: temp.Min_Total,
          };
          setPromo(tempP);
  
          if (total >= tempP.min_total) {
            setAlert({ message: `You get ${tempP.promo_value}% discount!`, type: "success" });
          } else {
            setAlert({ message: `You must spend a minimum of Rs.${tempP.min_total}!`, type: "failure" });
            setPromo({ promo_code: "" });
          }
        } else {
          setAlert({ message: "No such promo found", type: "failure" });
        }
      } catch (err) {
        setAlert({
          message: err.response ? err.response.data.message : "Something went wrong",
          type: "failure",
        });
        setPromo({ promo_code: "" });
      }
    }
  
    const req = {
      Customer_id: userData.User_id,
      Menu_Id: cart[0].Menu_id,
      Address: addressRecv,
      NearbyPoint: pointNear,
      items: items,
      total_amount: getTotalAmount() || 0, // Ensure it's not null or undefined
      promo_id: tempP?.promo_code ? tempP?.promo_id : 0, // Use tempP for the latest promo data
    };
  
    // Send the request to place the order
    try {
      const res = await axios.post("/api/placeOrder", JSON.stringify(req), {
        headers: { "Content-Type": "application/json" },
      });
  
      if (res.status === 200) {
        setTimeout(() => {
          setAlert({
            message: res.data.message,
            type: "success",
          });
          setCart([]);
          fetchOrders();
        }, 3000);
      }
    } catch (err) {
      setAlert({
        message: "Cannot place order",
        type: "failure",
      });
    }
  };
  
  

  const handleAddToCart = (item) => {
    const prevMenuId = cart.length > 0 ? cart[0].Menu_id : null;

    if (prevMenuId && prevMenuId !== item.Menu_id) {
      const confirmClear = window.confirm(
        "You already have items from a different restaurant in your cart. Would you like to switch restaurants and remove the current items?"
      );
      if (confirmClear) {
        setCart([{ ...item, quantity: 1 }]);
        return;
      } else {
        return;
      }
    }

    const newCart = [...cart];
    const existingItemIndex = newCart.findIndex(
      (cartItem) => cartItem.Item_id === item.Item_id
    );

    if (existingItemIndex >= 0) {
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart.push({ ...item, quantity: 1 });
    }

    setCart(newCart);
  };

  const handleDecrement = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.Item_id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const handleIncrement = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.Item_id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleRemove = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.Item_id !== itemId));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        handleAddToCart,
        handleDecrement,
        handleIncrement,
        handleRemove,
        placeOrder,
        promo,
        setPromo,
        getDiscountedTotal,
        getSubTotal,
        getTotalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

export default CartContextProvider;
