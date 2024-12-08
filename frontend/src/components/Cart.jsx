import React, { useEffect, useState } from "react";
import { useCartContext } from "../contexts/cartContext";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaBiking,
} from "react-icons/fa";
import { Banknote } from "lucide-react";
import { useUserContext } from "../contexts/userContext";

const Cart = () => {
  
  const {userData} = useUserContext();
  const {
    cart,
    cartCount,
    handleIncrement,
    handleDecrement,
    handleRemove,
    placeOrder,
    promo,
    setPromo,
    getSubTotal,
    getTotalAmount,
    applyPromoCode,
    clearCart,
  } = useCartContext();

  const [location, setLocation] = useState({
    Address: "",
    NearbyPoint: "",
  });
  const [orderPopUp, setOrderPopUp] = useState(false);
  const [cartPopup, setCartPopup] = useState(false);

  const [tipAmount, setTipAmount] = useState(0);
  const handleApplyPromoCode = () => {
    applyPromoCode();
  };

  const handleOrderPlacment = (e) => {
    e.preventDefault();
    placeOrder(location.Address, location.NearbyPoint, tipAmount);
    setOrderPopUp(false);
    setTipAmount(0);
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
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-900 to-indigo-800 text-white p-4 rounded-full shadow-2xl flex items-center"
      >
        <FaShoppingCart className="w-7 h-7" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 z-10 bg-red-500 text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <div
  className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gradient-to-br 
              from-white via-purple-100 to-indigo-50 shadow-2xl 
              transform transition-transform duration-300 z-50
              ${cartPopup ? "translate-x-0" : "translate-x-full"}`}
>
  <div className="h-full flex flex-col">
    {/* Header */}
    <div className="p-4 sm:p-6 border-b border-purple-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-900">Your Cart</h2>
      <button
        onClick={() => setCartPopup(false)}
        className="text-red-500 hover:text-red-700 text-xl sm:text-2xl transition-transform transform hover:scale-125"
      >
        ✕
      </button>
    </div>

    {/* Cart Items */}
    {cart.length === 0 ? (
      <div className="flex-grow flex items-center justify-center text-gray-500 text-lg">
        Your cart is empty
      </div>
    ) : (
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-white to-purple-50">
        {cart.map((item) => (
          <div
            key={item.Item_id}
            className="flex justify-between items-center bg-gradient-to-br from-indigo-200 via-purple-100 to-purple-300 shadow-md rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow"
          >
            <div>
              <h3 className="font-extrabold text-purple-800 text-base sm:text-lg">{item.Dish_Name}</h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                {item.discounted_price &&
                item.discounted_price < item.Item_Price ? (
                  <>
                    <span className="line-through text-red-400">
                      Rs.{item.Item_Price}
                    </span>
                    <span className="font-semibold text-purple-900">
                      Rs.{item.discounted_price}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-purple-600">
                    Rs.{item.Item_Price}
                  </span>
                )}
              </div>
              <p className="text-gray-500 italic text-xs sm:text-sm">{item.restaurant_name}</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => handleDecrement(item.Item_id)}
                className="text-purple-600 hover:text-purple-800 transition-transform transform hover:scale-110"
              >
                <FaMinus />
              </button>
              <span className="font-bold text-purple-900">{item.quantity}</span>
              <button
                onClick={() => handleIncrement(item.Item_id)}
                className="text-purple-600 hover:text-purple-800 transition-transform transform hover:scale-110"
              >
                <FaPlus />
              </button>
              <button
                onClick={() => handleRemove(item.Item_id)}
                className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Promo Section */}
<div className="p-4 sm:p-6 border-t border-purple-200 bg-white">
  <div className="flex items-center space-x-2 sm:space-x-3">
    <input
      type="text"
      placeholder="Promo Code"
      className="flex-grow border border-purple-300 rounded-lg py-2 px-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      onChange={(e) =>
        setPromo((prev) => ({
          ...prev,
          promo_code: e.target.value,
        }))
      }
    />
    <button
      onClick={handleApplyPromoCode}
      className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-600 transition-transform transform hover:scale-105 text-sm sm:text-base"
    >
      Apply
    </button>
  </div>
  {promo.promo_id && (
    <p className="mt-2 sm:mt-3 text-green-600 text-xs sm:text-sm font-medium">
      Promo Applied: {promo.promo_value}% off!🎉
    </p>
  )}
{
    userData.isFirstOrder && (
      <div className="mt-4 mx-4 p-3 bg-green-50 border border-green-300 rounded-md shadow-sm flex items-center gap-2">
        <div className="text-green-700 text-xl">🎉</div>
        <div>
          <p className="text-sm sm:text-base text-green-800 font-semibold">
            You get <span className="font-bold">50% off</span> on your first order!
          </p>
        </div>
      </div>
    )
  }
</div>

    {/* Summary Section */}
    <div className="p-4 sm:p-6 border-t border-purple-200 bg-gradient-to-b from-purple-50 to-white space-y-3 sm:space-y-5">
      <div className="flex justify-between">
        <span className="text-base sm:text-lg font-semibold text-purple-900">Subtotal:</span>
        <span className="text-base sm:text-lg font-bold text-purple-900">
          Rs.{getSubTotal()}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-base sm:text-lg font-semibold text-purple-900">Delivery:</span>
        <span className="text-base sm:text-lg font-bold text-purple-900">Rs.150</span>
      </div>
      <div className="flex justify-between">
        <span className="text-lg sm:text-xl font-bold text-purple-900">Total:</span>
        <span className="text-lg sm:text-xl font-bold text-purple-900">
          Rs.{getTotalAmount()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between space-x-3 sm:space-x-4">
        <button
          onClick={() => {
            setCartPopup(false);
            setOrderPopUp(true);
          }}
          className="w-1/2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2 sm:py-3 rounded-lg hover:from-purple-700 hover:to-indigo-600 transition-transform transform hover:scale-105 text-sm sm:text-base"
        >
          Place Order
        </button>
        <button
          onClick={() => clearCart()}
          className="w-1/2 bg-red-500 text-white py-2 sm:py-3 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 text-sm sm:text-base"
        >
          Clear Cart
        </button>
      </div>
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
              {/* Tip Options */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  Add a Tip for Your Rider
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {/* Tip Option 50 */}
                  <button
                    type="button"
                    onClick={() => setTipAmount(50)}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-purple-100 hover:bg-purple-200 rounded-lg py-2 px-2 sm:px-4 text-purple-600 text-sm sm:text-base"
                  >
                    <FaBiking className="text-purple-600 text-sm sm:text-base" />
                    Rs.50
                  </button>
                  {/* Tip Option 100 */}
                  <button
                    type="button"
                    onClick={() => setTipAmount(100)}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-purple-100 hover:bg-purple-200 rounded-lg py-2 px-2 sm:px-4 text-purple-600 text-sm sm:text-base"
                  >
                    <FaBiking className="text-purple-600 text-sm sm:text-base" />
                    Rs.100
                  </button>
                  {/* Tip Option 150 */}
                  <button
                    type="button"
                    onClick={() => setTipAmount(150)}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-purple-100 hover:bg-purple-200 rounded-lg py-2 px-2 sm:px-4 text-purple-600 text-sm sm:text-base"
                  >
                    <FaBiking className="text-purple-600 text-sm sm:text-base" />
                    Rs.150
                  </button>
                </div>
                {/* Custom Tip Input */}
                <input
                  type="number"
                  placeholder="Custom Tip Amount"
                  className="mt-3 w-full border rounded-lg py-2 px-3 text-gray-700"
                  onChange={(e) => setTipAmount(e.target.value)}
                  value={tipAmount || ""}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Your rider will receive this tip by us, in hand.
                </p>
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
