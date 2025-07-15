import { 
  FaTemperatureHigh, 
  FaWater, 
  FaCloudRain, 
  FaWind, 
  FaSun, 
  FaSnowflake, 
  FaCloud
} from 'react-icons/fa';

export default function Weather({ city }) {
  if (!city || !city.weather) {
    return null;
  }
  
  // Get current hour and weather data
  const currentHour = new Date().getHours();
  const hourly = city.weather.hourly || {};
  const daily = city.weather.daily || {};
  const currentWeather = city.weather.current_weather || {};
  
  // Extract weather data
  const temperature = hourly.temperature_2m || [];
  const humidity = hourly.relative_humidity_2m || [];
  const precipitation = hourly.precipitation || [];
  const windspeed = hourly.windspeed_10m || [];
  const weathercode = hourly.weathercode || [];
  
  // Safe index to avoid out of bounds
  const safeIndex = Math.min(currentHour, temperature.length - 1);
  
  // Get min/max temps from daily data if available
  const minTemp = daily.temperature_2m_min ? daily.temperature_2m_min[0] : null;
  const maxTemp = daily.temperature_2m_max ? daily.temperature_2m_max[0] : null;
  
  // Weather icon based on WMO weather code
  // See: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
  const getWeatherIcon = (code) => {
    if (!code && code !== 0) return <FaCloud />;
    
    // Clear
    if (code < 3) return <FaSun className="text-yellow-500" />;
    // Cloudy
    if (code < 50) return <FaCloud className="text-gray-500" />;
    // Rain
    if (code < 70) return <FaCloudRain className="text-blue-500" />;
    // Snow
    if (code < 90) return <FaSnowflake className="text-blue-300" />;
    // Thunderstorm
    return <FaCloudRain className="text-purple-500" />;
  };
  
  const currentIcon = getWeatherIcon(
    weathercode[safeIndex] !== undefined 
      ? weathercode[safeIndex] 
      : currentWeather.weathercode
  );
  
  return (
    <div className="p-4 border rounded shadow-sm bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{city.name} Weather</h3>
        <div className="text-3xl">
          {currentIcon}
        </div>
      </div>
      
      {/* Current temperature display */}
      <div className="text-center mb-4">
        <span className="text-3xl font-bold">
          {temperature[safeIndex] !== undefined 
            ? `${temperature[safeIndex]}°C` 
            : (currentWeather.temperature ? `${currentWeather.temperature}°C` : 'N/A')}
        </span>
        
        {minTemp !== null && maxTemp !== null && (
          <div className="text-sm text-gray-500 mt-1">
            <span>L: {minTemp}°C</span>
            <span className="mx-2">|</span>
            <span>H: {maxTemp}°C</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center">
          <FaTemperatureHigh className="text-red-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p>{temperature[safeIndex] !== undefined ? `${temperature[safeIndex]}°C` : 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FaWater className="text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p>{humidity[safeIndex] !== undefined ? `${humidity[safeIndex]}%` : 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FaCloudRain className="text-gray-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Precipitation</p>
            <p>{precipitation[safeIndex] !== undefined ? `${precipitation[safeIndex]} mm` : 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FaWind className="text-teal-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Wind</p>
            <p>{windspeed[safeIndex] !== undefined ? `${windspeed[safeIndex]} km/h` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 