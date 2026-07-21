import 'normalize.css/normalize.css';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { Roboto_Flex, Montserrat } from 'next/font/google';
import { LocaleProvider } from '../components/LocaleProvider';
import { ToastProvider } from '../components/Toast';

const roboto = Roboto_Flex({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  const noLayout = Component.noLayout || false;

  if (noLayout) {
    return (
      <ToastProvider>
        <LocaleProvider>
          <Component {...pageProps} />
        </LocaleProvider>
      </ToastProvider>
    );
  }

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily}
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: ${montserrat.style.fontFamily}
        }
      `}</style>
      <ToastProvider>
        <LocaleProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LocaleProvider>
      </ToastProvider>
    </>
  );
}
