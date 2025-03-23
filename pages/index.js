import { useState, useEffect } from 'react';
import Head from 'next/head';
import CitySelector from '../components/CitySelector';
import TimeGrid from '../components/TimeGrid';
import TimeComparisonGrid from '../components/TimeComparisonGrid';
import Weather from '../components/Weather';
import MeetingScheduler from '../components/MeetingScheduler';
import WorkFromHome from '../components/WorkFromHome';
import { getTimezoneData, getAllTimezones } from '../lib/timeUtils';
import { getWeather } from '../lib/weather';
import { FaTimes, FaSun, FaCloud, FaCloudRain, FaSnowflake, FaMapMarkerAlt } from 'react-icons/fa';
import moment from 'moment-timezone';
import SharingOptions from '../components/SharingOptions';
import FAQ from '../components/FAQ';

// Compact City Card component with time and weather
const CityTimeWeatherCard = ({ city, onRemove, onCardClick }) => {
  if (!city || !city.timezone) return null;
  
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove();
  };
  
  const localTime = moment().tz(city.timezone.timezone);
  const timezonePath = city.timezone.timezone.split('/');
  const region = timezonePath[0];
  const location = timezonePath[timezonePath.length - 1].replace('_', ' ');
  
  // Get weather data
  const currentWeather = city.weather?.current_weather || {};
  const daily = city.weather?.daily || {};
  const hourly = city.weather?.hourly || {};
  
  // Get current hour and weather data
  const currentHour = new Date().getHours();
  const safeIndex = Math.min(currentHour, (hourly.temperature_2m || []).length - 1);
  
  // Get temperature
  const temperature = hourly.temperature_2m || [];
  const currentTemp = temperature[safeIndex] !== undefined 
    ? temperature[safeIndex] 
    : (currentWeather.temperature || 'N/A');
  
  // Get min/max temps
  const minTemp = daily.temperature_2m_min ? daily.temperature_2m_min[0] : null;
  const maxTemp = daily.temperature_2m_max ? daily.temperature_2m_max[0] : null;
  
  // Get appropriate weather icon component based on weather code
  const getWeatherIcon = (code) => {
    if (code >= 0 && code <= 1) return <FaSun size={28} className="text-yellow-500" />;
    if (code >= 2 && code <= 3) return <FaCloud size={28} className="text-gray-500" />;
    if (code >= 4 && code <= 9) return <FaCloud size={28} className="text-gray-400" />;
    if (code >= 10 && code <= 99) return <FaCloudRain size={28} className="text-blue-500" />;
    return <FaCloud size={28} className="text-gray-500" />;
  };
  
  const weatherIcon = getWeatherIcon(
    hourly.weathercode?.[safeIndex] !== undefined 
      ? hourly.weathercode[safeIndex] 
      : currentWeather.weathercode
  );
  
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onCardClick();
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{city.name}</h3>
          <p className="text-4xl font-bold mb-1 text-gray-800">{localTime.format('HH:mm:ss')}</p>
          <p className="text-gray-500">{localTime.format('MMMM D, YYYY')}</p>
          <div className="flex items-center mt-1">
            <FaMapMarkerAlt className="text-gray-400 text-xs mr-1" />
            <p className="text-xs text-gray-400">{region}/{location}</p>
          </div>
          {city.weather && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex items-center">
                <div className="mr-3 bg-blue-50 p-2 rounded-full">
                  {weatherIcon}
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    {typeof currentTemp === 'number' ? `${currentTemp.toFixed(1)}°C` : 'N/A'}
                  </span>
                  {minTemp !== null && maxTemp !== null && (
                    <div className="text-xs text-gray-500 flex gap-2">
                      <span className="inline-flex items-center">
                        <span className="text-blue-500 mr-1">▼</span> {minTemp.toFixed(1)}°C
                      </span>
                      <span className="inline-flex items-center">
                        <span className="text-red-500 mr-1">▲</span> {maxTemp.toFixed(1)}°C
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleRemoveClick}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Remove city"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTimezones, setAvailableTimezones] = useState([]);
  const [viewMode, setViewMode] = useState('cards');
  const [loadingCities, setLoadingCities] = useState(new Set());

  // Handle view mode changes
  const handleViewModeChange = (mode) => {
    if (mode === 'comparison' && cities.length === 0) {
      return;
    }
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  // Load saved view mode on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
      if (savedViewMode === 'comparison' && cities.length === 0) {
        setViewMode('cards');
        localStorage.setItem('viewMode', 'cards');
      } else {
        setViewMode(savedViewMode);
      }
    }
  }, [cities.length]);

  // Reset to cards view when all cities are removed
  useEffect(() => {
    if (cities.length === 0 && viewMode === 'comparison') {
      setViewMode('cards');
      localStorage.setItem('viewMode', 'cards');
    }
  }, [cities.length]);

  // Load available timezones on initial load
  useEffect(() => {
    const loadTimezones = async () => {
      try {
        const timezones = getAllTimezones();
        setAvailableTimezones(timezones);
      } catch (err) {
        console.error("Failed to load available timezones:", err);
      }
    };
    
    loadTimezones();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCities(prevCities => [...prevCities]);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Load saved cities
  useEffect(() => {
    const loadSavedCities = async () => {
      try {
        const savedCities = JSON.parse(localStorage.getItem('cities') || '[]');
        if (savedCities.length === 0) return;
        
        setLoading(true);
        
        const cityPromises = savedCities.map(async (city) => {
          try {
            const timezoneData = await getTimezoneData(city.name);
            const weatherData = await getWeather(
              timezoneData.latitude,
              timezoneData.longitude
            ).catch(() => null);
            
            return {
              name: city.name,
              timezone: timezoneData,
              weather: weatherData
            };
          } catch (error) {
            console.error(`Failed to load city ${city.name}:`, error);
            return null;
          }
        });
        
        const loadedCities = (await Promise.all(cityPromises)).filter(Boolean);
        setCities(loadedCities);
        localStorage.setItem('cities', JSON.stringify(loadedCities));
        
      } catch (error) {
        console.error('Failed to load saved cities:', error);
        setError('Failed to load saved cities. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedCities();
  }, []);

  const addCity = async (cityName) => {
    setError(null);
    
    const normalizedCityName = cityName.split(',')[0].toLowerCase().trim();
    
    if (cities.some(city => city.name.split(',')[0].toLowerCase().trim() === normalizedCityName)) {
      setError(`${cityName.split(',')[0]} is already in your list`);
      return;
    }
    
    setLoadingCities(prev => new Set([...prev, cityName]));
    
    try {
      const timezoneData = await getTimezoneData(cityName);
      const weatherData = await getWeather(
        timezoneData.latitude,
        timezoneData.longitude
      ).catch(() => null);
      
      const newCity = {
        name: cityName,
        timezone: timezoneData,
        weather: weatherData
      };
      
      setCities(prevCities => {
        const updatedCities = [...prevCities, newCity];
        localStorage.setItem('cities', JSON.stringify(updatedCities));
        return updatedCities;
      });
      
    } catch (err) {
      console.error("Failed to add city:", err);
      setError(err.message || "Failed to add city. Please try again.");
    } finally {
      setLoadingCities(prev => {
        const next = new Set(prev);
        next.delete(cityName);
        return next;
      });
    }
  };

  const removeCity = (index, newCities) => {
    setCities(prevCities => {
      const updatedCities = newCities || prevCities.filter((_, i) => i !== index);
      localStorage.setItem('cities', JSON.stringify(updatedCities));
      return updatedCities;
    });
  };

  const renderCompactCityCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {cities.map((city, index) => (
        <CityTimeWeatherCard
          key={index}
          city={city}
          onRemove={() => removeCity(index)}
          onCardClick={() => handleViewModeChange('comparison')}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Head>
        <title>World Time & Weather | Compare Time Zones & Weather Globally</title>
        <meta name="description" content="Compare time zones, schedule international meetings, and check weather conditions worldwide. Perfect for remote teams and global collaboration." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            World Time & Weather
          </h1>
          <p className="text-xl text-gray-600">
            Compare times and weather across different cities around the world
          </p>
        </div>

        <CitySelector onSelect={addCity} />

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg shadow-sm" role="group">
              <button
                type="button"
                onClick={() => handleViewModeChange('comparison')}
                disabled={cities.length === 0}
                className={`px-6 py-3 text-sm font-medium rounded-l-lg border transition-all duration-200 ${
                  viewMode === 'comparison'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : cities.length === 0
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                Time Comparison
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('cards')}
                className={`px-6 py-3 text-sm font-medium rounded-r-lg border transition-all duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                Weather Cards
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {viewMode === 'comparison' ? 'Time Comparison' : 'Weather Overview'}
          </h2>
          {viewMode === 'comparison' && cities.length > 0 ? (
            <TimeComparisonGrid 
              cities={cities} 
              onRemove={removeCity}
            />
          ) : (
            renderCompactCityCards()
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your World Times</h2>
          <SharingOptions cities={cities} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule a Meeting</h2>
          <MeetingScheduler cities={cities} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Remote Work Tools</h2>
          <WorkFromHome cities={cities} />
        </div>

        <FAQ />
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        © {new Date().getFullYear()} World Time & Weather. All rights reserved.
      </footer>
    </div>
  );
}