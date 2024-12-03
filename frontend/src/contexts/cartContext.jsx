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
    promo_id: null,
    promo_value: 0,
    min_total : 0
  }); //user enters;

  
  const getSubTotal = () => {
    let sub_total = cart.reduce((total, item) => {
      const price = item.discounted_price && item.discounted_price < item.Item_Price 
        ? item.discounted_price 
        : item.Item_Price;
      return total + price * item.quantity;
    }, 0);
    return sub_total;
  };
  
  
  const getDiscountedTotal = () => {
    let discountedTotal = getSubTotal();

    if (promo.promo_id) {
      discountedTotal = discountedTotal * (1 - promo.promo_value / 100);
    }
    return discountedTotal > 0 ? discountedTotal : 0; 
  };

  

  const getTotalAmount = () => {
    
    const discountedTotal = getDiscountedTotal();
    const totalAmount = discountedTotal + DELIVERY_CHARGES ; 
    return isNaN(totalAmount) ? 0 : totalAmount;
  };

  let promoData;

  const applyPromoCode = async () => {
    try {
      
  
      const response = await axios.get(`/api/verifyPromo/${cart[0]?.Menu_id}`, {
        params: { promo_code: promo.promo_code, user_id: userData.User_id },
      });
  
      if (response.status === 200) {
        const promoData = response.data;
  
        if (promoData) {
          const subTotal = getSubTotal();
  
          if (subTotal >= promoData.Min_Total) {
            
  
            setPromo((prev) => ({
              ...prev,
              promo_id: promoData.promo_id,
              promo_value: promoData.promo_value,
              min_total: promoData.Min_Total,
            }));
  
            setAlert({
              message: `Promo applied successfully! You get a ${promoData.promo_value}% discount.`,
              type: 'success',
            });
          } else {
            console.warn('Subtotal does not meet promo requirements.');
  
            setAlert({
              message: `Your subtotal must be at least Rs.${promoData.Min_Total} to apply this promo.`,
              type: 'failure',
            });
  
            setPromo ({
              promo_code: '',
              promo_id: null,
              promo_value: 0,
              min_total: 0,
            });
          }
        }
      }
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn('Promo usage limit reached.');
  
        setAlert({
          message: 'You have used the promo the maximum number of times.',
          type: 'failure',
        });
  
        setPromo({
          promo_code: '',
          promo_id: null,
          promo_value: 0,
          min_total: 0,
        });
      } else if (err.response?.status === 404) {
        console.warn('Promo not found or expired.');
  
        setAlert({
          message: 'The promo code is invalid or expired.',
          type: 'failure',
        });
  
        setPromo({
          promo_code: '',
          promo_id: null,
          promo_value: 0,
          min_total: 0,
        });
      } else {
        console.error('Error verifying promo code:', err);
  
        setAlert({
          message: 'An error occurred while verifying the promo code. Please try again later.',
          type: 'failure',
        });
  
        setPromo({
          promo_code: '',
          promo_id: null,
          promo_value: 0,
          min_total: 0,
        });
      }
    }
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

  const placeOrder = async (addressRecv, pointNear, riderTip) => {
    let items = [];
  
    // Prepare the items array from the cart
    cart.forEach((ele) => {
      items = items.concat({
        Item_id: ele.Item_id,
        quantity: ele.quantity,
        Order_id: null,
        Item_Price: ele.Item_Price,
        discounted_price: ele.discounted_price,
      });
    });
  
    const total = getTotalAmount() + riderTip;
  
    // Prepare the request object to send to the backend
    const req = {
      Customer_id: userData.User_id,
      Menu_Id: cart[0].Menu_id,
      Address: addressRecv,
      NearbyPoint: pointNear,
      items: items,
      total_amount: total,
      promo_id: promo?.promo_id ? promo?.promo_id : null,
      riderTip: riderTip,
    };
  
    try {
      // Make the API call to place the order
      const res = await axios.post("/api/placeOrder", req, {
        headers: { "Content-Type": "application/json" },
      });
  
      // Check if the response is successful
      if (res.status === 200) {
        setAlert({
          message: res.data.message,
          type: "success",
        });
        setCart([]); // Clear the cart after placing the order
        fetchOrders(); // Fetch the updated orders list
      }
    } catch (err) {
      // Handle the error if something goes wrong
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "An error occurred while placing your order.";
      setAlert({
        message: errorMessage,
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
        setAlert({message: 'Items from another restaurant in your cart have been removed!',type: 'success'});
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
    setAlert({message : 'Item added to cart!',type : 'success'});
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

  const clearCart = () => {
    setCart([]);
    setAlert({message: 'Your cart was cleared',type: 'success'});
  }

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
        getTotalAmount,
        applyPromoCode,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

export default CartContextProvider;
