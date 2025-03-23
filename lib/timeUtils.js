import moment from 'moment-timezone';
import axios from 'axios';
import { cityDatabase, formatCityName, getCountryForCity } from './cityDatabase';

// Get all available timezones from Moment.js
export const getAllTimezones = () => {
  return moment.tz.names();
};

// Precompute timezone data for common cities
const precomputedTimezones = new Map();

// Initialize precomputed data
function initializePrecomputedData() {
  Object.entries(cityMappings).forEach(([city, timezone]) => {
    if (moment.tz.zone(timezone)) {
      const now = moment.tz(timezone);
      precomputedTimezones.set(city, {
        timezone,
        datetime: now.format(),
        utc_offset: now.format('Z'),
        abbreviation: now.format('z')
      });
    }
  });
}

// Initialize on module load
initializePrecomputedData();

// Get timezone data for a specific city
export const getTimezoneData = async (cityName) => {
  try {
    // First, check if we have precomputed data
    const cityKey = cityName.split(',')[0].toLowerCase().trim();
    const precomputed = precomputedTimezones.get(cityKey);
    
    if (precomputed) {
      const coordinates = getCityCoordinates(cityName, precomputed.timezone);
      return {
        ...precomputed,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };
    }

    // If not precomputed, find the timezone
    const timezone = findTimezoneForCity(cityName);
    if (!timezone) {
      throw new Error(`Could not find timezone for ${cityName}`);
    }

    // Get coordinates
    const coordinates = getCityCoordinates(cityName, timezone);

    // Create timezone data
    const now = moment.tz(timezone);
    const timezoneData = {
      timezone,
      datetime: now.format(),
      utc_offset: now.format('Z'),
      abbreviation: now.format('z'),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    };

    // Cache for future use
    precomputedTimezones.set(cityKey, timezoneData);

    return timezoneData;
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

// Cache timezone lookups with a Map for O(1) access
const timezoneCache = new Map();

// Precompute normalized city names
const normalizedCityMappings = new Map(
  Object.entries(cityMappings).map(([city, timezone]) => [
    city.toLowerCase().replace(/[^a-z]/g, ''),
    timezone
  ])
);

// Find timezone for a city using optimized lookup
export const findTimezoneForCity = (cityName) => {
  if (!cityName) return null;

  // Check cache first - O(1)
  if (timezoneCache.has(cityName)) {
    return timezoneCache.get(cityName);
  }

  // Normalize city name for comparison
  const [cityPart] = cityName.split(',');
  const normalizedCity = cityPart.toLowerCase().replace(/[^a-z]/g, '');

  // Check normalized mappings - O(1)
  const timezone = normalizedCityMappings.get(normalizedCity);
  if (timezone && moment.tz.zone(timezone)) {
    timezoneCache.set(cityName, timezone);
    return timezone;
  }

  // Fallback to slower lookup methods only if necessary
  const result = findTimezoneByCountry(cityName) || findTimezoneByRegion(cityName);
  if (result) {
    timezoneCache.set(cityName, result);
    return result;
  }

  return null;
};

// Helper function for country-based lookup
const findTimezoneByCountry = (cityName) => {
  const [, countryPart] = cityName.split(',').map(part => part.trim().toLowerCase());
  if (!countryPart) return null;

  const countryTimezone = getTimezoneByCountry(countryPart);
  return countryTimezone && moment.tz.zone(countryTimezone) ? countryTimezone : null;
};

// Helper function for region-based lookup
const findTimezoneByRegion = (cityName) => {
  const [cityPart] = cityName.split(',').map(part => part.trim().toLowerCase());
  const regions = ['America', 'Europe', 'Asia', 'Africa', 'Australia', 'Pacific'];
  
  for (const region of regions) {
    const possibleTimezone = `${region}/${cityPart.charAt(0).toUpperCase()}${cityPart.slice(1).replace(/\s+/g, '_')}`;
    if (moment.tz.zone(possibleTimezone)) {
      return possibleTimezone;
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