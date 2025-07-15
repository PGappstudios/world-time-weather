import moment from 'moment-timezone';
import axios from 'axios';
import { cityDatabase, formatCityName, getCountryForCity } from './cityDatabase';

// Get all available timezones from Moment.js
export const getAllTimezones = () => {
  return moment.tz.names();
};

// Get timezone data for a specific city
export const getTimezoneData = async (cityName) => {
  try {
    // First, find the timezone for the city
    const timezone = findTimezoneForCity(cityName);
    if (!timezone) {
      throw new Error(`Could not find timezone for ${cityName}`);
    }

    // Get coordinates for the city
    const coordinates = getCityCoordinates(cityName, timezone);

    // Use Moment.js for timezone data instead of making an API call
    const now = moment.tz(timezone);
    return {
      timezone,
      datetime: now.format(),
      utc_offset: now.format('Z'),
      abbreviation: now.format('z'),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    };
  } catch (error) {
    console.error('Error fetching timezone data:', error);
    throw error;
  }
};

// Common timezone mappings
export const cityMappings = {
  // Africa
  'bamako': 'Africa/Bamako',
  'dakar': 'Africa/Dakar',
  'cairo': 'Africa/Cairo',
  'johannesburg': 'Africa/Johannesburg',
  'lagos': 'Africa/Lagos',
  'nairobi': 'Africa/Nairobi',
  'khartoum': 'Africa/Khartoum',
  'kampala': 'Africa/Kampala',
  'addis ababa': 'Africa/Addis_Ababa',
  'casablanca': 'Africa/Casablanca',
  'brazzaville': 'Africa/Brazzaville',
  'kinshasa': 'Africa/Kinshasa',
  'lubumbashi': 'Africa/Lubumbashi',
  'luanda': 'Africa/Luanda',
  'libreville': 'Africa/Libreville',
  'windhoek': 'Africa/Windhoek',
  'maputo': 'Africa/Maputo',
  'gaborone': 'Africa/Gaborone',
  'harare': 'Africa/Harare',
  'lusaka': 'Africa/Lusaka',
  'dar es salaam': 'Africa/Dar_es_Salaam',
  'djibouti': 'Africa/Djibouti',
  'mogadishu': 'Africa/Mogadishu',
  'tripoli': 'Africa/Tripoli',
  'tunis': 'Africa/Tunis',
  'algiers': 'Africa/Algiers',

  // Americas
  'new york': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'toronto': 'America/Toronto',
  'vancouver': 'America/Vancouver',
  'mexico city': 'America/Mexico_City',
  'bogota': 'America/Bogota',
  'sao paulo': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  'santiago': 'America/Santiago',
  'lima': 'America/Lima',
  'caracas': 'America/Caracas',
  'miami': 'America/New_York',
  'dallas': 'America/Chicago',
  'houston': 'America/Chicago',
  'phoenix': 'America/Phoenix',
  'denver': 'America/Denver',
  'san francisco': 'America/Los_Angeles',
  'seattle': 'America/Los_Angeles',
  'montreal': 'America/Montreal',

  // Asia
  'tokyo': 'Asia/Tokyo',
  'singapore': 'Asia/Singapore',
  'hong kong': 'Asia/Hong_Kong',
  'shanghai': 'Asia/Shanghai',
  'beijing': 'Asia/Shanghai',
  'seoul': 'Asia/Seoul',
  'bangkok': 'Asia/Bangkok',
  'manila': 'Asia/Manila',
  'kuala lumpur': 'Asia/Kuala_Lumpur',
  'jakarta': 'Asia/Jakarta',
  'dubai': 'Asia/Dubai',
  'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'karachi': 'Asia/Karachi',
  'dhaka': 'Asia/Dhaka',
  'taipei': 'Asia/Taipei',
  'ho chi minh': 'Asia/Ho_Chi_Minh',
  'yangon': 'Asia/Yangon',
  'riyadh': 'Asia/Riyadh',
  'doha': 'Asia/Qatar',
  'islamabad': 'Asia/Karachi',
  'lahore': 'Asia/Karachi',
  'rawalpindi': 'Asia/Karachi',
  'faisalabad': 'Asia/Karachi',
  'multan': 'Asia/Karachi',
  'peshawar': 'Asia/Karachi',
  'quetta': 'Asia/Karachi',
  'sialkot': 'Asia/Karachi',
  'hyderabad': 'Asia/Karachi',

  // Europe
  'london': 'Europe/London',
  'paris': 'Europe/Paris',
  'berlin': 'Europe/Berlin',
  'rome': 'Europe/Rome',
  'madrid': 'Europe/Madrid',
  'amsterdam': 'Europe/Amsterdam',
  'brussels': 'Europe/Brussels',
  'vienna': 'Europe/Vienna',
  'moscow': 'Europe/Moscow',
  'istanbul': 'Europe/Istanbul',
  'stockholm': 'Europe/Stockholm',
  'oslo': 'Europe/Oslo',
  'copenhagen': 'Europe/Copenhagen',
  'helsinki': 'Europe/Helsinki',
  'warsaw': 'Europe/Warsaw',
  'prague': 'Europe/Prague',
  'budapest': 'Europe/Budapest',
  'zurich': 'Europe/Zurich',
  'dublin': 'Europe/Dublin',
  'lisbon': 'Europe/Lisbon',

  // Oceania
  'sydney': 'Australia/Sydney',
  'melbourne': 'Australia/Melbourne',
  'brisbane': 'Australia/Brisbane',
  'perth': 'Australia/Perth',
  'auckland': 'Pacific/Auckland',
  'wellington': 'Pacific/Auckland',
  'honolulu': 'Pacific/Honolulu'
};

