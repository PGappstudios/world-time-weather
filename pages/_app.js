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
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9894683094010434"
     crossorigin="anonymous"></script>
export default MyApp; 
