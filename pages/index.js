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

// Map of country names to ISO country codes for flag determination
const countryToCode = {
  'Afghanistan': 'AF',
  'Albania': 'AL',
  'Algeria': 'DZ',
  'American Samoa': 'AS',
  'Andorra': 'AD',
  'Angola': 'AO',
  'Anguilla': 'AI',
  'Antarctica': 'AQ',
  'Antigua and Barbuda': 'AG',
  'Argentina': 'AR',
  'Armenia': 'AM',
  'Aruba': 'AW',
  'Australia': 'AU',
  'Austria': 'AT',
  'Azerbaijan': 'AZ',
  'Bahamas': 'BS',
  'Bahrain': 'BH',
  'Bangladesh': 'BD',
  'Barbados': 'BB',
  'Belarus': 'BY',
  'Belgium': 'BE',
  'Belize': 'BZ',
  'Benin': 'BJ',
  'Bermuda': 'BM',
  'Bhutan': 'BT',
  'Bolivia': 'BO',
  'Bosnia and Herzegovina': 'BA',
  'Botswana': 'BW',
  'Brazil': 'BR',
  'British Indian Ocean Territory': 'IO',
  'British Virgin Islands': 'VG',
  'Brunei': 'BN',
  'Bulgaria': 'BG',
  'Burkina Faso': 'BF',
  'Burundi': 'BI',
  'Cambodia': 'KH',
  'Cameroon': 'CM',
  'Canada': 'CA',
  'Cape Verde': 'CV',
  'Cayman Islands': 'KY',
  'Central African Republic': 'CF',
  'Chad': 'TD',
  'Chile': 'CL',
  'China': 'CN',
  'Christmas Island': 'CX',
  'Cocos (Keeling) Islands': 'CC',
  'Colombia': 'CO',
  'Comoros': 'KM',
  'Congo': 'CG',
  'Republic of Congo': 'CG',
  'Democratic Republic of the Congo': 'CD',
  'Cook Islands': 'CK',
  'Costa Rica': 'CR',
  'Croatia': 'HR',
  'Cuba': 'CU',
  'Curaçao': 'CW',
  'Cyprus': 'CY',
  'Czech Republic': 'CZ',
  'Denmark': 'DK',
  'Djibouti': 'DJ',
  'Dominica': 'DM',
  'Dominican Republic': 'DO',
  'East Timor': 'TL',
  'Ecuador': 'EC',
  'Egypt': 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  'Eritrea': 'ER',
  'Estonia': 'EE',
  'Eswatini': 'SZ',
  'Ethiopia': 'ET',
  'Falkland Islands': 'FK',
  'Faroe Islands': 'FO',
  'Fiji': 'FJ',
  'Finland': 'FI',
  'France': 'FR',
  'French Guiana': 'GF',
  'French Polynesia': 'PF',
  'French Southern Territories': 'TF',
  'Gabon': 'GA',
  'Gambia': 'GM',
  'Georgia': 'GE',
  'Germany': 'DE',
  'Ghana': 'GH',
  'Gibraltar': 'GI',
  'Greece': 'GR',
  'Greenland': 'GL',
  'Grenada': 'GD',
  'Guadeloupe': 'GP',
  'Guam': 'GU',
  'Guatemala': 'GT',
  'Guernsey': 'GG',
  'Guinea': 'GN',
  'Guinea-Bissau': 'GW',
  'Guyana': 'GY',
  'Haiti': 'HT',
  'Honduras': 'HN',
  'Hong Kong': 'HK',
  'Hungary': 'HU',
  'Iceland': 'IS',
  'India': 'IN',
  'Indonesia': 'ID',
  'Iran': 'IR',
  'Iraq': 'IQ',
  'Ireland': 'IE',
  'Isle of Man': 'IM',
  'Israel': 'IL',
  'Italy': 'IT',
  'Ivory Coast': 'CI',
  'Jamaica': 'JM',
  'Japan': 'JP',
  'Jersey': 'JE',
  'Jordan': 'JO',
  'Kazakhstan': 'KZ',
  'Kenya': 'KE',
  'Kiribati': 'KI',
  'Kosovo': 'XK',
  'Kuwait': 'KW',
  'Kyrgyzstan': 'KG',
  'Laos': 'LA',
  'Latvia': 'LV',
  'Lebanon': 'LB',
  'Lesotho': 'LS',
  'Liberia': 'LR',
  'Libya': 'LY',
  'Liechtenstein': 'LI',
  'Lithuania': 'LT',
  'Luxembourg': 'LU',
  'Macau': 'MO',
  'Madagascar': 'MG',
  'Malawi': 'MW',
  'Malaysia': 'MY',
  'Maldives': 'MV',
  'Mali': 'ML',
  'Malta': 'MT',
  'Marshall Islands': 'MH',
  'Martinique': 'MQ',
  'Mauritania': 'MR',
  'Mauritius': 'MU',
  'Mayotte': 'YT',
  'Mexico': 'MX',
  'Micronesia': 'FM',
  'Moldova': 'MD',
  'Monaco': 'MC',
  'Mongolia': 'MN',
  'Montenegro': 'ME',
  'Montserrat': 'MS',
  'Morocco': 'MA',
  'Mozambique': 'MZ',
  'Myanmar': 'MM',
  'Namibia': 'NA',
  'Nauru': 'NR',
  'Nepal': 'NP',
  'Netherlands': 'NL',
  'New Caledonia': 'NC',
  'New Zealand': 'NZ',
  'Nicaragua': 'NI',
  'Niger': 'NE',
  'Nigeria': 'NG',
  'Niue': 'NU',
  'Norfolk Island': 'NF',
  'North Korea': 'KP',
  'North Macedonia': 'MK',
  'Northern Mariana Islands': 'MP',
  'Norway': 'NO',
  'Oman': 'OM',
  'Pakistan': 'PK',
  'Palau': 'PW',
  'Palestine': 'PS',
  'Panama': 'PA',
  'Papua New Guinea': 'PG',
  'Paraguay': 'PY',
  'Peru': 'PE',
  'Philippines': 'PH',
  'Pitcairn Islands': 'PN',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Puerto Rico': 'PR',
  'Qatar': 'QA',
  'Réunion': 'RE',
  'Romania': 'RO',
  'Russia': 'RU',
  'Rwanda': 'RW',
  'Saint Barthélemy': 'BL',
  'Saint Helena': 'SH',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Martin': 'MF',
  'Saint Pierre and Miquelon': 'PM',
  'Saint Vincent and the Grenadines': 'VC',
  'Samoa': 'WS',
  'San Marino': 'SM',
  'São Tomé and Príncipe': 'ST',
  'Saudi Arabia': 'SA',
  'Senegal': 'SN',
  'Serbia': 'RS',
  'Seychelles': 'SC',
  'Sierra Leone': 'SL',
  'Singapore': 'SG',
  'Sint Maarten': 'SX',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'Solomon Islands': 'SB',
  'Somalia': 'SO',
  'South Africa': 'ZA',
  'South Georgia': 'GS',
  'South Korea': 'KR',
  'South Sudan': 'SS',
  'Spain': 'ES',
  'Sri Lanka': 'LK',
  'Sudan': 'SD',
  'Suriname': 'SR',
  'Svalbard and Jan Mayen': 'SJ',
  'Sweden': 'SE',
  'Switzerland': 'CH',
  'Syria': 'SY',
  'Taiwan': 'TW',
  'Tajikistan': 'TJ',
  'Tanzania': 'TZ',
  'Thailand': 'TH',
  'Timor-Leste': 'TL',
  'Togo': 'TG',
  'Tokelau': 'TK',
  'Tonga': 'TO',
  'Trinidad and Tobago': 'TT',
  'Tunisia': 'TN',
  'Turkey': 'TR',
  'Turkmenistan': 'TM',
  'Turks and Caicos Islands': 'TC',
  'Tuvalu': 'TV',
  'UAE': 'AE',
  'Uganda': 'UG',
  'UK': 'GB',
  'Ukraine': 'UA',
  'United Arab Emirates': 'AE',
  'USA': 'US',
  'Uruguay': 'UY',
  'U.S. Virgin Islands': 'VI',
  'Uzbekistan': 'UZ',
  'Vanuatu': 'VU',
  'Vatican City': 'VA',
  'Venezuela': 'VE',
  'Vietnam': 'VN',
  'Wallis and Futuna': 'WF',
  'Western Sahara': 'EH',
  'Yemen': 'YE',
  'Zambia': 'ZM',
  'Zimbabwe': 'ZW'
};

