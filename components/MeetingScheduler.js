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
      icon: <FaGoogle size={24} className="text-white" />, 
      bgColor: 'bg-green-500 hover:bg-green-600' 
    },
    { 
      name: 'Outlook Calendar', 
      url: 'https://outlook.live.com/calendar/', 
      icon: <FaMicrosoft size={24} className="text-white" />, 
      bgColor: 'bg-blue-500 hover:bg-blue-600' 
    },
    { 
      name: 'Zoom', 
      url: 'https://zoom.us/', 
      icon: <FaVideo size={24} className="text-white" />, 
      bgColor: 'bg-gray-700 hover:bg-gray-800' 
    },
    { 
      name: 'Microsoft Teams', 
      url: 'https://www.microsoft.com/en-us/microsoft-teams/group-chat-software', 
      icon: <FaUsers size={24} className="text-white" />, 
      bgColor: 'bg-purple-500 hover:bg-purple-600' 
    },
    { 
      name: 'Cisco Webex', 
      url: 'https://www.webex.com/', 
      icon: <FaCommentDots size={24} className="text-white" />, 
      bgColor: 'bg-red-500 hover:bg-red-600' 
    }
  ];
  
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Schedule a Meeting</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {services.map((service, index) => (
          <a 
            key={index}
            href={service.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${service.bgColor} text-white p-4 rounded-lg shadow transition-colors flex flex-col items-center justify-center text-center h-full`}
          >
            <div className="text-3xl mb-2">{service.icon}</div>
            <div className="text-sm font-medium">{service.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
} 