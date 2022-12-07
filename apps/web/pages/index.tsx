/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useEffect, useState } from "react";

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
  const bg = inverseColor(colors[0]);
  const pushColor = (color: string) => setColors((c) => [color, ...c]);

  useEffect(() => {
    // @ts-ignore
    if (typeof EyeDropper === "undefined") {
      setShowInteractivePicker(false);
    } else {
      setShowInteractivePicker(true);
    }
  }, []);

  const pick = () => {
    // @ts-ignore
    const dropper = new EyeDropper();
    setShowPicker(false);
    dropper
      .open()
      .then(({ sRGBHex }: any) => {
        setShowPicker(true);
        pushColor(sRGBHex);
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

      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: bg,
        }}
      >
        <main className="mx-auto container px-16 md:px-16 pt-16 md:pt-32">
          <div className="flex flex-col gap-16 items-start md:flex-row md:items-center justify-center">
            <div className="relative">
              <h1
                className="text-6xl antialiased md:text-9xl font-bold relative transition-colors duration-300"
                style={{
                  color: colors[0],
                }}
              >
                Droppl
              </h1>

              <div
                className="absolute scale-[0.40] md:transform-none top-[-10px] left-[-55px] md:top-[45px] md:left-[-49px] w-[120px] h-[120px] flex flex-col justify-center items-center rounded-[50%] border border-[#595a59] overflow-hidden transition-all duration-300"
                style={{
                  opacity: showPicker ? 1 : 0,
                  backgroundColor: bg,
                }}
              >
                <div
                  className="bg-white absolute w-[62px] h-[62px] border-[#eaeaea] top-0 right-0 transition-colors duration-300"
                  style={{
                    background: colors[0],
                    borderColor: colors[0],
                  }}
                />
                <div className="bg-white border border-[#999] absolute bottom-[55px] left-[55px] z-10 w-[8px] h-[8px]" />
                <span className="bg-[#575757] w-[80px] h-[18px] py-[1px] font-sans mt-[52px] text-[11px] leading-[16px] text-center rounded-[6px]">
                  {hex2rgb(colors[0])}
                </span>
              </div>
            </div>

            {
              <div
                className="hidden relative md:flex flex-col gap-2 justify-center items-center transition-opacity duration-300"
                style={{
                  opacity: showInteractivePicker ? 1 : 0,
                }}
              >
                <button
                  onClick={pick}
                  className="px-6 py-3 gap-4 text-lg bg-black font-mono flex justify-center items-center rounded-lg border border-zinc-800"
                >
                  pick
                  <img src="/icon.svg" alt="logo" className="w-6 h-6" />
                </button>

                <div className="absolute top-16 flex flex-col">
                  {colors.length > 1 &&
                    colors.slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="relative px-2 py-1 flex justify-center items-center gap-2 font-mono text-xs rounded border border-zinc-900 transition-colors duration-300"
                        style={{
                          opacity: (8 - i) / 5,
                          transform: `translateY(${-i * 16}px) scale(${
                            (10 - i) / 10
                          })`,
                          zIndex: 8 - i,
                          color: inverseColor(color),
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
                          style={{ background: color, borderColor: inverseColor(color) }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </>
  );
}
