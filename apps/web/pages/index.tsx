/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const App = dynamic(() => import("ui/App"));

function inverse(figure: number) {
  // inverse a RGB color
  return (figure & 0x000000) | (~figure & 0xffffff);
}

function inverseColor(color: string) {
  return `#${inverse(parseInt(color.substring(1), 16))
    .toString(16)
    .padStart(6, "0")
    .toUpperCase()}`;
}

function hex2rgb(hex: string) {
  const value =
    hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex;
  const r16 = value.slice(1, 2);
  const g16 = value.slice(2, 3);
  const b16 = value.slice(3, 4);

  const r = parseInt(r16 + r16, 16);
  const g = parseInt(g16 + g16, 16);
  const b = parseInt(b16 + b16, 16);

  return `${r}, ${g}, ${b}`;
}

export default function Web() {
  const [unsupported, setUnsupported] = useState(false);
  const [showPicker, setShowPicker] = useState(true);
  const [colors, setColors] = useState<Array<string>>(["000000"]);

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--color")
      .trim();

    setColors([(color.startsWith("#") ? color.slice(1) : color).toUpperCase()]);

    // @ts-ignore
    if (typeof EyeDropper === "undefined") {
      setUnsupported(true);
    }
  }, []);

  const pushColor = (color: string) => {
    setColors((c) => [color, ...c.slice(0, 5)]);
    const inversed = inverseColor(color);
    document.documentElement.style.setProperty("background-color", color);
    document.documentElement.style.setProperty("--color", color);
    document.documentElement.style.setProperty("--color-rgb", hex2rgb(color));
    document.documentElement.style.setProperty(
      "--color-inverse-rgb",
      hex2rgb(inversed)
    );
    document.documentElement.style.setProperty("--color-inverse", inversed);
  };

  const onPick = () => {
    // @ts-ignore
    if (typeof EyeDropper === "undefined") {
      pushColor(
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
      );
    } else {
      setShowPicker(false);
    }
  };

  const onChange = (color?: string) => {
    setShowPicker(true);
    if (color) {
      pushColor(color);
    }
  };

  const title = "Droppl - Simple color picker for Chrome";
  const description =
    "Simple color picker based on Chrome native EyeDropper API. Allows to pick and copy color from anywhere on your screen (even outside of the browser window) and keep it in palette for easy access.";
  const image = "https://www.droppl.app/cover.png";

  return (
    <>
      <Head>
        <title>Droppl</title>
        <meta content={title} property="og:title" />
        <meta content={title} property="twitter:title" />
        <meta content={title} itemProp="name" />

        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content={description} itemProp="description" />
        <meta content={description} property="twitter:description" />

        <meta itemProp="image" content={image} />
        <meta property="twitter:image" content={image} />
        <meta property="og:image" content={image} />
        <meta
          property="twitter:image:alt"
          content="Cover image for droppl.app"
        />
        <meta property="og:image:alt" content="Cover image for droppl.app" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@ewgeniux" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="droppl.app" />
        <meta property="og:url" content="https://www.droppl.app/" />
      </Head>

      <div className="min-h-screen transition-colors duration-300">
        <main className="mx-auto container px-16 md:px-16 flex flex-col gap-4 justify-center items-center min-h-screen">
          <div
            className="absolute top-4 right-4 rounded-xl overflow-hidden shadow-2xl"
            style={{
              transform: "translateY(-150%)",
              animationName: "slideIn",
              animationDelay: "500ms",
              animationFillMode: "forwards",
              animationDuration: "500ms",
              animationTimingFunction: "ease-out",
            }}
          >
            <App onChange={onChange} onPick={onPick} version="0.0.3" />
          </div>

          <header className="flex flex-col gap-8 lg:flex-row md:items-center justify-center">
            {/* h1 */}
            <div className="relative">
              <p
                style={{ color: "var(--color)" }}
                className="opacity-75 absolute -top-6 left-1 md:left-2 text-md md:text-xl"
              >
                simple color picker
              </p>

              <h1
                className="text-8xl antialiased md:text-[12rem] leading-[1] font-bold relative transition-colors duration-300"
                style={{
                  color: "var(--color)",
                  fontVariationSettings: `"wght" 600`,
                }}
              >
                Droppl
              </h1>

              {/* pseudo picker */}
              <div
                className="absolute scale-[0.40] md:transform-none top-[22px] left-[-55px] md:top-[103px] md:left-[-49px] w-[120px] h-[120px] flex flex-col justify-center items-center rounded-[50%] border border-[#595a59] overflow-hidden"
                style={{
                  opacity: showPicker ? 1 : 0,
                  backgroundColor: "var(--color-inverse)",
                }}
              >
                <div
                  className="bg-white absolute w-[62px] h-[62px] border-[#eaeaea] top-0 right-0 transition-colors duration-300"
                  style={{
                    background: "var(--color)",
                    borderColor: "var(--color)",
                  }}
                />
                <div
                  className="border border-[#999] absolute bottom-[55px] left-[55px] z-10 w-[8px] h-[8px]"
                  style={{
                    backgroundColor: "var(--color)",
                  }}
                />
                <span className="bg-[#575757] text-white w-[80px] h-[18px] py-[1px] font-sans mt-[52px] text-[11px] leading-[16px] text-center rounded-[6px]">
                  {hex2rgb(colors[0])}
                </span>
              </div>
            </div>

            {/* logo */}
            <div className="relative flex flex-col gap-2 justify-center items-center transition-opacity duration-300">
              <img
                src="/icon.svg"
                alt="logo"
                className="w-20 md:w-36 h-20 md:h-36 shadow-md rounded-3xl md:rounded-[2.5rem]"
              />
              <div className="absolute top-24 md:top-40 flex flex-col">
                {colors.length > 1 &&
                  colors.slice(0, 5).map((color, i) => {
                    const inverted = inverseColor(color);
                    return (
                      <div
                        key={i}
                        className="relative px-2 py-1 flex justify-center items-center gap-2 font-mono text-xs rounded border border-zinc-900 transition-colors duration-300"
                        style={{
                          opacity: (8 - i) / 5,
                          transform: `translateY(${-i * 16}px) scale(${
                            (10 - i) / 10
                          })`,
                          zIndex: 8 - i,
                          color: inverted,
                          backgroundColor: color,
                        }}
                      >
                        {i === 0 && (
                          <svg
                            className="w-3 h-3 absolute left-[-16px]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke={color}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        )}

                        {color}
                        <div
                          className="w-3 h-3 rounded-sm border"
                          style={{
                            background: color,
                            borderColor: inverted,
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </header>

          <div className="mt-20 md:mt-12 flex gap-2">
            <a
              className="flex justify-center items-center text-md px-3 py-2 gap-2 border rounded-md opacity-60 hover:opacity-100 transition-opacity duration-300"
              style={{
                color: "var(--color)",
                borderColor: "var(--color)",
                backgroundColor: "var(--color-inverse)",
              }}
              href="https://chrome.google.com/webstore/detail/droppl/fippmihelmgjffaaelmikjiikapeheoa"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-5 h-5"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="21.17" y1="8" x2="12" y2="8"></line>
                <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
              </svg>
              Install
            </a>

            <a
              className="flex justify-center items-center text-md px-3 py-2 gap-2 border rounded-md opacity-60 hover:opacity-100 transition-opacity duration-300"
              style={{
                color: "var(--color)",
                borderColor: "var(--color)",
                backgroundColor: "var(--color-inverse)",
              }}
              href="https://github.com/ewgenius/droppl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-5 h-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              GitHub
            </a>
          </div>

          <div
            className={`p-4 absolute bottom-0 m-2 transition-all ${
              unsupported
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-32"
            } duration-300 rounded-lg bg-white text-black text-sm mt-8`}
          >
            Note: The extension uses an experimental API, so only Chromium-based
            browsers are supported.
          </div>
        </main>
      </div>
    </>
  );
}
