import React, { useState } from "react";
import { useCartContext } from "../contexts/cartContext";
import { FaShoppingCart, FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const Cart = () => {
  const { cart, cartCount, handleIncrement, handleDecrement, handleRemove } = useCartContext();
  const [cartPopup, setCartPopup] = useState(false);

  const getTotalAmount = () =>
    cart.reduce((total, item) => total + item.Item_Price * item.quantity, 0);

  return (
    <>
      <button
        onClick={() => setCartPopup(true)}
        className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-2xl flex items-center"
      >
        <FaShoppingCart className="w-7 h-7" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl 
                    transform transition-transform duration-300 z-50
                    ${cartPopup ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-purple-900">Your Cart</h2>
            <button
              onClick={() => setCartPopup(false)}
              className="text-red-500 hover:text-red-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.menu_id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <h3 className="font-bold text-purple-900">{item.Dish_Name}</h3>
                    <p className="text-purple-600">Rs.{item.Item_Price}</p>
                    <p className="text-purple-600">{item.restaurant_name}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDecrement(item.Item_id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.Item_id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => handleRemove(item.Item_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 border-t flex justify-between items-center">
            <span className="text-xl font-bold text-purple-900">
              Total: Rs.{getTotalAmount()}
            </span>
            <button
              onClick={() => {}}
              className="w-full bg-purple-600 text-white py-3 
                         rounded-lg hover:bg-purple-700 
                         transition duration-300"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