// Search for cities based on input
export const searchCities = (searchTerm) => {
  if (!searchTerm.trim()) {
    return [];
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();
  const validTimezones = moment.tz.names();

  // Get matching cities and countries
  const results = Object.entries(cityDatabase)
    .filter(([city, country]) => {
      const formattedCity = formatCityName(city).toLowerCase();
      const formattedCountry = country.toLowerCase();
      
      // Check if either city or country matches the search term
      const matches = formattedCity.includes(normalizedSearch) || 
                     formattedCountry.includes(normalizedSearch);
      
      if (!matches) return false;

      // Verify the city has a valid timezone
      try {
        const cityWithCountry = `${formatCityName(city)}, ${country}`;
        const timezone = findTimezoneForCity(cityWithCountry);
        
        // Debug logging
        if (!timezone) {
          console.log(`No timezone found for: ${cityWithCountry}`);
        }
        
        return timezone && validTimezones.includes(timezone);
      } catch (error) {
        console.error(`Error checking timezone for ${city}, ${country}:`, error);
        return false;
      }
    })
    .map(([city, country]) => `${formatCityName(city)}, ${country}`);

  // If searching for a country, ensure we return multiple cities
  const isCountrySearch = results.some(result => {
    const [, country] = result.split(',').map(part => part.trim().toLowerCase());
    return country.includes(normalizedSearch);
  });

  if (isCountrySearch) {
    return results.slice(0, 10); // Return up to 10 cities for the country
  }

  return results.slice(0, 10);
};

// Cache for timezone lookups
const timezoneCache = new Map();

// Find timezone for a city using Moment.js zones
export const findTimezoneForCity = (cityName) => {
  if (!cityName) return null;

  // Check cache first
  if (timezoneCache.has(cityName)) {
    return timezoneCache.get(cityName);
  }

  // Extract city name without country
  const [cityPart, countryPart] = cityName.split(',').map(part => part.trim().toLowerCase());
  
  // Try direct mapping first
  if (cityMappings[cityPart]) {
    const timezone = cityMappings[cityPart];
    if (moment.tz.zone(timezone)) {
      timezoneCache.set(cityName, timezone);
      return timezone;
    }
  }

  const zones = moment.tz.names();
  const exactMatch = zones.find(zone => {
    const zoneParts = zone.split('/');
    const zoneCity = zoneParts[zoneParts.length - 1].replace(/_/g, ' ').toLowerCase();
    return zoneCity === cityPart;
  });

  if (exactMatch && moment.tz.zone(exactMatch)) {
    timezoneCache.set(cityName, exactMatch);
    return exactMatch;
  }

  // Try country-based timezone if available
  if (countryPart) {
    const countryTimezone = getTimezoneByCountry(countryPart);
    if (countryTimezone && moment.tz.zone(countryTimezone)) {
      timezoneCache.set(cityName, countryTimezone);
      return countryTimezone;
    }
  }

  return null;
};

// Helper function to get timezone by country
const getTimezoneByCountry = (country) => {
  const countryTimezones = {
    'usa': 'America/New_York',
    'uk': 'Europe/London',
    'france': 'Europe/Paris',
    'germany': 'Europe/Berlin',
    'japan': 'Asia/Tokyo',
    'china': 'Asia/Shanghai',
    'australia': 'Australia/Sydney',
    'india': 'Asia/Kolkata',
    'russia': 'Europe/Moscow',
    'brazil': 'America/Sao_Paulo',
    'canada': 'America/Toronto',
    'mexico': 'America/Mexico_City',
    'spain': 'Europe/Madrid',
    'italy': 'Europe/Rome',
    'netherlands': 'Europe/Amsterdam',
    'singapore': 'Asia/Singapore',
    'south korea': 'Asia/Seoul',
    'thailand': 'Asia/Bangkok',
    'indonesia': 'Asia/Jakarta',
    'malaysia': 'Asia/Kuala_Lumpur',
    'philippines': 'Asia/Manila',
    'vietnam': 'Asia/Ho_Chi_Minh',
    'saudi arabia': 'Asia/Riyadh',
    'uae': 'Asia/Dubai',
    'republic of congo': 'Africa/Brazzaville',
    'congo': 'Africa/Brazzaville',
    'democratic republic of the congo': 'Africa/Kinshasa',
    'dr congo': 'Africa/Kinshasa',
    'pakistan': 'Asia/Karachi',
    'islamic republic of pakistan': 'Asia/Karachi'
  };

  const normalizedCountry = country.toLowerCase().trim();
  return countryTimezones[normalizedCountry] || null;
};

// Get coordinates for a city
const getCityCoordinates = (cityName, timezone) => {
  // Default coordinates for major cities
  const cityCoordinates = {
    'london': { latitude: 51.5074, longitude: -0.1278 },
    'new york': { latitude: 40.7128, longitude: -74.0060 },
    'los angeles': { latitude: 34.0522, longitude: -118.2437 },
    'paris': { latitude: 48.8566, longitude: 2.3522 },
    'tokyo': { latitude: 35.6762, longitude: 139.6503 },
    'sydney': { latitude: -33.8688, longitude: 151.2093 },
    // Add more cities as needed
  };

  const city = cityName.split(',')[0].trim().toLowerCase();
  
  // Return coordinates if we have them
  if (cityCoordinates[city]) {
    return cityCoordinates[city];
  }

  // Default coordinates based on timezone region
  const defaultCoordinates = {
    'America': { latitude: 40.7128, longitude: -74.0060 }, // New York
    'Europe': { latitude: 51.5074, longitude: -0.1278 },   // London
    'Asia': { latitude: 35.6762, longitude: 139.6503 },    // Tokyo
    'Australia': { latitude: -33.8688, longitude: 151.2093 }, // Sydney
    'Africa': { latitude: -26.2041, longitude: 28.0473 },  // Johannesburg
    'Pacific': { latitude: -36.8485, longitude: 174.7633 } // Auckland
  };

  const region = timezone.split('/')[0];
  return defaultCoordinates[region] || { latitude: 0, longitude: 0 };
};

// Helper function to validate if a city has a valid timezone
export const hasValidTimezone = (cityName) => {
  if (!cityName) return false;
  
  // For debugging
  const timezone = findTimezoneForCity(cityName);
  if (!timezone) {
    console.log(`No timezone found for: ${cityName}`);
  }
  
  return timezone !== null;
};

// Helper function to get country when not in the direct mapping
const getCountryFromRegion = (city) => {
  // Default fallback mapping based on region
  const regionCountryMap = {
    'US': 'USA',
    'GB': 'UK',
    'CA': 'Canada',
    'AU': 'Australia',
    'NZ': 'New Zealand'
  };

  return regionCountryMap[city] || 'Unknown';
};

// Function to get country code from city and region
export const getCountryCode = (region, city) => {
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
export const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  
  // Convert country code to flag emoji (works by using regional indicator symbols)
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}; 