import axios from 'axios';

// Mapping of cities with proper formatting and country information
export const cityToTimezone = {
  'London, UK': 'Europe/London',
  'New York, USA': 'America/New_York',
  'Los Angeles, USA': 'America/Los_Angeles',
  'Paris, France': 'Europe/Paris',
  'Tokyo, Japan': 'Asia/Tokyo',
  'Sydney, Australia': 'Australia/Sydney',
  'Beijing, China': 'Asia/Shanghai',
  'Dubai, UAE': 'Asia/Dubai',
  'Moscow, Russia': 'Europe/Moscow',
  'Lisbon, Portugal': 'Europe/Lisbon',
  'Madrid, Spain': 'Europe/Madrid',
  'Berlin, Germany': 'Europe/Berlin',
  'Rome, Italy': 'Europe/Rome',
  'Toronto, Canada': 'America/Toronto',
  'Chicago, USA': 'America/Chicago',
  'Mexico City, Mexico': 'America/Mexico_City',
  'Singapore, Singapore': 'Asia/Singapore',
  'Hong Kong, China': 'Asia/Hong_Kong',
  'Istanbul, Turkey': 'Europe/Istanbul',
  'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
  'Johannesburg, South Africa': 'Africa/Johannesburg',
  'Cairo, Egypt': 'Africa/Cairo',
  'Bangkok, Thailand': 'Asia/Bangkok',
  'Seoul, South Korea': 'Asia/Seoul',
  'Amsterdam, Netherlands': 'Europe/Amsterdam',
  'São Paulo, Brazil': 'America/Sao_Paulo',
  'San Francisco, USA': 'America/Los_Angeles',
  'Seattle, USA': 'America/Los_Angeles',
  'Miami, USA': 'America/New_York',
  'Dallas, USA': 'America/Chicago',
  'Mumbai, India': 'Asia/Kolkata',
  'Delhi, India': 'Asia/Kolkata',
  'Auckland, New Zealand': 'Pacific/Auckland',
  'Vancouver, Canada': 'America/Vancouver',
  'Montreal, Canada': 'America/Montreal',
  'Buenos Aires, Argentina': 'America/Argentina/Buenos_Aires',
  'Stockholm, Sweden': 'Europe/Stockholm',
  'Helsinki, Finland': 'Europe/Helsinki',
  'Athens, Greece': 'Europe/Athens',
  'Vienna, Austria': 'Europe/Vienna',
  'Budapest, Hungary': 'Europe/Budapest',
  'Warsaw, Poland': 'Europe/Warsaw',
  'Brussels, Belgium': 'Europe/Brussels',
  'Copenhagen, Denmark': 'Europe/Copenhagen',
  'Oslo, Norway': 'Europe/Oslo',
  'Zurich, Switzerland': 'Europe/Zurich',
  'Geneva, Switzerland': 'Europe/Zurich',
  'Dublin, Ireland': 'Europe/Dublin',
  'Prague, Czech Republic': 'Europe/Prague',
  'Melbourne, Australia': 'Australia/Melbourne',
  'Brisbane, Australia': 'Australia/Brisbane',
  'Perth, Australia': 'Australia/Perth',
  'Shanghai, China': 'Asia/Shanghai',
  'Kuala Lumpur, Malaysia': 'Asia/Kuala_Lumpur',
  'Jakarta, Indonesia': 'Asia/Jakarta',
  'Manila, Philippines': 'Asia/Manila',
  'Taipei, Taiwan': 'Asia/Taipei',
  'Doha, Qatar': 'Asia/Qatar',
  'Kuwait City, Kuwait': 'Asia/Kuwait',
  'Riyadh, Saudi Arabia': 'Asia/Riyadh',
  'Casablanca, Morocco': 'Africa/Casablanca',
  'Lagos, Nigeria': 'Africa/Lagos',
  'Nairobi, Kenya': 'Africa/Nairobi',
  'Denver, USA': 'America/Denver',
  'Phoenix, USA': 'America/Phoenix',
  'Houston, USA': 'America/Chicago',
  'Austin, USA': 'America/Chicago',
  'Boston, USA': 'America/New_York',
  'Washington DC, USA': 'America/New_York',
  'Atlanta, USA': 'America/New_York',
  'Detroit, USA': 'America/Detroit',
  'Minneapolis, USA': 'America/Chicago',
  'Salt Lake City, USA': 'America/Denver',
  'Honolulu, USA': 'Pacific/Honolulu',
  'Anchorage, USA': 'America/Anchorage'
};

// Function to get a list of all available timezones
export async function getAllTimezones() {
  try {
    const response = await axios.get('https://worldtimeapi.org/api/timezone');
    return response.data;
  } catch (error) {
    console.error("Error fetching all timezones:", error);
    throw error;
  }
}

