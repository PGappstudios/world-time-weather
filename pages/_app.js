import '../styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-37PV0LHQN0" />
    </>
  );
}

export default MyApp; 