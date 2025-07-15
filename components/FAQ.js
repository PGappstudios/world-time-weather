import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ResponsiveAd, BannerAd, InContentAd } from './Adsense';

const faqs = [
  {
    question: "How do I find the best time for an international meeting?",
    answer: "Add all participant cities using our city selector, then use the Time Comparison view to find overlapping working hours. The green blocks indicate working hours (8 AM - 5 PM), making it easy to spot suitable meeting times for all participants."
  },
  {
    question: "How accurate is the time zone information?",
    answer: "Our time zone data is sourced from the WorldTime API and is automatically updated to reflect daylight saving time changes. The times are synchronized with global time servers for accuracy."
  },
  {
    question: "Can I save my frequently used cities?",
    answer: "Yes, your selected cities are automatically saved in your browser's local storage. They will be restored when you return to the site, making it convenient for regular time zone checks."
  },
  {
    question: "How often is the weather information updated?",
    answer: "Weather data is fetched from Open-Meteo and is updated hourly. The temperature, humidity, and precipitation forecasts are refreshed automatically when you load the page."
  },
  {
    question: "Can I share my time comparison with others?",
    answer: "Yes, you can share your selected cities and their time comparisons through various methods including direct links, social media, or by using our 'Share' feature in the Sharing Options section."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <div className="border rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
            
            {/* Add ad after the 2nd FAQ */}
            {index === 1 && (
              <InContentAd title="Sponsored Content" />
            )}
            
            {/* Add ad after the 4th FAQ */}
            {index === 3 && (
              <div className="my-6 flex justify-center">
                <BannerAd className="max-w-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
} 