// Function to find the best timezone for a city
function findTimezoneForCity(city) {
  // Handle the case where the city includes country information
  const normalizedCity = city.split(',')[0].toLowerCase().trim();
  
  // Look for an exact match in our cityToTimezone object
  const exactMatch = Object.entries(cityToTimezone).find(([key]) => 
    key.toLowerCase().startsWith(normalizedCity)
  );
  
  if (exactMatch) {
    return exactMatch[1];
  }
  
  // If not found in mapping, try a more generic approach
  // This is a fallback that might work for some cities
  for (const region of ['Europe', 'America', 'Asia', 'Africa', 'Australia', 'Pacific']) {
    const possibleTimezone = `${region}/${normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1).replace(/\s+/g, '_')}`;
    // Check if this timezone exists in our mapping values
    if (Object.values(cityToTimezone).includes(possibleTimezone)) {
      return possibleTimezone;
    }
  }
  
  // If all else fails, return a default timezone
  return 'UTC';
}

export async function getTimezones(city) {
  try {
    // Find the best timezone identifier for this city
    const timezoneIdentifier = findTimezoneForCity(city);
    
    // Fetch the timezone data
    const response = await axios.get(`https://worldtimeapi.org/api/timezone/${timezoneIdentifier}`);
    
    // Add latitude and longitude approximation for weather
    // These are very rough approximations based on the timezone
    const locationData = getApproximateLocation(city, timezoneIdentifier);
    
    return {
      ...response.data,
      timezone: timezoneIdentifier,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    };
  } catch (error) {
    console.error(`Error fetching timezone data for ${city}:`, error);
    throw new Error(`Could not find timezone data for ${city}. Try another city name.`);
  }
}

// Function to get approximate latitude and longitude for a city
function getApproximateLocation(city, timezone) {
  // Default to central points for regions if city not found
  const defaults = {
    'Europe': { latitude: 48.8566, longitude: 2.3522 }, // Paris
    'America': { latitude: 40.7128, longitude: -74.0060 }, // New York
    'Asia': { latitude: 35.6762, longitude: 139.6503 }, // Tokyo
    'Africa': { latitude: 30.0444, longitude: 31.2357 }, // Cairo
    'Australia': { latitude: -33.8688, longitude: 151.2093 }, // Sydney
    'Pacific': { latitude: -36.8485, longitude: 174.7633 }, // Auckland
  };
  
  // City coordinate mappings for common cities
  const cityCoordinates = {
    'london': { latitude: 51.5074, longitude: -0.1278 },
    'new york': { latitude: 40.7128, longitude: -74.0060 },
    'los angeles': { latitude: 34.0522, longitude: -118.2437 },
    'paris': { latitude: 48.8566, longitude: 2.3522 },
    'tokyo': { latitude: 35.6762, longitude: 139.6503 },
    'sydney': { latitude: -33.8688, longitude: 151.2093 },
    'beijing': { latitude: 39.9042, longitude: 116.4074 },
    'dubai': { latitude: 25.2048, longitude: 55.2708 },
    'moscow': { latitude: 55.7558, longitude: 37.6173 },
    'lisbon': { latitude: 38.7223, longitude: -9.1393 },
    'madrid': { latitude: 40.4168, longitude: -3.7038 },
    'berlin': { latitude: 52.5200, longitude: 13.4050 },
    'rome': { latitude: 41.9028, longitude: 12.4964 },
    'toronto': { latitude: 43.6532, longitude: -79.3832 },
    'chicago': { latitude: 41.8781, longitude: -87.6298 },
    'mexico city': { latitude: 19.4326, longitude: -99.1332 },
    'singapore': { latitude: 1.3521, longitude: 103.8198 },
    'hong kong': { latitude: 22.3193, longitude: 114.1694 },
    'istanbul': { latitude: 41.0082, longitude: 28.9784 },
    'rio de janeiro': { latitude: -22.9068, longitude: -43.1729 },
    'johannesburg': { latitude: -26.2041, longitude: 28.0473 },
    'cairo': { latitude: 30.0444, longitude: 31.2357 },
    'bangkok': { latitude: 13.7563, longitude: 100.5018 },
    'seoul': { latitude: 37.5665, longitude: 126.9780 },
    'amsterdam': { latitude: 52.3676, longitude: 4.9041 },
    'sao paulo': { latitude: -23.5505, longitude: -46.6333 },
  };
  
  const normalizedCity = city.toLowerCase().trim();
  
  // Check if we have coordinates for this city
  if (cityCoordinates[normalizedCity]) {
    return cityCoordinates[normalizedCity];
  }
  
  // Extract region from timezone (e.g., "Europe/London" -> "Europe")
  const region = timezone.split('/')[0];
  
  // Return default coordinates for the region
  return defaults[region] || { latitude: 0, longitude: 0 };
} 