// Function to get country code from city and region
const getCountryCode = (region, city) => {
  // Remove any underscores from city name for matching
  const formattedCity = city.replace(/_/g, ' ');
  
  // Get the country from the city's timezone data
  const timezone = `${region}/${formattedCity}`;
  const cityData = moment.tz.zone(timezone);
  
  if (cityData) {
    // Get the country from the timezone name
    const country = cityData.countries[0];
    return countryToCode[country] || '';
  }
  
  // Fallback: try to determine country from region
  if (region === 'America') return 'US';
  if (region === 'Europe') return 'EU';
  if (region === 'Asia') return 'AS';
  if (region === 'Africa') return 'AF';
  if (region === 'Australia') return 'AU';
  if (region === 'Pacific') return 'OC';
  
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
  const [viewMode, setViewMode] = useState('cards');
  
  // Handle view mode changes
  const handleViewModeChange = (mode) => {
    if (mode === 'comparison' && cities.length === 0) {
      // Don't switch to comparison if no cities
      return;
    }
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  // Load saved view mode on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode && (savedViewMode === 'cards' || (savedViewMode === 'comparison' && cities.length > 0))) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Reset to cards view when all cities are removed
  useEffect(() => {
    if (cities.length === 0 && viewMode === 'comparison') {
      setViewMode('cards');
      localStorage.setItem('viewMode', 'cards');
    }
  }, [cities.length]);
  
  // Load available timezones on initial load
  useEffect(() => {
    async function loadTimezones() {
      try {
        const timezones = getAllTimezones();
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
    
    // Extract just the city name for comparison (without country)
    const normalizedCityName = cityName.split(',')[0].toLowerCase().trim();
    
    // Check if the city is already added
    const cityExists = cities.some(city => {
      const existingCityName = city.name.split(',')[0].toLowerCase().trim();
      return existingCityName === normalizedCityName;
    });
    
    if (cityExists) {
      setError(`${cityName.split(',')[0]} is already in your list`);
      return;
    }
    
    setLoading(true);
    
    try {
      // Get timezone data using the new utility
      const timezoneData = await getTimezoneData(cityName);
      
      // Get weather data using the coordinates
      const weatherData = await getWeather(
        timezoneData.latitude, 
        timezoneData.longitude
      );
      
      // Add the new city to the list
      setCities(prev => [
        ...prev, 
        { 
          name: cityName, // Use the full name including country
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
    
    const handleCardClick = () => {
      handleViewModeChange('comparison');
    };
    
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
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
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

        {/* Time Display / Weather Overview */}
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