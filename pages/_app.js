import '../styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'
import Adsense from '../components/Adsense';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
      <GoogleAnalytics gaId="G-37PV0LHQN0" />
      <Adsense clientId="ca-pub-9894683094010434" />
    </>
  );
}

export default MyApp; 
