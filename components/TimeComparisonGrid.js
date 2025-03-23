import { useState, useEffect, useRef, createRef } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FaHome, FaTimes, FaGripVertical, FaArrowsAltH, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Load the required dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimeComparisonGrid({ cities, onRemove }) {
  const [currentHour, setCurrentHour] = useState(dayjs().hour());
  const [draggedItem, setDraggedItem] = useState(null);
  const [showAlignment, setShowAlignment] = useState(true);
  const [alignmentHourOffset, setAlignmentHourOffset] = useState(0); // Offset from home city current hour
  const [isDraggingAlignment, setIsDraggingAlignment] = useState(false);
  const [startDragX, setStartDragX] = useState(0);
  const [visibleHoursStart, setVisibleHoursStart] = useState(0); // Start index for the visible hours in carousel
  const [selectedHour, setSelectedHour] = useState(null); // Store the selected hour from home city
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false); // Track if user is hovering over timeline
  const [dragDelta, setDragDelta] = useState(0); // Track the drag distance for smoother animations
  const cityRefs = useRef([]);
  const timelineRef = useRef(null);
  
  // Initialize refs for each city
  useEffect(() => {
    cityRefs.current = Array(cities.length).fill().map((_, i) => cityRefs.current[i] || createRef());
  }, [cities.length]);
  
  // Initialize the grid on mount
  useEffect(() => {
    if (cities.length > 0) {
      centerTimelineOnCurrentHour();
    }
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      setCurrentHour(now.hour());
      if (cities.length > 0 && alignmentHourOffset === 0) {
        centerTimelineOnCurrentHour();
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [cities.length, alignmentHourOffset]);

  // Center timeline when cities change
  useEffect(() => {
    if (cities.length > 0) {
      centerTimelineOnCurrentHour();
    }
  }, [cities]);

  // Function to center the timeline on the current hour
  const centerTimelineOnCurrentHour = () => {
    if (cities.length > 0) {
      const homeCity = cities[0];
      const homeCityTime = dayjs().tz(homeCity.timezone.timezone);
      const currentHour = homeCityTime.hour();
      
      // Calculate the visible hours start to center the current hour
      // We want to show 17 hours (8 before, current, and 8 after)
      setVisibleHoursStart((currentHour - 8 + 24) % 24);
      setAlignmentHourOffset(0);
    }
  };

  // Platform-agnostic event handlers
  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    e.preventDefault();
    setIsDraggingAlignment(true);
    setStartDragX(clientX);
    setDragDelta(0);
    document.body.style.cursor = 'grabbing';

    if (e.touches) {
      document.addEventListener('touchmove', handlePointerMove, { passive: false });
      document.addEventListener('touchend', handlePointerUp);
    } else {
      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('mouseup', handlePointerUp);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingAlignment) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    e.preventDefault?.();

    const diffX = clientX - startDragX;
    setDragDelta(diffX);

    const hourDiff = Math.round(diffX / 60);
    if (hourDiff !== 0) {
      setAlignmentHourOffset(prev => prev - hourDiff);
      setVisibleHoursStart(prev => (prev + hourDiff + 24) % 24);
      setStartDragX(clientX);
      setDragDelta(0);
    }
  };

  const handlePointerUp = () => {
    setIsDraggingAlignment(false);
    setDragDelta(0);
    document.body.style.cursor = 'default';

    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('mouseup', handlePointerUp);
    document.removeEventListener('touchmove', handlePointerMove);
    document.removeEventListener('touchend', handlePointerUp);

    if (alignmentHourOffset === 0) {
      centerTimelineOnCurrentHour();
    }
  };

  // Handle timeline hover events
  const handleTimelineMouseEnter = () => {
    setIsHoveringTimeline(true);
  };

  const handleTimelineMouseLeave = () => {
    if (!isDraggingAlignment) {
      setIsHoveringTimeline(false);
    }
  };

  // Handle hour selection from home city
  const handleHourClick = (hour, cityIndex, displayHour) => {
    // Only allow selecting from home city (first city)
    if (cityIndex === 0) {
      // If clicking the same hour again, deselect it
      if (selectedHour === hour) {
        setSelectedHour(null);
      } else {
        setSelectedHour(hour);
      }
    }
  };
  
  // Drag and drop handlers for city reordering
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index);
    
    // Add dragging class
    if (cityRefs.current[index]?.current) {
      cityRefs.current[index].current.classList.add('bg-blue-50');
    }
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  };
  
  const handleDragEnter = (e, index) => {
    if (draggedItem === null || draggedItem === index) return;
    
    // Highlight the drop target
    if (cityRefs.current[index]?.current) {
      cityRefs.current[index].current.classList.add('bg-gray-100');
    }
  };
  
  const handleDragLeave = (e, index) => {
    // Remove highlight
    if (cityRefs.current[index]?.current) {
      cityRefs.current[index].current.classList.remove('bg-gray-100');
    }
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }
    
    // Reorder cities
    const newCities = [...cities];
    const draggedCity = newCities[draggedItem];
    
    // Remove from original position
    newCities.splice(draggedItem, 1);
    
    // Insert at new position
    newCities.splice(dropIndex, 0, draggedCity);
    
    // Update cities in parent component
    onRemove(null, newCities);
    
    // Clear drag state
    setDraggedItem(null);
    
    // Remove all highlight classes
    cityRefs.current.forEach(ref => {
      if (ref?.current) {
        ref.current.classList.remove('bg-blue-50', 'bg-gray-100');
      }
    });
    
    // Recenter timeline if needed (when home city changes)
    if (draggedItem === 0 || dropIndex === 0) {
      // If the home city was involved in the drag-drop, reset alignment and recenter
      resetAlignment();
    }
  };
  
  const handleDragEnd = (e) => {
    // Clear drag state
    setDraggedItem(null);
    
    // Remove all highlight classes
    cityRefs.current.forEach(ref => {
      if (ref?.current) {
        ref.current.classList.remove('bg-blue-50', 'bg-gray-100');
      }
    });
  };
  
  if (!cities.length) {
    return (
      <div className="text-center p-4 border rounded bg-gray-50 mb-6">
        <p className="text-gray-500">Add cities to view time comparisons</p>
      </div>
    );
  }
  
  // Function to generate array of hours for the timeline
  const generateVisibleHours = () => {
    const visibleHours = [];
    
    // Show all 24 hours
    for (let i = 0; i < 24; i++) {
      const hour = (visibleHoursStart + i) % 24;
      visibleHours.push(hour);
    }
    
    return visibleHours;
  };
  
  // Get the timezone abbreviation (like GMT, EST, etc)
  const getTimezoneAbbr = (timezoneData) => {
    if (!timezoneData) return '';
    const abbr = timezoneData.abbreviation || '';
    return abbr;
  };
  
  // Format hour display
  const formatHour = (hour) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'am' : 'pm';
    return `${h}${ampm}`;
  };
  
  // Reset alignment and center current hour
  const resetAlignment = () => {
    setAlignmentHourOffset(0);
    setSelectedHour(null); // Clear selection when resetting
    
    // Recenter the timeline on the current hour
    centerTimelineOnCurrentHour();
  };

  // Scroll timeline left
  const scrollTimelineLeft = () => {
    setVisibleHoursStart(prev => (prev - 1 + 24) % 24);
    setAlignmentHourOffset(prev => prev + 1);
  };
  
  // Scroll timeline right
  const scrollTimelineRight = () => {
    setVisibleHoursStart(prev => (prev + 1) % 24);
    setAlignmentHourOffset(prev => prev - 1);
  };
  
  // Before rendering, ensure home city's current time is centered if no offset
  if (cities.length > 0 && alignmentHourOffset === 0) {
    const homeCity = cities[0];
    const homeCityTime = dayjs().tz(homeCity.timezone.timezone);
    const currentHour = homeCityTime.hour();
    
    // Check if current hour is centered properly
    const centerPosition = (currentHour - visibleHoursStart + 24) % 24;
    if (centerPosition !== 12) {  // 12 is the center position in our 24-hour view
      // Adjust visibleHoursStart to center the current hour
      const newVisibleHoursStart = (currentHour - 12 + 24) % 24;
      if (visibleHoursStart !== newVisibleHoursStart) {
        setVisibleHoursStart(newVisibleHoursStart);
      }
    }
  }
  
  const visibleHours = generateVisibleHours();
  
  // Function to check if a given hour is the current hour
  const isCurrentHour = (displayHour, cityTime) => {
    return cityTime.hour() === displayHour;
  };

  // Function to check if a given hour is in working hours
  const isWorkingHour = (hour) => {
    return hour >= 8 && hour <= 17;
  };

  // Function to check if a given hour is in night hours
  const isNightHour = (hour) => {
    return hour >= 22 || hour <= 6;
  };

  // Helper function to determine hour colors
  const getHourColor = (hour) => {
    // Working hours: 8am to 5pm inclusive (8-17) - green
    if (isWorkingHour(hour)) {
      return 'bg-green-100 border-green-200';
    }
    // Night hours: 10pm to 6am inclusive (22-6) - yellow
    else if (isNightHour(hour)) {
      return 'bg-yellow-100 border-yellow-200';
    }
    // Other hours - orange
    else {
      return 'bg-orange-100 border-orange-200';
    }
  };
  
  return (
    <div className="mb-4 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-1 flex items-center justify-center px-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAlignment(!showAlignment)} 
            className="px-2 py-0.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-300 rounded bg-white shadow-sm hover:bg-blue-50"
          >
            {showAlignment ? 'Hide alignment' : 'Show alignment'}
          </button>
          {showAlignment && (
            <button
              onClick={resetAlignment}
              className="px-2 py-0.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-300 rounded bg-white shadow-sm hover:bg-blue-50"
            >
              Reset alignment
            </button>
          )}
          {alignmentHourOffset !== 0 && showAlignment && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
              {alignmentHourOffset > 0 ? `+${alignmentHourOffset}h` : `${alignmentHourOffset}h`}
            </span>
          )}
          {selectedHour !== null && (
            <button
              onClick={() => setSelectedHour(null)}
              className="px-2 py-0.5 text-xs text-purple-600 hover:text-purple-800 border border-purple-300 rounded bg-white shadow-sm hover:bg-purple-50"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
      
      {/* City grid with timelines */}
      <div className="bg-white">
        {cities.map((city, cityIndex) => {
          // Get the local time for this city
          const cityTime = dayjs().tz(city.timezone.timezone);
          const tzAbbr = getTimezoneAbbr(city.timezone);
          
          // Calculate timezone offset difference from home city
          const homeCity = cities[0];
          const homeCityTime = dayjs().tz(homeCity.timezone.timezone);
          const tzOffsetDiff = (cityTime.utcOffset() - homeCityTime.utcOffset()) / 60;
          
          // Calculate the centered index (middle of visible hours)
          const centerHourIndex = 12; // 12th position in visibleHours (0-based index)
          const centerHour = visibleHours[centerHourIndex];
          
          // Calculate which home city hour to align with
          const homeCityCurrentHour = homeCityTime.hour();
          const homeAlignmentHour = (homeCityCurrentHour + alignmentHourOffset + 24) % 24;
          
          return (
            <div 
              key={cityIndex} 
              className="border-b last:border-b-0"
              ref={cityRefs.current[cityIndex]}
              draggable
              onDragStart={(e) => handleDragStart(e, cityIndex)}
              onDragOver={(e) => handleDragOver(e, cityIndex)}
              onDragEnter={(e) => handleDragEnter(e, cityIndex)}
              onDragLeave={(e) => handleDragLeave(e, cityIndex)}
              onDrop={(e) => handleDrop(e, cityIndex)}
              onDragEnd={handleDragEnd}
            >
              {/* City row - separated into two distinct containers */}
              <div className="flex items-stretch w-full">
                {/* Left: City Info Container - Draggable for reordering */}
                <div 
                  className="flex items-center min-w-[280px] p-2.5 bg-white cursor-move relative group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, cityIndex)}
                  onDragOver={(e) => handleDragOver(e, cityIndex)}
                  onDragEnter={(e) => handleDragEnter(e, cityIndex)}
                  onDragLeave={(e) => handleDragLeave(e, cityIndex)}
                  onDrop={(e) => handleDrop(e, cityIndex)}
                  onDragEnd={handleDragEnd}
                >
                  {/* City Info Content */}
                  <div className="flex items-center">
                    {cityIndex === 0 ? (
                      <div className="bg-blue-700 text-white rounded-sm p-1.5 shadow-sm mr-2">
                        <FaHome size={18} />
                      </div>
                    ) : (
                      <div className="text-lg text-gray-500 font-medium min-w-[42px] text-center mr-2">
                        {tzOffsetDiff > 0 ? '+' : ''}
                        {Math.round(tzOffsetDiff)}
                      </div>
                    )}
                    {onRemove && (
                      <button
                        onClick={() => onRemove(cityIndex)}
                        className="text-gray-400 hover:text-red-500 transition-colors mr-2"
                        aria-label={`Remove ${city.name}`}
                      >
                        <FaTimes size={16} />
                      </button>
                    )}
                    <div>
                      <div className="flex items-baseline">
                        <h3 className="font-bold text-lg text-gray-800">{city.name}</h3>
                        <span className="ml-2 text-base font-medium text-gray-500 uppercase">{tzAbbr}</span>
                      </div>
                      <div className="text-base text-gray-500">
                        {city.timezone.timezone.split('/')[0] === 'Europe' && city.name === 'London' ? 'United Kingdom' : 
                         city.timezone.timezone.split('/')[0] === 'Africa' && city.name === 'Cairo' ? 'Egypt' :
                         city.timezone.timezone.split('/')[0] === 'Europe' && city.name === 'Moscow' ? 'Russia' :
                         city.name === 'New York' ? 'America' :
                         `${city.timezone.timezone.split('/')[0]}`}
                      </div>
                    </div>
                  </div>

                  {/* Time display and controls */}
                  <div className="flex items-center ml-auto gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {cityTime.format('h:mm')}
                        <span className="text-lg font-medium ml-1 text-gray-600">
                          {cityTime.format('a').toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaGripVertical size={18} />
                    </div>
                  </div>
                </div>

                {/* Right: Timeline Container */}
                <div className="flex-1 bg-white flex flex-col relative">
                  {/* Timeline Controls - Now positioned on sides */}
                  <button
                    onClick={scrollTimelineLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10 flex items-center justify-center bg-white shadow-lg rounded-full z-10"
                    aria-label="Scroll timeline left"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  
                  <button
                    onClick={scrollTimelineRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10 flex items-center justify-center bg-white shadow-lg rounded-full z-10"
                    aria-label="Scroll timeline right"
                  >
                    <FaChevronRight size={16} />
                  </button>

                  {/* Timeline Content */}
                  <div 
                    className="flex-1 overflow-x-auto flex items-center px-12 cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onMouseLeave={(e) => {
                      handlePointerUp();
                      handleTimelineMouseLeave(e);
                    }}
                    onMouseEnter={handleTimelineMouseEnter}
                  >
                    <div className="flex items-center min-w-max py-2">
                      {visibleHours.map((hour, i) => {
                        const displayHour = (hour + tzOffsetDiff + 24) % 24;
                        const isCurrent = isCurrentHour(displayHour, cityTime);
                        const isCenterHour = i === 12; // Updated to center at position 12
                        const alignedHourInThisCity = (homeAlignmentHour + tzOffsetDiff + 24) % 24;
                        const isAlignedHour = Math.round(alignedHourInThisCity) === displayHour;
                        const isSelectedInHomeCity = cityIndex === 0 && selectedHour === hour;
                        const isSelectedAlignedHour = selectedHour !== null && 
                                                   cityIndex !== 0 && 
                                                   Math.round((selectedHour + tzOffsetDiff + 24) % 24) === displayHour;
                        const isSelected = isSelectedInHomeCity || isSelectedAlignedHour;

                        return (
                          <div 
                            key={hour} 
                            className={`
                              flex flex-col items-center justify-center
                              w-[44px] h-[40px] mx-[1px]
                              rounded text-center transition-all relative cursor-pointer
                              ${isSelected ? 'bg-purple-200 text-purple-900 transform scale-105 shadow-sm z-10 font-bold' :
                                isCurrent ? 'bg-blue-100 text-blue-800' : getHourColor(displayHour)}
                              ${isCenterHour && cityIndex === 0 ? 'ring-1.5 ring-blue-500' : ''}
                              ${isAlignedHour && showAlignment && cityIndex !== 0 ? 'ring-1.5 ring-blue-500' : ''}
                              ${isCurrent ? 'font-medium' : ''}
                              hover:shadow-sm
                            `}
                            onClick={() => handleHourClick(hour, cityIndex, displayHour)}
                          >
                            <span className={`text-base leading-none ${isCurrent || isSelected ? 'font-bold' : ''}`}>
                              {formatHour(displayHour)}
                            </span>
                            
                            {/* Current hour indicator */}
                            {isCurrent && (
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute -bottom-0.5"></div>
                            )}
                            
                            {/* Selected hour indicator */}
                            {isSelected && (
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full absolute -top-0.5"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Updated help text */}
      <div className="bg-gray-50 text-lg text-gray-500 text-center py-4 border-t">
        <div className="flex justify-center items-center space-x-4">
          <span className="flex items-center gap-1">
            <FaChevronLeft size={16} className="text-blue-500" /> 
            <FaChevronRight size={16} className="text-blue-500" /> 
            Use the arrow buttons to navigate
          </span>
        </div>
      </div>
    </div>
  );
} 