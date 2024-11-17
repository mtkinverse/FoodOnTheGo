import React, { useState } from "react";
import axios from "axios";  // Import axios
import { useUserContext } from "../contexts/userContext";

const AddRestaurantPopup = ({ isOpen, onClose,fetchRestaurants}) => {
  const { userData } = useUserContext();

  const [formValues, setFormValues] = useState({
    Restaurant_name: "",
    OpensAt: "",
    ClosesAt: "",
    Restaurant_image: null, // Initialize for file input
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle file input separately
    if (name === "Restaurant_image") {
      setFormValues((prevValues) => ({
        ...prevValues,
        Restaurant_image: e.target.files[0], // Store the file object
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value, // Update the specific field dynamically
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data for backend submission
    const formData = new FormData();
    formData.append("Restaurant_name", formValues.Restaurant_name);
    formData.append("OpensAt", formValues.OpensAt);
    formData.append("ClosesAt", formValues.ClosesAt);
    formData.append("Restaurant_image", formValues.Restaurant_image);
    formData.append("Owner_id", userData.User_id);

    axios
      .post("/api/addRestaurant", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Restaurant added:", response.data);
        setFormValues({
          Restaurant_name: "",
          OpensAt: "",
          ClosesAt: "",
          Restaurant_image: null,
        });
        // Close the popup
        onClose();
        fetchRestaurants();
      })
      .catch((error) => {
        console.error("Error adding restaurant:", error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold text-purple-900">Add Restaurant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-semibold">
              Restaurant Name
            </label>
            <input
              type="text"
              name="Restaurant_name"
              value={formValues.Restaurant_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter restaurant name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-semibold">
              Opens At
            </label>
            <input
              type="time"
              name="OpensAt"
              value={formValues.OpensAt}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-semibold">
              Closes At
            </label>
            <input
              type="time"
              name="ClosesAt"
              value={formValues.ClosesAt}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-semibold">
              Restaurant Image
            </label>
            <input
              type="file"
              name="Restaurant_image"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              accept="image/*"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantPopup;
