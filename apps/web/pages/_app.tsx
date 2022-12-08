import type { AppProps } from "next/app";
import localFont from "@next/font/local";
import "../styles/styles.css";
import Head from "next/head";

const Sans = localFont({ src: "./SpaceGrotesk[wght].woff2" });
const Mono = localFont({
  src: "./JetBrainsMono-Regular.woff2",
  variable: "--font-mono",
});

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

        <meta content="Droppl" property="og:title" />
        <meta content="Droppl" property="twitter:title" />
        <meta content="Droppl" itemProp="name" />

        <meta content="simple color picker extension" name="description" />
        <meta
          content="simple color picker extension"
          property="og:description"
        />
        <meta content="simple color picker extension" itemProp="description" />
        <meta
          content="simple color picker extension"
          property="twitter:description"
        />
      </Head>

      <div className={`${Sans.className} ${Mono.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
