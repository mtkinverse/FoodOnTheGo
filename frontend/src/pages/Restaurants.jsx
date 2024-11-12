import React, { useState } from "react";

const Restaurants = () => {
  // Sample data (you can replace this with your actual data source)
  const restaurants = [
    { name: "Pasta Place", cuisine: "italian", rating: 4.5, image: "path/to/image.jpg" },
    { name: "Dragon Wok", cuisine: "chinese", rating: 4.0, image: "path/to/image.jpg" },
    { name: "Curry Corner", cuisine: "indian", rating: 4.8, image: "path/to/image.jpg" },
    // Add more restaurants as needed
  ];

  const [query, setQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  const handleSearch = () => {
    const results = restaurants.filter(
      restaurant =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(results);
  };

  const handleCuisineClick = (cuisine) => {
    const results = restaurants.filter(restaurant => restaurant.cuisine === cuisine);
    setFilteredRestaurants(results);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by cuisine or restaurant name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleSearch}
        >
          <i className="fa fa-search"></i> Search
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300"
          onClick={() => handleCuisineClick("italian")}
        >
          Italian
        </button>
        <button
          className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300"
          onClick={() => handleCuisineClick("chinese")}
        >
          Chinese
        </button>
        <button
          className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300"
          onClick={() => handleCuisineClick("indian")}
        >
          Indian
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRestaurants.length === 0 ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          filteredRestaurants.map((restaurant, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p className="text-gray-500">{restaurant.cuisine}</p>
              <p className="text-gray-700">Rating: {restaurant.rating}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Restaurants;
