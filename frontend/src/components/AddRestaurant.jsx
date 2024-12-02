import React, { useState } from "react";
import axios from "axios";  
import { useUserContext } from "../contexts/userContext";
import { useAlertContext } from "../contexts/alertContext";

const AddRestaurantPopup = ({ isOpen, onClose,fetchRestaurants}) => {
  const { userData } = useUserContext();
  const {setAlert} = useAlertContext();

  const [formValues, setFormValues] = useState({
    Restaurant_name: "",
    OpensAt: "",
    ClosesAt: "",
    Address: "",
    Loc_Contact_No: "",
    Restaurant_image: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Restaurant_image") {
      setFormValues((prevValues) => ({
        ...prevValues,
        Restaurant_image: e.target.files[0], 
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value, 
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
    formData.append("Address",formValues.Address);
    formData.append("Loc_Contact_No",formValues.Loc_Contact_No);
    axios
      .post("/api/addRestaurant", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setFormValues({
          Restaurant_name: "",
          OpensAt: "",
          ClosesAt: "",
          Restaurant_image: null,
        });
        // Close the popup
        setAlert({message: 'Congratulations, on starting a new restaurant!',type : 'success'});
        onClose();
        fetchRestaurants();
      })
      .catch((error) => {
        setAlert({message: error.response.data.message ,type:'failure'});
        console.error("Error adding restaurant:", error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center border-b border-purple-100">
          <h2 className="text-2xl font-bold text-white tracking-tight">Add Restaurant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-purple-100 rounded-full p-2 transition-colors duration-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 space-y-4">
          {/* Restaurant Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Restaurant Name
            </label>
            <input
              type="text"
              name="Restaurant_name"
              value={formValues.Restaurant_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
              placeholder="Enter restaurant name"
              required
            />
          </div>

          {/* Operating Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Opens At
              </label>
              <input
                type="time"
                name="OpensAt"
                value={formValues.OpensAt}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Closes At
              </label>
              <input
                type="time"
                name="ClosesAt"
                value={formValues.ClosesAt}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              First Location Address
            </label>
            <input
              type="text"
              name="Address"
              value={formValues.Address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Location Contact Number
            </label>
            <input
              type="tel"
              name="Loc_Contact_No"
              value={formValues.Loc_Contact_No}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
              required
            />
          </div>

          {/* Restaurant Image */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Restaurant Image
            </label>
            <input
              type="file"
              name="Restaurant_image"
              onChange={handleChange}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-purple-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              accept="image/*"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
            >
              Add Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantPopup;
