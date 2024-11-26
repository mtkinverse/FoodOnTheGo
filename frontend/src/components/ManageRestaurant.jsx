import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TrashIcon, PencilSquareIcon,XMarkIcon  } from "@heroicons/react/24/outline";

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
  });

  //states for updating menu
  const [menuItems, setMenuItems] = useState([]);
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`/api/menu/${restaurant.Restaurant_id}`);
      setMenuItems(response.data);
      console.log("menu items received: ", menuItems);
    } catch (err) {
      setError("Failed to fetch menu items.");
    }
  };

  const [updateMenuPopupOpen, setUpdateMenuPopupOpen] = useState(false);

  const handleUpdateMenuClick = async () => {
    await fetchMenuItems();
    setUpdateMenuPopupOpen(true);
  };

  const handleDeleteItemClick = async (item_id) => {
    try {
      const response = await axios.post(
        `/api/deleteItem/${restaurant.Restaurant_id}`,
        { item_id: item_id }
      );
      const temp = menuItems;

      setMenuItems(temp.filter((ele) => ele.Item_id != item_id));
    } catch (err) {
      console.log("Error deleting menu items");
    }
  };

  const [updatedItem, setUpdated] = useState({
    // Item_id : 0,
    // name: "",
    // price: "",
    // cuisine: "",
    // image: null,
  });
  const [updateItemPopup, setPopup] = useState(false);
  const handleUpdateItemClick = (item) => {
    console.log("received item : ", item);
    setUpdated(item);
    setPopup(true);
  };

  const handleupdatedItemChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      console.log("image updated");
      setUpdated((prevValues) => ({
        ...prevValues,
        image: e.target.files[0],
      }));
    } else {
      console.log("value updated");
      setUpdated((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const submitUpdatedItem = async (e) => {
    e.preventDefault();
    console.log("sending req");
    console.log(updatedItem);

    const formData = new FormData();

    formData.append("Item_id", updatedItem.Item_id);
    formData.append("Dish_Name", updatedItem.Dish_Name);
    formData.append("Item_Price", updatedItem.Item_Price);
    formData.append("Cuisine", updatedItem.Cuisine);

    if (updatedItem.image) {
      formData.append("image", updatedItem.image);
    }

    try {
      const res = await axios.post(
        `/api/updateItem/${restaurant.Restaurant_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMenuItems(
        menuItems.map((ele) => {
          if (ele.Item_id === updatedItem.Item_id) {
            return {
              ...ele,
              Dish_Name: updatedItem.Dish_Name,
              Item_Price: updatedItem.Item_Price,
              Cuisine: updatedItem.Cuisine,
              Image: updatedItem.Item_image,
            };
          }
          return ele;
        })
      );

      console.log("Item updated successfully", res.data);
      setPopup(false);
      setUpdated({});
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const handleLocationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocationData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    const req = {
      Restaurant_Name: restaurant.Restaurant_Name,
      OpensAt: restaurant.OpensAt,
      closesAt: restaurant.ClosesAt,
      Restaurant_Image: restaurant.Restaurant_Image,
      Owner_id: restaurant.Owner_id,
      Address: locationData.address,
      Contact_No: locationData.contactNo,
    };
    try {
      console.log("sending data ", req);
      const response = await axios.post(
        "/api/addLocation/",
        JSON.stringify(req),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Location added successfully!");
      setAddLocationPopupOpen(false);
      setLocationData({
        address: "",
        contactNo: "",
        status: true, // Default value
      });
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
      setTiming({
        opensAt: "",
        closesAt: "",
      });
    } catch (error) {
      console.error("Error updating timings:", error.response?.data || error);
      alert("Failed to update timings.");
    }
  };

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
      setMenuItem((prevValues) => ({
        ...prevValues,
        [name]: value, // Update the specific field dynamically
      }));
    }
  };

  const [adminPopup, setAdminPopup] = useState(false);
  const [adminData, setAdminData] = useState({
    Admin_Name: "",
    Email_address: "",
    Account_Password: "",
    Phone_no: "",
  });

  const handleAdminCred = e => {
    e.preventDefault();
    if (restaurant.r_admin && !adminData.Email_address) {
      axios.get('/api/getAdmin/' + restaurant.Location_id)
        .then(res => {
          console.log('received ', res.data.admin);
          setAdminData({...res.data.admin,newPassword : ""})
        })
        .catch(err => console.log(err.message))
    }
    setAdminPopup(true);
  }

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(restaurant.Location_id);

      if (restaurant.r_admin === null) {
        console.log('not me',adminData);
        
        const response = await axios.post(
          `/api/addAdmin/${restaurant.Restaurant_id}`,
          { adminData, Location_id: restaurant.Location_id }
        );
      } 
      else{
        console.log('heres : ', adminData)
        axios.post('/api/updateAdmin',JSON.stringify({adminData}), {withCredentials: true, headers:{"Content-Type":"application/json"}})
        .then(res => alert('Admin updated successfully'))
        .catch(err => console.log(err.message))
      }
      console.log("Admin updated successfully");
      setAdminPopup(false);
      
    } catch (err) {
      console.log("Error adding admin" + err.message);
      window.alert("Error adding admin");
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
      setMenuItem({
        name: "",
        price: "",
        cuisine: "",
        image: null,
      });
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
    formData.append("Restaurant_image", newImage);

    try {
      console.log("Sending image change request ", formData);
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
          {/* Add Menu button
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
          )} */}

          {menuId !== null && (
            <button
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
              onClick={handleUpdateMenuClick}
            >
              Update Menu
            </button>
          )}

          <button
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg shadow hover:bg-purple-700 transition"
            onClick={handleAdminCred}
          >
            {restaurant.r_admin ? 'Update Admin' : 'Add Admin'}
          </button>



          {adminPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0 p-6">
                <h2 className="text-xl font-bold mb-4 text-center">
                  {restaurant.r_admin ? 'Update Admin' : 'Add Admin'}
                </h2>
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="admin_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Admin Name
                    </label>
                    <input
                      type="text"
                      id="admin_name"
                      name="Admin_Name"
                      value={adminData.Admin_Name}
                      onChange={handleAdminChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email_address"
                      name="Email_address"
                      value={adminData.Email_address}
                      onChange={handleAdminChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="account_password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {restaurant.r_admin ? 'Current Password': 'Password'}
                    </label>
                    <input
                      type="password"
                      id="account_password"
                      name="Account_Password"
                      value={adminData.Account_Password}
                      onChange={handleAdminChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  {restaurant.r_admin &&
                    <div>
                    <label
                      htmlFor="account_password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="account_password"
                      name="newPassword"
                      value={adminData.newPassword}
                      onChange={handleAdminChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>}
                  <div>
                    <label
                      htmlFor="phone_no"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone_no"
                      name="Phone_no"
                      value={adminData.Phone_no}
                      onChange={handleAdminChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      {restaurant.r_admin ? 'Update Admin' : 'Create Admin'}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300"
                      onClick={() => setAdminPopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {updateMenuPopupOpen && (
             <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
             <div className="relative w-11/12 max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
               {/* Header */}
               <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                 <h2 className="text-xl font-semibold">Update Menu</h2>
                 <button 
                   onClick={() => setUpdateMenuPopupOpen(false)}
                   className="hover:bg-purple-700 rounded-full p-1 transition"
                 >
                   <XMarkIcon className="h-6 w-6" />
                 </button>
               </div>
       
               {/* Content */}
               <div className="p-6">
                 {menuItems.length > 0 ? (
                   <div className="space-y-4">
                     {menuItems.map((item) => (
                       <div 
                         key={item.id} 
                         className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                       >
                         <div>
                           <h3 className="text-lg font-bold text-gray-800">{item.Dish_Name}</h3>
                           <p className="text-gray-600">Rs. {item.Item_Price}</p>
                         </div>
                         
                         <div className="flex items-center space-x-3">
                           <button 
                             onClick={() =>{ 
                              setUpdateMenuPopupOpen(false)
                              handleUpdateItemClick(item)}}
                             className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full transition"
                           >
                             <PencilSquareIcon className="h-5 w-5" />
                           </button>
                           <button 
                             onClick={() => handleDeleteItemClick(item.Item_id)}
                             className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition"
                           >
                             <TrashIcon className="h-5 w-5" />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-center text-gray-500 py-4">No items in the menu.</p>
                 )}
               </div>
             </div>
           </div>
          )}

          {updateItemPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                  Update Menu Item
                </h2>
                <form onSubmit={submitUpdatedItem}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Item Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="Dish_Name"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={updatedItem.Dish_Name}
                      onChange={handleupdatedItemChange}
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
                      name="Item_Price"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={updatedItem.Item_Price}
                      onChange={handleupdatedItemChange}
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
                      name="Cuisine"
                      className="w-full border rounded-lg py-2 px-3 text-gray-700"
                      value={updatedItem.Cuisine}
                      onChange={handleupdatedItemChange}
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
                      onChange={handleupdatedItemChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                      onClick={() => setPopup(false)}
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

          {/* Delete Menu button
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
          )} */}

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