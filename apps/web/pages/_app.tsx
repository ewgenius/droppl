import type { AppProps } from "next/app";
import localFont from "@next/font/local";
import "../styles/styles.css";
import Head from "next/head";

const MonaSans = localFont({ src: "./Mona-Sans.woff2" });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <style jsx global>{`
        html {
          font-family: ${MonaSans.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
