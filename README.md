# World Time & Weather App

A responsive web application that allows users to check time and weather information across multiple global locations, with convenient meeting scheduling integration.

## Features

- View current times for multiple cities around the world
- Check weather conditions including temperature, humidity, and precipitation
- Schedule meetings through popular platforms (Google Calendar, Outlook, Zoom, Teams, Webex)
- Responsive design that works on mobile, tablet, and desktop

## Technology Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Data Fetching**: Axios
- **Date/Time Handling**: Day.js
- **UI Components**: Headless UI
- **Icons**: React Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integrations

- [WorldTime API](https://worldtimeapi.org/) - For timezone data
- [Open-Meteo API](https://open-meteo.com/) - For weather data

## Deployment

The application can be easily deployed with Vercel:

```bash
npm install -g vercel
vercel
```

## License

MIT 