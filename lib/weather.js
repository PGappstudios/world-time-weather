import axios from 'axios';

// Cache for weather data with 15-minute expiration
const weatherCache = new Map();
const CACHE_EXPIRATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Queue for batching weather requests
let weatherQueue = [];
let queueTimeout = null;
const QUEUE_DELAY = 50; // ms to wait before processing queue

// Process queued weather requests in batch
async function processWeatherQueue() {
  const currentQueue = [...weatherQueue];
  weatherQueue = [];
  queueTimeout = null;

  if (currentQueue.length === 0) return;

  try {
    // Process all requests in parallel
    const results = await Promise.all(
      currentQueue.map(async ({ lat, lon, resolve, reject }) => {
        try {
          const result = await fetchWeatherData(lat, lon);
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          return null;
        }
      })
    );

    // Cache results
    currentQueue.forEach(({ lat, lon }, index) => {
      if (results[index]) {
        const cacheKey = `${lat},${lon}`;
        weatherCache.set(cacheKey, {
          data: results[index],
          timestamp: Date.now()
        });
      }
    });
  } catch (error) {
    console.error('Error processing weather queue:', error);
    currentQueue.forEach(({ reject }) => reject(error));
  }
}

// Actual weather data fetching
async function fetchWeatherData(lat, lon) {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&current_weather=true` +
    `&timezone=auto` +
    `&start_date=${formattedDate}&end_date=${formattedDate}`;
  
  const response = await axios.get(url);
  
  if (!response.data || response.status !== 200) {
    throw new Error('Unable to retrieve weather data');
  }
  
  return response.data;
}

export async function getWeather(latitude, longitude) {
  try {
    // Round coordinates to 4 decimal places
    const lat = parseFloat(latitude).toFixed(4);
    const lon = parseFloat(longitude).toFixed(4);
    
    // Create cache key
    const cacheKey = `${lat},${lon}`;
    
    // Check cache
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
      return cachedData.data;
    }
    
    // Create a promise that will be resolved when the weather data is ready
    return new Promise((resolve, reject) => {
      weatherQueue.push({ lat, lon, resolve, reject });
      
      // Set up queue processing if not already scheduled
      if (!queueTimeout) {
        queueTimeout = setTimeout(processWeatherQueue, QUEUE_DELAY);
      }
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error(`Weather data unavailable: ${error.message}`);
  }
} 