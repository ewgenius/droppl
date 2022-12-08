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
  const r16 = hex.slice(1, 2);
  const g16 = hex.slice(2, 3);
  const b16 = hex.slice(3, 4);

  const r = parseInt(r16 + r16, 16);
  const g = parseInt(g16 + g16, 16);
  const b = parseInt(b16 + b16, 16);

  return `${r}, ${g}, ${b}`;
}

export default function Web() {
  const [unsupported, setUnsupported] = useState(false);
  const [showPicker, setShowPicker] = useState(true);
  const [colors, setColors] = useState<Array<string>>(["#000000"]);

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue(
      "--color"
    );

    setColors([color.slice(1)]);

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

  return (
    <>
      <Head>
        <title>Droppl</title>
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
            <App onChange={onChange} onPick={onPick} />
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

          {
            <div
              className={`p-4 absolute bottom-0 m-2 transition-all ${
                unsupported
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-32"
              } duration-300 rounded-lg bg-white text-black text-sm mt-8`}
            >
              Note: The extension uses an experimental API, so only
              Chromium-based browsers are supported.
            </div>
          }
        </main>
      </div>
    </>
  );
}
