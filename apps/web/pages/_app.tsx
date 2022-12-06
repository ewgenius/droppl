import type { AppProps } from "next/app";
import localFont from "@next/font/local";
import "../styles/styles.css";

const MonaSans = localFont({ src: "./Mona-Sans.woff2" });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${MonaSans.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
