import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="overflow-hidden">
      <Head>
        <script
          async
          defer
          data-website-id="aedaeeb6-524c-4593-832a-c67e1f3e3607"
          data-domains="droppl.me"
          src="https://analytics.ewgenius.me/umami.js"
        ></script>
      </Head>
      <body
        style={{
          background: `
            linear-gradient(90deg, var(--color-inverse) 21px, transparent 1%) center,
            linear-gradient(var(--color-inverse) 21px, transparent 1%) center,
            rgba(var(--color-inverse-rgb), 0.7)
          `,
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "22px 22px",
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
