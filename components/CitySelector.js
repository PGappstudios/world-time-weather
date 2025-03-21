import { useState, useEffect, useRef } from 'react';
import { searchCities, hasValidTimezone } from '../lib/timeUtils';
import { getCitiesInCountry, getAllCountries, cityDatabase } from '../lib/cityDatabase';

export default function CitySelector({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCountryView, setIsCountryView] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const suggestionsRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterCitiesByTimezone = (cities, country) => {
    return cities.filter(city => {
      const cityWithCountry = `${city}, ${country}`;
      return hasValidTimezone(cityWithCountry);
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      let filtered;
      if (isCountryView) {
        // Search countries
        filtered = getAllCountries()
          .filter(country => 
            country.toLowerCase().includes(value.toLowerCase())
          )
          .map(country => ({ type: 'country', name: country }));
      } else if (selectedCountry) {
        // Search within selected country
        const citiesInCountry = getCitiesInCountry(selectedCountry)
          .filter(city => 
            city.toLowerCase().includes(value.toLowerCase())
          );
        // Filter cities by valid timezone
        const validCities = filterCitiesByTimezone(citiesInCountry, selectedCountry);
        filtered = validCities.map(city => ({ 
          type: 'city', 
          name: `${selectedCountry}, ${city}` 
        }));
      } else {
        // Normal city search - already filtered by timezone in searchCities
        filtered = searchCities(value)
          .map(cityCountry => {
            const [city, country] = cityCountry.split(', ');
            return { type: 'city', name: `${country}, ${city}` };
          });
      }
      setSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else if (selectedCountry) {
      // If we have a selected country and empty search, show all its valid cities
      const citiesInCountry = getCitiesInCountry(selectedCountry);
      const validCities = filterCitiesByTimezone(citiesInCountry, selectedCountry);
      const filtered = validCities.map(city => ({ 
        type: 'city', 
        name: `${selectedCountry}, ${city}` 
      }));
      setSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'country') {
      // When a country is selected
      setSelectedCountry(suggestion.name);
      setIsCountryView(false);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);

      // Get all cities for the selected country and add them if they have valid timezones
      const citiesInCountry = getCitiesInCountry(suggestion.name);
      const validCities = filterCitiesByTimezone(citiesInCountry, suggestion.name);
      
      // Add each valid city to the timeline
      validCities.forEach(city => {
        const cityWithCountry = `${city}, ${suggestion.name}`;
        onSelect(cityWithCountry);
      });
    } else {
      // If a city is selected, make sure the format is "City, Country"
      const [country, city] = suggestion.name.split(', ');
      const formattedSelection = `${city}, ${country}`; // Swap the order to match expected format
      onSelect(formattedSelection);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedCountry(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const matchingCity = suggestions.find(suggestion =>
        suggestion.type === 'city' && 
        suggestion.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingCity) {
        onSelect(matchingCity.name);
      }
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedCountry(null);
    }
  };

  const toggleSearchMode = () => {
    setIsCountryView(!isCountryView);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedCountry(null);
  };
  
  // Updated popular cities with proper formatting
  const popularCities = [
    'New York, USA',
    'London, UK',
    'Tokyo, Japan',
    'Paris, France',
    'Sydney, Australia',
    'Dubai, UAE',
    'Singapore, Singapore',
    'Hong Kong, China',
    'Mumbai, India',
    'Seoul, South Korea',
    'São Paulo, Brazil',
    'Cairo, Egypt',
    'Moscow, Russia',
    'Berlin, Germany',
    'Toronto, Canada',
    'Mexico City, Mexico',
    'Bangkok, Thailand',
    'Istanbul, Turkey',
    'Los Angeles, USA',
    'Shanghai, China',
    'Jakarta, Indonesia',
    'Delhi, India'
  ];
  
  const handleQuickSelect = (cityName) => {
    onSelect(cityName);
  };

  const handleBackToCountries = () => {
    setIsCountryView(true);
    setSelectedCountry(null);
    setSearchTerm('');
    setSuggestions([]);
  };
  
  // Update the useEffect to show only valid cities when country is selected
  useEffect(() => {
    if (selectedCountry) {
      const citiesInCountry = getCitiesInCountry(selectedCountry);
      const validCities = filterCitiesByTimezone(citiesInCountry, selectedCountry);
      const filtered = validCities.map(city => ({ 
        type: 'city', 
        name: `${selectedCountry}, ${city}` 
      }));
      setSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
    }
  }, [selectedCountry]);

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setIsCountryView(false)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !isCountryView
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Search by City
        </button>
        <button
          onClick={() => setIsCountryView(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isCountryView
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Search by Country
        </button>
        {selectedCountry && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Viewing cities in {selectedCountry}</span>
            <button
              onClick={handleBackToCountries}
              className="text-blue-500 hover:text-blue-700"
            >
              (Change Country)
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={
              isCountryView
                ? "Enter country name (e.g., Japan, France)..."
                : selectedCountry
                ? `Enter city name in ${selectedCountry}...`
                : "Enter city name (e.g., London, Tokyo)..."
            }
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
            className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-auto"
            >
              {suggestions.map((suggestion, index) => {
                const isCountrySuggestion = suggestion.type === 'country';
                if (isCountrySuggestion) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">🌍</span>
                      <span className="font-medium">{suggestion.name}</span>
                    </button>
                  );
                }

                const [country, city] = suggestion.name.split(', ');
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors flex items-center"
                  >
                    <span className="font-medium">{country}</span>
                    <span className="text-gray-500 ml-1">, {city}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors"
        >
          Add City
        </button>
      </form>
      
      {!isCountryView && !selectedCountry && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-gray-500">Popular cities:</span>
          {popularCities.map((cityName, index) => {
            const [city, country] = cityName.split(', ');
            return (
              <button
                key={index}
                onClick={() => handleQuickSelect(cityName)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors flex items-center gap-1"
              >
                <span className="font-medium">{city}</span>
                <span className="text-gray-500 text-xs">{country}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 