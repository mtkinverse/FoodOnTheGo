import React, { useState } from "react";
import { useCartContext } from "../contexts/cartContext";
import { FaShoppingCart, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Banknote } from "lucide-react";

const Cart = () => {
  const { cart, cartCount, handleIncrement, handleDecrement, handleRemove, placeOrder } = useCartContext();
  const [location, setLocation] = useState({
    Address: "",
    NearbyPoint: "",
  });
  const [orderPopUp, setOrderPopUp] = useState(false);
  const [cartPopup, setCartPopup] = useState(false);

  const DELIVERY_CHARGES = 150;

  const getSubTotal = () =>
    cart.reduce((total, item) => total + item.Item_Price * item.quantity, 0);

  const getTotalAmount = () => getSubTotal() + DELIVERY_CHARGES;

  const handleOrderPlacment = (e) => {
    e.preventDefault();
    placeOrder(location.Address, location.NearbyPoint);
    setOrderPopUp(false);
    setLocation({
      Address: "",
      NearbyPoint: "",
    });
  };

  const changeLocation = (e) => {
    setLocation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

          <div className="p-6 border-t space-y-4">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-purple-900">Subtotal:</span>
              <span className="text-lg font-bold text-purple-900">
                Rs.{getSubTotal()}
              </span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="text-lg font-medium text-purple-900">Delivery:</span>
              <span className="text-lg font-bold text-purple-900">
                Rs.{DELIVERY_CHARGES}
              </span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="text-xl font-bold text-purple-900">Total:</span>
              <span className="text-xl font-bold text-purple-900">
                Rs.{getTotalAmount()}
              </span>
            </div>
            {cartCount > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCartPopup(false);
                  setOrderPopUp(true);
                }}
                className="w-full bg-purple-600 text-white py-3 
                         rounded-lg hover:bg-purple-700 
                         transition duration-300"
              >
                Place Order
              </button>
            )}
          </div>
        </div>
      </div>
      {orderPopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              Confirm Order
            </h2>
            <form onSubmit={handleOrderPlacment}>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="Address"
                  className="w-full border rounded-lg py-2 px-3 text-gray-700"
                  value={location.Address}
                  onChange={changeLocation}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="nearby"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Nearby Point
                </label>
                <input
                  type="text"
                  id="nearby"
                  name="NearbyPoint"
                  className="w-full border rounded-lg py-2 px-3 text-gray-700"
                  value={location.NearbyPoint}
                  onChange={changeLocation}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  Payment Method
                </label>
                <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    className="w-4 h-4 text-purple-600"
                    checked={true}
                    readOnly
                  />
                  <label
                    htmlFor="cod"
                    className="ml-2 flex items-center text-gray-700"
                  >
                    <Banknote className="w-5 h-5 mr-2 text-purple-600" />
                    Cash on Delivery
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
                  onClick={() => {
                    setOrderPopUp(false);
                    setCartPopup(true);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
