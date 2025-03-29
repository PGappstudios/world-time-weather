import { useEffect } from 'react';

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