import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ManageRestaurant = ({
  isOpen,
  onClose,
  restaurant,
  fetchRestaurants,
}) => {
  const { id } = useParams();
  const [menuId, setMenuId] = useState(restaurant.Menu_id); // Local state to track menu_id

  const [timingPopupOpen, setTimingPopupOpen] = useState(false); // State to control timing popup
  const [timing, setTiming] = useState({
    opensAt: "",
    closesAt: "",
  });

  const [picturePopupOpen, setPicturePopupOpen] = useState(false); // State for picture upload pop-up
  const [newImage, setNewImage] = useState(null); // State for storing selected image

  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    cuisine: "",
    image: null,
  });
  const [addItemPopupOpen, setAddItemPopupOpen] = useState(false);

  const [addLocationPopupOpen, setAddLocationPopupOpen] = useState(false); // State for location popup
  const [locationData, setLocationData] = useState({
    address: "",
    contactNo: "",
    status: true, // Default value
  });

  const handleLocationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocationData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('sending data to ',locationData)
      const response = await axios.post(
        `/api/addLocation/${restaurant.Restaurant_id}`,
        locationData
      );
      alert("Location added successfully!");
      setAddLocationPopupOpen(false); 
      fetchRestaurants(); 
    } catch (error) {
      console.error("Error adding location:", error.response?.data || error);
      alert("Failed to add location.");
    }
  };

  useEffect(() => {
    setMenuId(restaurant.Menu_id);
    fetchRestaurants();
  }, [restaurant.Menu_id]);

  if (!isOpen) return null;

  const handleTimingSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Timing state before sending request:", timing);
      const response = await axios.post(
        `/api/updateTimings/${restaurant.Restaurant_id}`,
        {
          OpensAt: timing.opensAt,
          ClosesAt: timing.closesAt,
        }
      );

      alert("Timings updated successfully!");
      console.log("Response:", response.data);
      setTimingPopupOpen(false); // Close the popup after submission
      fetchRestaurants();
    } catch (error) {
      console.error("Error updating timings:", error.response?.data || error);
      alert("Failed to update timings.");
    }
  };

  //for updating tiings
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setTiming((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMenuItemChange = (e) => {
    const { name, value } = e.target;
    // Handle file input separately
    if (name === "image") {
      console.log("image updated");
      setMenuItem((prevValues) => ({
        ...prevValues,
        image: e.target.files[0], // Store the file object
      }));
    } else {
      console.log("value updated");
      setMenuItem((prevValues) => ({
        ...prevValues,
        [name]: value, // Update the specific field dynamically
      }));
    }
  };

  const handleMenuItemSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", menuItem.name);
    formData.append("price", menuItem.price);
    formData.append("cuisine", menuItem.cuisine);
    if (menuItem.image) {
      console.log("image appened");
      formData.append("image", menuItem.image);
    }
    formData.append("menu_id", menuId);
    try {
      console.log("sending add item request with", formData);
      const response = await axios.post(
        `/api/addMenuItem/${restaurant.Restaurant_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Menu item added successfully!");
      console.log("Response:", response.data);
      setAddItemPopupOpen(false); // Close the popup after submission
      fetchRestaurants(); // Refresh the menu
    } catch (error) {
      console.error("Error adding menu item:", error.response?.data || error);
      alert("Failed to add menu item.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!newImage) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("New_Image", newImage);

    try {
      const response = await axios.post(
        `/api/changeRestaurantImage/${restaurant.Restaurant_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Image updated successfully!");
      console.log("Response:", response.data);
      setPicturePopupOpen(false); // Close the picture upload popup
      fetchRestaurants(); // Refresh the restaurant data
    } catch (error) {
      console.error("Error changing image:", error.response?.data || error);
      alert("Failed to update image.");
    }
  };

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
          You are managing restaurant{" "}
          <strong>{restaurant.Restaurant_Name}</strong>
        </p>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Add Menu button */}
          {menuId === null && (
            <button
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `/api/addMenu/${restaurant.Restaurant_id}`
                  );
                  alert("Menu created successfully!");
                  console.log("Response:", response.data.menu_id);
                  setMenuId(response.data.menu_id); // Update local state
                } catch (error) {
                  console.error(
                    "Error creating menu:",
                    error.response?.data || error
                  );
                  alert("Failed to create menu.");
                }
              }}
            >
              Add Menu
            </button>
          )}

          {menuId !== null && (
            <button
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
              onClick={() => {}}
            >
              Update Menu
            </button>
          )}

          {/* Delete Menu button */}
          {menuId !== null && (
            <button
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `/api/deleteMenu/${restaurant.Restaurant_id}`
                  );
                  alert("Menu deleted successfully!");
                  setMenuId(null); // Reset local state
                } catch (error) {
                  console.error(
                    "Error deleting menu:",
                    error.response?.data || error
                  );
                  alert("Failed to delete menu.");
                }
              }}
            >
              Delete Menu
            </button>
          )}

          {/* Add Menu Items Button */}
          {menuId !== null && (
            <button
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
              onClick={() => setAddItemPopupOpen(true)}
            >
              Add Menu Item
            </button>
          )}

          {/* Add Menu Item Modal */}
          {addItemPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                  Add Menu Item
                </h2>
                <form onSubmit={handleMenuItemSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Item Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={menuItem.name}
                      onChange={handleMenuItemChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="price"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Price:
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={menuItem.price}
                      onChange={handleMenuItemChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="cuisine"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Cuisine:
                    </label>
                    <input
                      type="text"
                      id="cuisine"
                      name="cuisine"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={menuItem.cuisine}
                      onChange={handleMenuItemChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="image"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Upload Image:
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      onChange={handleMenuItemChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                      onClick={() => setAddItemPopupOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                    >
                      Add Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <button
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
            onClick={() => setTimingPopupOpen(true)}
          >
            Change Timings
          </button>

          <button
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
            onClick={() => {
              setAddLocationPopupOpen(true);
            }}
          >
            Add Location
          </button>

          {addLocationPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                  Add Location for {restaurant.Restaurant_Name}
                </h2>
                <form onSubmit={handleLocationSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Address:
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={locationData.address}
                      onChange={handleLocationChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="contactNo"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Contact Number:
                    </label>
                    <input
                      type="text"
                      id="contactNo"
                      name="contactNo"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={locationData.contactNo}
                      onChange={handleLocationChange}
                      required
                    />
                  </div>

                  <div className="mb-4 flex items-center">
                    <label
                      htmlFor="openStatus"
                      className="block text-gray-700 font-bold mr-2"
                    >
                      Open Status:
                    </label>
                    <input
                      type="checkbox"
                      id="openStatus"
                      name="status"
                      checked={locationData.status}
                      onChange={handleLocationChange}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                      onClick={() => setAddLocationPopupOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                    >
                      Add Location
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <button
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
            onClick={() => setPicturePopupOpen(true)} // Open the picture change popup
          >
            Change Cover Picture
          </button>
        </div>

        {/* Timing Popup */}
        {timingPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">
                Update Timings
              </h2>
              <form onSubmit={handleTimingSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="openingTime"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    New Opening Time:
                  </label>
                  <input
                    type="time"
                    id="openingTime"
                    name="opensAt"
                    className="w-full border rounded-lg py-2 px-3 text-gray-700"
                    value={timing.opensAt}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="closingTime"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    New Closing Time:
                  </label>
                  <input
                    type="time"
                    id="closingTime"
                    name="closesAt"
                    className="w-full border rounded-lg py-2 px-3 text-gray-700"
                    value={timing.closesAt}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                    onClick={() => setTimingPopupOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Picture Change Popup */}
        {picturePopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">
                Change Restaurant Picture
              </h2>
              <form onSubmit={handleImageSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="newImage"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Select Image:
                  </label>
                  <input
                    type="file"
                    id="newImage"
                    name="New_Image"
                    className="w-full border rounded-lg py-2 px-3 text-gray-700"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                    onClick={() => setPicturePopupOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  >
                    Change
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRestaurant;
