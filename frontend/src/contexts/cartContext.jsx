import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./userContext";
import axios from "axios";

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const { loggedIn, userData,fetchOrders } = useUserContext();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  
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

  const placeOrder = (addressRecv,pointNear) => {
    console.log('I received ', cart,cartCount);
    let items = [];
    cart.forEach(ele => {
      items = items.concat({
        Item_id : ele.Item_id,
        quantity : ele.quantity,
        Order_id : null
      })
    })
    console.log('sending items',items);
    console.log('cart is ',cart);
    
    const req = {
      Customer_id : userData.User_id,
      Menu_Id : cart[0].Menu_id,
      Address : addressRecv,
      NearbyPoint : pointNear,
      items : items
    }
    console.log('seding request',req);

    axios.post('/api/placeOrder', JSON.stringify(req), {
      headers: {
        'Content-Type': 'application/json',
      },
    })    
    .then(res => {
      if(res.status === 200){
        alert(res.data.message);
        setCart([]);
        fetchOrders();
      }
    })
    .catch(err => {
     // alert('Cannot place order !');
    //  console.log(err);
    })
  }

  const handleAddToCart = (item) => {
    const prevMenuId = cart.length > 0 ? cart[0].Menu_id : null;

    if (prevMenuId && prevMenuId !== item.Menu_id) {
      const confirmClear = window.confirm(
        'You already have items from a different restaurant in your cart. Would you like to switch restaurants and remove the current items?'
      );
      if (confirmClear) {
        setCart([{ ...item, quantity: 1 }]);
        return;
      } else {
        return;
      }
    }

    const newCart = [...cart];
    const existingItemIndex = newCart.findIndex(cartItem => cartItem.Item_id === item.Item_id);

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
        item.Item_id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const handleIncrement = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.Item_id === itemId ? { ...item, quantity: item.quantity + 1 } : item
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
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

export default CartContextProvider;
