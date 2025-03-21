import axios from 'axios';

export async function getWeather(latitude, longitude) {
  try {
    // Round coordinates to 4 decimal places to avoid API errors
    const lat = parseFloat(latitude).toFixed(4);
    const lon = parseFloat(longitude).toFixed(4);
    
    // Get the current date
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
    // Build a more complete URL with better parameters
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&current_weather=true` +
      `&timezone=auto` +
      `&start_date=${formattedDate}&end_date=${formattedDate}`;
    
    const response = await axios.get(url);
    
    // Add some simple error handling for the response
    if (!response.data || response.status !== 200) {
      throw new Error('Unable to retrieve weather data');
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return a more structured error object
    throw new Error(`Weather data unavailable: ${error.message}`);
  }
} 