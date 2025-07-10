import moment from 'moment-timezone';

export default function WeatherCard({ city, weather, timezone, onDelete }) {
  const [region, cityName] = timezone.split('/');
  const formattedCity = cityName.replace(/_/g, ' ');

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      <button
        onClick={() => onDelete(city)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
      <div className="mb-2">
        <h3 className="text-lg font-semibold">{formattedCity}</h3>
      </div>
      {weather ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{Math.round(weather.temp)}°C</p>
              <p className="text-gray-600 capitalize">{weather.description}</p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {Math.round(weather.wind)} m/s</p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Loading weather data...</p>
        </div>
      )}
    </div>
  );
} 