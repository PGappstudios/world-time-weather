import '../styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'
import Adsense from '../components/Adsense';
import Footer from '../components/Footer';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* AdSense Auto Ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9894683094010434"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-9894683094010434",
                enable_page_level_ads: true
              });
            `
          }}
        />
      </Head>
      <Component {...pageProps} />
      <Footer />
      <GoogleAnalytics gaId="G-37PV0LHQN0" />
      <Adsense clientId="ca-pub-9894683094010434" />
    </>
  );
}

export default MyApp; 
