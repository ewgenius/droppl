import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="">
      <Head />
      <body style={{
        backgroundColor: "var(--color-inverse)"
      }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
