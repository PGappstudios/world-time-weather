export function generateCityMetaTags(city) {
  if (!city) return {};

  const title = `Current Time in ${city.name} | World Time & Weather`;
  const description = `Check current time, weather, and schedule meetings in ${city.name}. Compare ${city.name}'s time with other cities worldwide.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://worldtimeweather.com/timezones/${city.name.toLowerCase()}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'City',
      name: city.name,
      timezone: city.timezone.timezone,
      url: `https://worldtimeweather.com/timezones/${city.name.toLowerCase()}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://worldtimeweather.com/timezones/${city.name.toLowerCase()}`
      }
    }
  };
}

export function generateMeetingMetaTags(cities) {
  if (!cities || cities.length === 0) return {};

  const cityNames = cities.map(city => city.name).join(', ');
  const title = `Best Meeting Time for ${cityNames} | World Time & Weather`;
  const description = `Find the optimal meeting time across different time zones for ${cityNames}. Schedule meetings efficiently with our time zone converter.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://worldtimeweather.com/meeting-planner`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: 'https://worldtimeweather.com/meeting-planner',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://worldtimeweather.com/meeting-planner'
      }
    }
  };
} 