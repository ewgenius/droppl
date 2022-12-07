/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { FC, useCallback, useEffect, useState } from "react";

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
  const [showInteractivePicker, setShowInteractivePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(true);
  const [colors, setColors] = useState(["#ffffff"]);

  const pushColor = (color: string) => {
    setColors((c) => [color, ...c]);
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

  useEffect(() => {
    // @ts-ignore
    if (typeof EyeDropper === "undefined") {
      setShowInteractivePicker(false);
    } else {
      setShowInteractivePicker(true);
    }
  }, []);

  const onChange = (color?: string) => {
    setShowPicker(true);
    if (color) {
      pushColor(color);
    }
  };

  const pick = () => {
    // @ts-ignore
    const dropper = new EyeDropper();
    setShowPicker(false);
    dropper
      .open()
      .then(({ sRGBHex }: any) => {
        onChange(sRGBHex);
      })
      .catch(() => {
        setShowPicker(true);
      });
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
            <App onChange={onChange} onPick={() => setShowPicker(false)} />
          </div>

          <header className="flex flex-col gap-8 md:flex-row md:items-center justify-center">
            {/* h1 */}
            <div className="relative">
              <p
                style={{ color: "var(--color)" }}
                className="opacity-75 absolute -top-8 left-3 text-xl"
              >
                simple color picker
              </p>

              <h1
                className="text-6xl antialiased md:text-9xl font-bold relative transition-colors duration-300"
                style={{
                  color: "var(--color)",
                }}
              >
                Droppl
              </h1>

              {/* pseudo picker */}
              <div
                className="absolute scale-[0.40] md:transform-none top-[-10px] left-[-55px] md:top-[45px] md:left-[-49px] w-[120px] h-[120px] flex flex-col justify-center items-center rounded-[50%] border border-[#595a59] overflow-hidden"
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
                <div className="bg-white border border-[#999] absolute bottom-[55px] left-[55px] z-10 w-[8px] h-[8px]" />
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
                className="w-20 md:w-32 h-20 md:h-32"
              />
              <div className="absolute top-24 md:top-36 flex flex-col">
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
        </main>
      </div>
    </>
  );
}

export interface AppProps {
  onPick: () => void;
  onChange: (color?: string) => void;
}

const App: FC<AppProps> = ({ onPick, onChange }) => {
  const [colors, setColors] = useState<Array<string>>([]);

  const copy = (value: string) => navigator.clipboard.writeText(value);

  const pick = () => {
    // @ts-ignore
    const dropper = new EyeDropper();

    onPick();
    dropper
      .open()
      .then(({ sRGBHex }: any) => {
        setColors((c) => [sRGBHex, ...c]);
        copy(sRGBHex);
        onChange(sRGBHex);
      })
      .catch(() => {
        onChange();
      });
  };

  return (
    <div className="bg-white shadow-white w-[168px] flex flex-col text-sm font-mono">
      <div className="flex flex-col p-2 gap-2">
        <div className="flex gap-2">
          <button
            onClick={pick}
            className="flex justify-center ring-2 ring-amber-400 items-center border border-amber-600 text-amber-600 rounded-md p-2 text-sm"
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
              className="w-4 h-4"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          </button>
          <span className="flex justify-between items-center bg-gray-200 text-gray-500 flex-grow border border-gray-300 rounded-md pl-2 pr-1 py-1 text-sm">
            <span>{colors[0]}</span>
            <button className="border border-gray-300 bg-gray-100 rounded p-1">
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
                className="w-3 h-3"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </span>
        </div>
        {colors.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {colors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-md border border-gray-200 shadow"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-amber-300 bg-amber-200 text-gray-400 shadow-inner text-xs">
        droppl, 0.0.1
      </div>
    </div>
  );
};
