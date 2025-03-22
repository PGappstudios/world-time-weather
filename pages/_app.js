import '../styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'
import Adsense from '../components/Adsense';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-37PV0LHQN0" />
      <Adsense clientId="ca-pub-9894683094010434" />
    </>
  );
}

export default MyApp; 
