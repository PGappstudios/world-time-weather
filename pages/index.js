import { useState, useEffect } from 'react';
import Head from 'next/head';
import CitySelector from '../components/CitySelector';
import TimeGrid from '../components/TimeGrid';
import TimeComparisonGrid from '../components/TimeComparisonGrid';
import Weather from '../components/Weather';
import MeetingScheduler from '../components/MeetingScheduler';
import WorkFromHome from '../components/WorkFromHome';
import { getTimezones, getAllTimezones } from '../lib/timezone';
import { getWeather } from '../lib/weather';
import { FaTimes, FaSun, FaCloud, FaCloudRain, FaSnowflake, FaMapMarkerAlt } from 'react-icons/fa';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import SharingOptions from '../components/SharingOptions';
import FAQ from '../components/FAQ';

// Load the required dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Map of country/region abbreviations to countries for flag determination
const regionToCountry = {
  'Europe': {
    'London': 'GB',
    'Paris': 'FR',
    'Berlin': 'DE',
    'Rome': 'IT',
    'Madrid': 'ES',
    'Amsterdam': 'NL',
    'Brussels': 'BE',
    'Vienna': 'AT',
    'Zurich': 'CH',
    'Dublin': 'IE',
    'Stockholm': 'SE',
    'Oslo': 'NO',
    'Copenhagen': 'DK',
    'Helsinki': 'FI',
    'Athens': 'GR',
    'Lisbon': 'PT',
    'Prague': 'CZ',
    'Warsaw': 'PL',
    'Budapest': 'HU',
    'Moscow': 'RU'
  },
  'America': {
    'New_York': 'US',
    'Los_Angeles': 'US',
    'Chicago': 'US',
    'Toronto': 'CA',
    'Vancouver': 'CA',
    'Mexico_City': 'MX',
    'Bogota': 'CO',
    'Sao_Paulo': 'BR',
    'Buenos_Aires': 'AR',
    'Santiago': 'CL',
    'Lima': 'PE'
  },
  'Asia': {
    'Tokyo': 'JP',
    'Seoul': 'KR',
    'Shanghai': 'CN',
    'Hong_Kong': 'HK',
    'Singapore': 'SG',
    'Bangkok': 'TH',
    'Jakarta': 'ID',
    'Mumbai': 'IN',
    'New_Delhi': 'IN',
    'Dubai': 'AE',
    'Istanbul': 'TR',
    'Tel_Aviv': 'IL'
  },
  'Australia': {
    'Sydney': 'AU',
    'Melbourne': 'AU',
    'Brisbane': 'AU',
    'Perth': 'AU',
    'Auckland': 'NZ'
  },
  'Africa': {
    'Cairo': 'EG',
    'Lagos': 'NG',
    'Johannesburg': 'ZA',
    'Nairobi': 'KE',
    'Casablanca': 'MA'
  }
};

// Function to get country code from city and region
const getCountryCode = (region, city) => {
  // Remove any underscores from city name for matching
  const formattedCity = city.replace(' ', '_');
  
  // Check if there's a direct mapping for this region and city
  if (regionToCountry[region] && regionToCountry[region][formattedCity]) {
    return regionToCountry[region][formattedCity];
  }
  
  // Some fallbacks for major regions
  if (region === 'US') return 'US';
  if (region === 'GB') return 'GB';
  if (region === 'CA') return 'CA';
  if (region === 'AU') return 'AU';
  
  // Default return empty if no mapping found
  return '';
};

// Function to render a flag emoji from a country code
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  
  // Convert country code to flag emoji (works by using regional indicator symbols)
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
};

