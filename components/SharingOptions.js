import { useState } from 'react';
import { 
  FaLinkedin, 
  FaFacebook, 
  FaTwitter, 
  FaCopy, 
  FaFileWord, 
  FaFileExcel,
  FaCheck,
  FaShareAlt
} from 'react-icons/fa';

export default function SharingOptions({ cities = [] }) {
  const [copied, setCopied] = useState(false);

  // Generate sharing text
  const generateSharingText = () => {
    if (!cities.length) {
      return 'No cities selected yet. Add some cities to share their times and weather!';
    }

    const now = new Date();
    const text = cities.map(city => {
      const localTime = new Date(city.timezone.datetime);
      const temp = city.weather?.hourly?.temperature_2m?.[now.getHours()] || 'N/A';
      return `${city.name}: ${localTime.toLocaleTimeString()} (${temp}°C)`;
    }).join('\n');

    return `Current Times & Weather:\n${text}\n\nShared via World Time & Weather App`;
  };

  // Social media sharing handlers
  const shareToLinkedIn = () => {
    const text = encodeURIComponent(generateSharingText());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}&summary=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const text = encodeURIComponent(generateSharingText());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(generateSharingText());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`, '_blank');
  };

  // Local sharing handlers
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateSharingText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadAsWord = () => {
    const text = generateSharingText();
    const blob = new Blob([text], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world-times.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsExcel = () => {
    if (!cities.length) return;

    const headers = ['City', 'Time', 'Temperature'];
    const now = new Date();
    const rows = cities.map(city => {
      const localTime = new Date(city.timezone.datetime);
      const temp = city.weather?.hourly?.temperature_2m?.[now.getHours()] || 'N/A';
      return `${city.name},${localTime.toLocaleTimeString()},"${temp}°C"`;
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world-times.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="flex items-center justify-center gap-2 text-gray-600">
        <FaShareAlt size={20} />
        <span className="text-base">Choose how you want to share your world times</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Social Media Sharing */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Share to Social Media</h3>
          <div className="flex gap-3">
            <button
              onClick={shareToLinkedIn}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-all transform hover:scale-105 ${
                cities.length 
                  ? 'bg-[#0077b5] text-white shadow hover:shadow-md hover:bg-[#0077b5]/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Share on LinkedIn"
              disabled={!cities.length}
            >
              <FaLinkedin size={24} />
              <span className="mt-1 text-xs font-medium">LinkedIn</span>
            </button>
            <button
              onClick={shareToFacebook}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-all transform hover:scale-105 ${
                cities.length 
                  ? 'bg-[#1877f2] text-white shadow hover:shadow-md hover:bg-[#1877f2]/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Share on Facebook"
              disabled={!cities.length}
            >
              <FaFacebook size={24} />
              <span className="mt-1 text-xs font-medium">Facebook</span>
            </button>
            <button
              onClick={shareToTwitter}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-all transform hover:scale-105 ${
                cities.length 
                  ? 'bg-black text-white shadow hover:shadow-md hover:bg-black/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Share on X (Twitter)"
              disabled={!cities.length}
            >
              <FaTwitter size={24} />
              <span className="mt-1 text-xs font-medium">Twitter</span>
            </button>
          </div>
        </div>

        {/* Local Sharing */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Share to Your PC</h3>
          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-all transform hover:scale-105 ${
                cities.length 
                  ? 'bg-gray-800 text-white shadow hover:shadow-md hover:bg-gray-800/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Copy to Clipboard"
              disabled={!cities.length}
            >
              {copied ? <FaCheck size={24} /> : <FaCopy size={24} />}
              <span className="mt-1 text-xs font-medium">Copy</span>
            </button>
            <button
              onClick={downloadAsWord}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-all transform hover:scale-105 ${
                cities.length 
                  ? 'bg-[#2b579a] text-white shadow hover:shadow-md hover:bg-[#2b579a]/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Download as Word Document"
              disabled={!cities.length}
            >
              <FaFileWord size={24} />
              <span className="mt-1 text-xs font-medium">Word</span>
            </button>
            <button
              onClick={downloadAsExcel}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-all transform hover:scale-105 ${
                cities.length 
                  ? 'bg-[#217346] text-white shadow hover:shadow-md hover:bg-[#217346]/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Download as Excel Spreadsheet"
              disabled={!cities.length}
            >
              <FaFileExcel size={24} />
              <span className="mt-1 text-xs font-medium">Excel</span>
            </button>
          </div>
        </div>
      </div>

      {!cities.length && (
        <div className="text-center p-3 bg-blue-50 text-blue-600 rounded-lg text-sm">
          Add some cities to enable sharing options
        </div>
      )}
    </div>
  );
} 