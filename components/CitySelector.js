import { useState } from 'react';

export default function CitySelector({ onSelect }) {
  const [city, setCity] = useState('');
  
  const popularCities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSelect(city);
      setCity('');
    }
  };
  
  const handleQuickSelect = (cityName) => {
    onSelect(cityName);
  };
  
  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors"
        >
          Add City
        </button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Popular cities:</span>
        {popularCities.map((cityName, index) => (
          <button
            key={index}
            onClick={() => handleQuickSelect(cityName)}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
          >
            {cityName}
          </button>
        ))}
      </div>
    </div>
  );
} 