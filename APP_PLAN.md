# World Time & Weather App

## Overview
A responsive web application built with Next.js that allows users to check time and weather information across multiple global locations, with convenient meeting scheduling integration.

## Tech Stack
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Data Fetching**: Axios
- **Date/Time Handling**: Day.js
- **UI Components**: Headless UI
- **Icons**: React Icons

## Setup Instructions

### 1. Project Initialization
```bash
# Create Next.js application
npx create-next-app@latest world-time-weather
cd world-time-weather

# Install dependencies
npm install axios dayjs tailwindcss @headlessui/react react-icons
```

### 2. Tailwind CSS Configuration
```bash
# Initialize Tailwind CSS
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Add Tailwind directives to `styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## API Integration

### WorldTime API Service
Create `lib/timezone.js`:
```javascript
import axios from 'axios';

export async function getTimezones(city) {
  try {
    const response = await axios.get(`https://worldtimeapi.org/api/timezone/${city}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching timezone data:", error);
    throw error;
  }
}
```

### Weather API Service (Open-Meteo)
Create `lib/weather.js`:
```javascript
import axios from 'axios';

export async function getWeather(latitude, longitude) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
```

## Component Structure

### City Selector Component
Create `components/CitySelector.js`:
```javascript
import { useState } from 'react';

export default function CitySelector({ onSelect }) {
  const [city, setCity] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSelect(city);
      setCity('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-grow border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
      />
      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow transition-colors"
      >
        Add City
      </button>
    </form>
  );
}
```

### Time Grid Component
Create `components/TimeGrid.js`:
```javascript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimeGrid({ cities }) {
  if (!cities.length) {
    return (
      <div className="text-center p-4 border rounded bg-gray-50">
        <p className="text-gray-500">Add cities to view their local times</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cities.map((city, index) => {
        const localTime = dayjs().tz(city.timezone.timezone);
        
        return (
          <div key={index} className="p-4 border rounded shadow-sm bg-white">
            <h3 className="font-bold text-lg">{city.name}</h3>
            <p className="text-2xl">{localTime.format('HH:mm:ss')}</p>
            <p className="text-sm text-gray-500">{localTime.format('MMMM D, YYYY')}</p>
          </div>
        );
      })}
    </div>
  );
}
```

### Weather Component
Create `components/Weather.js`:
```javascript
import { FaTemperatureHigh, FaWater, FaCloud } from 'react-icons/fa';

export default function Weather({ city }) {
  if (!city || !city.weather) {
    return null;
  }
  
  const { temperature_2m, relative_humidity_2m, precipitation } = city.weather.hourly;
  const currentHour = new Date().getHours();
  
  return (
    <div className="p-4 border rounded shadow-sm bg-white mb-4">
      <h3 className="font-bold text-lg mb-2">{city.name} Weather</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center">
          <FaTemperatureHigh className="text-red-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p>{temperature_2m[currentHour]}°C</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaWater className="text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p>{relative_humidity_2m[currentHour]}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaCloud className="text-gray-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Precipitation</p>
            <p>{precipitation[currentHour]} mm</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Meeting Scheduler Component
Create `components/MeetingScheduler.js`:
```javascript
import { 
  FaGoogle, 
  FaMicrosoft, 
  FaVideo, 
  FaUsers, 
  FaCommentDots 
} from 'react-icons/fa';

export default function MeetingScheduler() {
  const services = [
    { 
      name: 'Google Calendar', 
      url: 'https://calendar.google.com', 
      icon: <FaGoogle />, 
      bgColor: 'bg-green-500 hover:bg-green-600' 
    },
    { 
      name: 'Outlook Calendar', 
      url: 'https://outlook.live.com/calendar/', 
      icon: <FaMicrosoft />, 
      bgColor: 'bg-blue-500 hover:bg-blue-600' 
    },
    { 
      name: 'Zoom', 
      url: 'https://zoom.us/', 
      icon: <FaVideo />, 
      bgColor: 'bg-gray-700 hover:bg-gray-800' 
    },
    { 
      name: 'Microsoft Teams', 
      url: 'https://www.microsoft.com/en-us/microsoft-teams/group-chat-software', 
      icon: <FaUsers />, 
      bgColor: 'bg-purple-500 hover:bg-purple-600' 
    },
    { 
      name: 'Cisco Webex', 
      url: 'https://www.webex.com/', 
      icon: <FaCommentDots />, 
      bgColor: 'bg-red-500 hover:bg-red-600' 
    }
  ];
  
  return (
    <div className="p-6 mt-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Schedule a Meeting</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {services.map((service, index) => (
          <a 
            key={index}
            href={service.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${service.bgColor} text-white p-3 rounded shadow transition-colors flex flex-col items-center justify-center text-center`}
          >
            <span className="text-xl mb-2">{service.icon}</span>
            <span>{service.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
```

## Main Page Implementation

Create `pages/index.js`:
```javascript
import { useState, useEffect } from 'react';
import Head from 'next/head';
import CitySelector from '../components/CitySelector';
import TimeGrid from '../components/TimeGrid';
import Weather from '../components/Weather';
import MeetingScheduler from '../components/MeetingScheduler';
import { getTimezones } from '../lib/timezone';
import { getWeather } from '../lib/weather';

export default function Home() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  async function addCity(cityName) {
    setLoading(true);
    setError(null);
    
    try {
      const timezoneData = await getTimezones(cityName);
      const weatherData = await getWeather(timezoneData.latitude, timezoneData.longitude);
      
      setCities(prev => [
        ...prev, 
        { 
          name: cityName, 
          timezone: timezoneData, 
          weather: weatherData 
        }
      ]);
    } catch (err) {
      setError(`Failed to add ${cityName}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Head>
        <title>World Time & Weather</title>
        <meta name="description" content="Check time and weather across global locations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">World Time & Weather</h1>
        <p className="text-center text-gray-600">Check local times and weather conditions around the world</p>
      </header>
      
      <main>
        <CitySelector onSelect={addCity} />
        
        {loading && <p className="text-center p-4">Loading...</p>}
        {error && <p className="text-center p-4 text-red-500">{error}</p>}
        
        <TimeGrid cities={cities} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cities.map((city, index) => (
            <Weather key={index} city={city} />
          ))}
        </div>
        
        <MeetingScheduler />
      </main>
      
      <footer className="mt-12 pt-6 border-t text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} World Time & Weather App</p>
      </footer>
    </div>
  );
}
```

## Deployment Options

### Development Environment
```bash
npm run dev
```

### Production Deployment with Vercel
```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy with Vercel
vercel

# Production deployment
vercel --prod
```

## Additional Features (Future Enhancements)

- **Persistent Storage**: Save selected cities using localStorage
- **Custom Themes**: Light/dark mode toggle
- **Offline Support**: PWA implementation
- **Time Conversion Calculator**: For quick timezone conversions
- **International Meeting Planner**: Find optimal meeting times across different timezones
- **Mobile Apps**: Native iOS/Android versions using React Native 