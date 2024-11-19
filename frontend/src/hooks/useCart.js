import { useState, useEffect } from 'react';

export function  useCart (userId)  {
  const storage_name = `${userId}_cart`;
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem(storage_name);
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    localStorage.setItem(storage_name, JSON.stringify(cart));
    setCartCount(cart.reduce((count, item) => count + item.quantity, 0));
  }, [cart, storage_name]);

  const handleAddToCart = (item,restaurant_name) => {
    const prevMenuId = cart.length > 0 ? cart[0].Menu_id : null;
    
    if (prevMenuId && prevMenuId !== item.Menu_id) {
      const confirmClear = window.confirm(
        'You already have items from a different menu in your cart. Would you like to switch menus and remove the current items?'
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
    const newCart = cart.map(item => {
      if (item.Item_id === itemId) {
        return {
          ...item,
          quantity: Math.max(1, item.quantity - 1),
        };
      }
      return item;
    });
    setCart(newCart);
  };

  const handleIncrement = (itemId) => {
    const newCart = cart.map(item => {
      if (item.Item_id === itemId) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(newCart);
  };

  const handleRemove = (itemId) => {
    const newCart = cart.filter(item => item.Item_id !== itemId);
    setCart(newCart);
  };

  return {
    cart,
    cartCount,
    handleAddToCart,
    handleDecrement,
    handleIncrement,
    handleRemove
  };
};

