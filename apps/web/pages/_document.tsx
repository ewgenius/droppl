import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="overflow-hidden">
      <Head />
      <body
        style={{
          background: `
            linear-gradient(90deg, var(--color-inverse) 21px, transparent 1%) center,
            linear-gradient(var(--color-inverse) 21px, transparent 1%) center,
            rgba(var(--color-inverse-rgb), 0.5)
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
