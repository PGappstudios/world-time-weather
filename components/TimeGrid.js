import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FaTimes } from 'react-icons/fa';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimeGrid({ cities, onRemove }) {
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
          <div key={index} className="p-4 border rounded shadow-sm bg-white relative group">
            {onRemove && (
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label={`Remove ${city.name}`}
              >
                <FaTimes />
              </button>
            )}
            
            <h3 className="font-bold text-lg">{city.name}</h3>
            <p className="text-2xl">{localTime.format('HH:mm:ss')}</p>
            <p className="text-sm text-gray-500">{localTime.format('MMMM D, YYYY')}</p>
            <p className="text-xs text-gray-400 mt-1">{city.timezone.timezone}</p>
          </div>
        );
      })}
    </div>
  );
} 