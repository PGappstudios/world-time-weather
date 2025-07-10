import { useEffect, useState } from 'react';

// AdSense Script Component
export default function Adsense({ clientId }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: clientId,
        enable_page_level_ads: true
      });
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [clientId]);

  return (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        data-ad-client={clientId}
      />
    </>
  );
}

// Individual Ad Banner Component
export function AdBanner({ 
  width = 728, 
  height = 90, 
  slot = "1234567890",
  format = "auto",
  responsive = true,
  className = ""
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense banner error:', err);
    }
  }, []);

  return (
    <div className={`my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: responsive ? '100%' : `${width}px`,
          height: `${height}px`,
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e5e9',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden'
        }}
        data-ad-client="ca-pub-9894683094010434"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      >
        {/* Realistic AdSense placeholder styling */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#5f6368',
          fontSize: '12px',
          fontFamily: 'Google Sans, Roboto, Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#4285f4',
              borderRadius: '50%',
              margin: '0 auto 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              G
            </div>
            <div style={{ marginBottom: '4px' }}>Advertisement</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>
              {width} × {height}
            </div>
          </div>
        </div>
      </ins>
    </div>
  );
}

// Large Banner Ad (728x90)
export function LargeBannerAd({ className = "" }) {
  return (
    <AdBanner 
      width={728} 
      height={90} 
      slot="7890123456"
      className={className}
    />
  );
}

// Medium Rectangle Ad (300x250)
export function MediumRectangleAd({ className = "" }) {
  return (
    <AdBanner 
      width={300} 
      height={250} 
      slot="2345678901"
      className={className}
    />
  );
}

// Leaderboard Ad (728x90)
export function LeaderboardAd({ className = "" }) {
  return (
    <AdBanner 
      width={728} 
      height={90} 
      slot="3456789012"
      className={className}
    />
  );
}

// Banner Ad (468x60)
export function BannerAd({ className = "" }) {
  return (
    <AdBanner 
      width={468} 
      height={60} 
      slot="4567890123"
      className={className}
    />
  );
}

// Mobile Banner Ad (320x50)
export function MobileBannerAd({ className = "" }) {
  return (
    <AdBanner 
      width={320} 
      height={50} 
      slot="5678901234"
      className={className}
    />
  );
}

// Responsive Ad Unit
export function ResponsiveAd({ className = "", minHeight = 90 }) {
  return (
    <div className={`my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: `${minHeight}px`,
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e5e9',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden'
        }}
        data-ad-client="ca-pub-9894683094010434"
        data-ad-slot="6789012345"
        data-ad-format="auto"
        data-full-width-responsive="true"
      >
        {/* Realistic responsive AdSense placeholder */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#5f6368',
          fontSize: '12px',
          fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          minHeight: `${minHeight}px`
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#4285f4',
              borderRadius: '50%',
              margin: '0 auto 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              G
            </div>
            <div style={{ marginBottom: '4px' }}>Advertisement</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>
              Responsive Ad
            </div>
          </div>
        </div>
      </ins>
    </div>
  );
} 

// In-Content Ad Component - Perfect for placing between content sections
export function InContentAd({ className = "", title = "Advertisement" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense in-content error:', err);
    }
  }, []);

  return (
    <div className={`my-8 ${className}`}>
      <div className="text-center mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{title}</span>
      </div>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '100px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}
        data-ad-client="ca-pub-9894683094010434"
        data-ad-slot="8901234567"
        data-ad-format="auto"
        data-full-width-responsive="true"
      >
        {/* Realistic in-content AdSense placeholder */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#5f6368',
          fontSize: '12px',
          fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          minHeight: '100px',
          flexDirection: 'column',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#4285f4',
              borderRadius: '50%',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              G
            </div>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Advertisement
            </div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>
              In-Content Ad
            </div>
          </div>
        </div>
      </ins>
    </div>
  );
} 

// Sticky Bottom Ad Component
export function StickyBottomAd({ className = "" }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense sticky bottom error:', err);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t ${className}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <ins
              className="adsbygoogle"
              style={{
                display: 'block',
                width: '100%',
                height: '60px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e1e5e9',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden'
              }}
              data-ad-client="ca-pub-9894683094010434"
              data-ad-slot="9012345678"
              data-ad-format="auto"
              data-full-width-responsive="true"
            >
              {/* Realistic sticky AdSense placeholder */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                color: '#5f6368',
                fontSize: '11px',
                fontFamily: 'Google Sans, Roboto, Arial, sans-serif'
              }}>
                <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#4285f4',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 'bold'
                  }}>
                    G
                  </div>
                  <span>Advertisement</span>
                  <span style={{ fontSize: '9px', opacity: 0.7 }}>• Sticky Banner</span>
                </div>
              </div>
            </ins>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close ad"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 

// Square Ad (250x250)
export function SquareAd({ className = "" }) {
  return (
    <AdBanner 
      width={250} 
      height={250} 
      slot="0123456789"
      className={className}
    />
  );
} 