export default function Home() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTimezones, setAvailableTimezones] = useState([]);
  const [viewMode, setViewMode] = useState('comparison'); // Default to comparison view
  
  // Load available timezones on initial load
  useEffect(() => {
    async function loadTimezones() {
      try {
        const timezones = await getAllTimezones();
        setAvailableTimezones(timezones);
      } catch (err) {
        console.error("Failed to load available timezones:", err);
      }
    }
    
    loadTimezones();
  }, []);
  
  // Add a useEffect to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update the time display
      setCities(prevCities => [...prevCities]);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  async function addCity(cityName) {
    // Reset error state
    setError(null);
    
    // Check if the city is already added
    const normalizedCityName = cityName.toLowerCase().trim();
    const cityExists = cities.some(city => city.name.toLowerCase() === normalizedCityName);
    
    if (cityExists) {
      setError(`${cityName} is already in your list`);
      return;
    }
    
    setLoading(true);
    
    try {
      // Get timezone data for the city
      const timezoneData = await getTimezones(cityName);
      
      // Get weather data using the coordinates
      const weatherData = await getWeather(
        timezoneData.latitude, 
        timezoneData.longitude
      );
      
      // Add the new city to the list
      setCities(prev => [
        ...prev, 
        { 
          name: cityName, 
          timezone: timezoneData, 
          weather: weatherData 
        }
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  // Function to remove a city from the list
  function removeCity(index, newCities) {
    // Special case for reordering: if newCities array is provided, use it to replace current cities
    if (newCities) {
      setCities(newCities);
      return;
    }
    
    // Standard case: remove the city at the given index
    setCities(prev => prev.filter((_, i) => i !== index));
  }
  
  // Function to render compact city cards with time and weather
  function renderCompactCityCards() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {cities.map((city, index) => (
          <CityTimeWeatherCard key={index} city={city} onRemove={() => removeCity(index)} />
        ))}
      </div>
    );
  }
  
  // Compact City Card component with time and weather
  function CityTimeWeatherCard({ city, onRemove }) {
    if (!city || !city.timezone) return null;
    
    const handleCardClick = (e) => {
      // Prevent event propagation
      e.stopPropagation();
    };
    
    const handleRemoveClick = (e) => {
      e.stopPropagation();
      onRemove();
    };
    
    const localTime = dayjs().tz(city.timezone.timezone);
    const timezonePath = city.timezone.timezone.split('/');
    const region = timezonePath[0];
    const location = timezonePath[timezonePath.length - 1].replace('_', ' ');
    
    // Get country code and flag emoji
    const countryCode = getCountryCode(region, location);
    const flagEmoji = getFlagEmoji(countryCode);
    
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
        className="p-5 border rounded-xl shadow-md bg-white relative group hover:shadow-lg transition-all duration-300 overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Background gradient for visual appeal */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-bl-3xl opacity-50 -z-10"></div>
        
        <button
          onClick={handleRemoveClick}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label={`Remove ${city.name}`}
        >
          <FaTimes />
        </button>
        
        <div className="flex items-center mb-3">
          <span className="text-3xl mr-2" aria-hidden="true">{flagEmoji}</span>
          <h3 className="font-bold text-xl">{city.name}</h3>
        </div>
        
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
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Head>
        <title>World Time & Weather | Compare Time Zones & Weather Globally</title>
        <meta name="description" content="Compare time zones, schedule international meetings, and check weather conditions worldwide. Perfect for remote teams and global collaboration." />
        <meta name="keywords" content="world time converter, timezone calculator, international meeting planner, global weather, time comparison, best time for meetings" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="World Time & Weather | Compare Time Zones & Weather Globally" />
        <meta property="og:description" content="Compare time zones, schedule international meetings, and check weather conditions worldwide. Perfect for remote teams and global collaboration." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://worldtimeweather.com" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="World Time & Weather | Compare Time Zones & Weather Globally" />
        <meta name="twitter:description" content="Compare time zones, schedule international meetings, and check weather conditions worldwide." />
        <meta name="twitter:image" content="/og-image.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://worldtimeweather.com" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "World Time & Weather",
              "description": "Compare time zones, schedule international meetings, and check weather conditions worldwide.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Time zone comparison",
                "Weather information",
                "Meeting scheduler",
                "Remote work tools"
              ]
            })
          }}
        />
      </Head>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            World Time & Weather
          </h1>
          <p className="text-xl text-gray-600">
            Compare times and weather across different cities around the world
          </p>
        </div>

        {/* City Search */}
        <CitySelector onSelect={addCity} />

        {/* View Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('comparison')}
                className={`px-6 py-3 text-sm font-medium rounded-l-lg border transition-all duration-200 ${
                  viewMode === 'comparison' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                Time Comparison
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
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

        {/* Time Display / Weather Overview (Toggle between them) */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {viewMode === 'comparison' ? 'Time Comparison' : 'Weather Overview'}
          </h2>
          {viewMode === 'comparison' ? (
            <TimeComparisonGrid 
              cities={cities} 
              onRemove={removeCity}
            />
          ) : (
            renderCompactCityCards()
          )}
        </div>

        {/* Sharing Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your World Times</h2>
          <SharingOptions cities={cities} />
        </div>

        {/* Meeting Scheduler */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule a Meeting</h2>
          <MeetingScheduler cities={cities} />
        </div>

        {/* Work From Home Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Remote Work Tools</h2>
          <WorkFromHome cities={cities} />
        </div>

        {/* FAQ Section */}
        <FAQ />
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        © {new Date().getFullYear()} World Time & Weather. All rights reserved.
      </footer>
    </div>
  );
} 