import axios from 'axios';

// Mapping of common city names to their timezones
const cityToTimezone = {
  'london': 'Europe/London',
  'new york': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  'paris': 'Europe/Paris',
  'tokyo': 'Asia/Tokyo',
  'sydney': 'Australia/Sydney',
  'beijing': 'Asia/Shanghai',
  'dubai': 'Asia/Dubai',
  'moscow': 'Europe/Moscow',
  'lisbon': 'Europe/Lisbon',
  'madrid': 'Europe/Madrid',
  'berlin': 'Europe/Berlin',
  'rome': 'Europe/Rome',
  'toronto': 'America/Toronto',
  'chicago': 'America/Chicago',
  'mexico city': 'America/Mexico_City',
  'singapore': 'Asia/Singapore',
  'hong kong': 'Asia/Hong_Kong',
  'istanbul': 'Europe/Istanbul',
  'rio de janeiro': 'America/Sao_Paulo',
  'johannesburg': 'Africa/Johannesburg',
  'cairo': 'Africa/Cairo',
  'bangkok': 'Asia/Bangkok',
  'seoul': 'Asia/Seoul',
  'amsterdam': 'Europe/Amsterdam',
  'sao paulo': 'America/Sao_Paulo',
  'san francisco': 'America/Los_Angeles',
  'seattle': 'America/Los_Angeles',
  'miami': 'America/New_York',
  'dallas': 'America/Chicago',
  'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'auckland': 'Pacific/Auckland',
  'vancouver': 'America/Vancouver',
  'montreal': 'America/Montreal',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  'stockholm': 'Europe/Stockholm',
  'helsinki': 'Europe/Helsinki',
  'athens': 'Europe/Athens',
  'vienna': 'Europe/Vienna',
  'budapest': 'Europe/Budapest',
  'warsaw': 'Europe/Warsaw',
  'brussels': 'Europe/Brussels',
  'copenhagen': 'Europe/Copenhagen',
  'oslo': 'Europe/Oslo',
  'zurich': 'Europe/Zurich',
  'geneva': 'Europe/Zurich',
  'dublin': 'Europe/Dublin',
  'prague': 'Europe/Prague',
  'melbourne': 'Australia/Melbourne',
  'brisbane': 'Australia/Brisbane',
  'perth': 'Australia/Perth',
  'shanghai': 'Asia/Shanghai',
  'kuala lumpur': 'Asia/Kuala_Lumpur',
  'jakarta': 'Asia/Jakarta',
  'manila': 'Asia/Manila',
  'taipei': 'Asia/Taipei',
  'doha': 'Asia/Qatar',
  'kuwait': 'Asia/Kuwait',
  'riyadh': 'Asia/Riyadh',
  'casablanca': 'Africa/Casablanca',
  'lagos': 'Africa/Lagos',
  'nairobi': 'Africa/Nairobi',
  'denver': 'America/Denver',
  'phoenix': 'America/Phoenix',
  'houston': 'America/Chicago',
  'austin': 'America/Chicago',
  'boston': 'America/New_York',
  'washington': 'America/New_York',
  'atlanta': 'America/New_York',
  'detroit': 'America/Detroit',
  'minneapolis': 'America/Chicago',
  'salt lake city': 'America/Denver',
  'honolulu': 'Pacific/Honolulu',
  'anchorage': 'America/Anchorage',
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
  const normalizedCity = city.toLowerCase().trim();
  
  // First check our mapping
  if (cityToTimezone[normalizedCity]) {
    return cityToTimezone[normalizedCity];
  }
  
  // If not found in mapping, try a more generic approach
  // This is a fallback that might work for some cities
  for (const region of ['Europe', 'America', 'Asia', 'Africa', 'Australia', 'Pacific']) {
    const possibleTimezone = `${region}/${city.charAt(0).toUpperCase() + city.slice(1)}`;
    return possibleTimezone; // Return our best guess
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