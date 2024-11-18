import React from "react";
import { useParams } from "react-router-dom";

const ManageRestaurant = ({ isOpen, onClose,restaurant}) => {
  const { id } = useParams();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={onClose}
        >
          &times;
        </button>

        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Manage Restaurant
        </h1>
        <p className="text-gray-700 mb-8 text-lg text-center">
          You are managing restaurant <strong> {restaurant.Restaurant_Name}</strong>
          <strong className="text-purple-700">{id}</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition">
            Add Menu
            onClick ={() => {}}
          </button>
          <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition">
            Update Menu
            onClick ={() => {}}
          </button>
          <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition">
            Delete Menu
            onClick ={() => {}}
          </button>
          <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition">
            Add Menu Items
            onClick ={() => {}}
          </button>
          <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition">
            Change Timings
            onClick ={() => {}}
          </button>
          <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition">
            Change Picture
            onClick ={() => {}}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRestaurant;
