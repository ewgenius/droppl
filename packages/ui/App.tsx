import { FC, useCallback, useEffect, useState } from "react";

export interface AppProps {
  onPick?: () => void;
  onChange?: (color?: string) => void;
}

function classnames(...classes: Array<string | null | undefined | boolean>) {
  return classes.filter(Boolean).join(" ");
}

export const App: FC<AppProps> = ({ onPick, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [colors, setColors] = useState<
    Record<string, { color: string; order: number }>
  >({});
  const [selectedColor, selectColor] = useState<string>();

  useEffect(() => {
    const initialState = localStorage.getItem("droppl.palette");
    if (initialState) {
      try {
        const parsed = JSON.parse(initialState);
        setColors(parsed);
      } catch (e) {}
    }
  }, []);

  const copy = useCallback((value: string, indicate = false) => {
    navigator.clipboard.writeText(value);

    if (indicate) {
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 1000);

      return () => {
        setCopied(false);
        clearTimeout(t);
      };
    }
  }, []);

  const pick = () => {
    onPick && onPick();

    try {
      // @ts-ignore
      const dropper = new EyeDropper();

      dropper
        .open()
        .then(({ sRGBHex }: any) => {
          setColors((c) => {
            if (!!c[sRGBHex]) {
              return c;
            }

            const newState = {
              ...c,
              [sRGBHex]: {
                color: sRGBHex,
                order: Object.keys(c).length,
              },
            };

            localStorage.setItem("droppl.palette", JSON.stringify(newState));

            return newState;
          });
          selectColor(sRGBHex);
          copy(sRGBHex, true);
          onChange && onChange(sRGBHex);
        })
        .catch(() => {
          onChange && onChange();
        });
    } catch (e) {
      onChange && onChange();
    }
  };

  return (
    <div className="bg-zinc-800 text-white w-[168px] flex flex-col text-sm font-mono">
      <div className="flex flex-col p-2 gap-2">
        <div className="flex gap-2">
          <button
            onClick={pick}
            className="flex justify-center ring-1 ring-amber-500 hover:ring-2 active:ring-4 bg-amber-400 hover:bg-amber-400 items-center border border-amber-600 text-amber-600 rounded-md p-2 text-sm transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          </button>

          <button
            disabled={!selectedColor}
            onClick={() => selectedColor && copy(selectedColor, true)}
            className="flex relative overflow-hidden justify-between items-center shadow-inner bg-zinc-800 text-zinc-300 flex-grow border border-zinc-500 rounded-lg pl-2 pr-2 py-1 text-sm"
          >
            <span>{selectedColor || "#......"}</span>

            {selectedColor && (
              <div
                className="w-4 h-4 rounded shadow ring-1 ring-zinc-500 transition-colors duration-300"
                style={{
                  backgroundColor: selectedColor,
                }}
              />
            )}

            <div
              className={classnames(
                "absolute inset-0 bg-green-600 text-green-100 w-full h-full shadow-inner flex justify-center items-center gap-1 transition-opacity duration-75",
                copied ? "opacity-100 z-0" : "opacity-0 -z-10"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              copied!
            </div>
          </button>
        </div>
      </div>

      {Object.keys(colors).length > 0 && (
        <div className="flex flex-col p-2 pb-3 gap-2">
          <div className="flex gap-2 flex-wrap">
            {Object.keys(colors)
              .map((key) => colors[key])
              .sort((a, b) => b.order - a.order)
              .map((color) => {
                return (
                  <button
                    key={color.color}
                    onClick={() => selectColor(color.color)}
                    className={classnames(
                      "w-6 h-6 rounded-md shadow hover:ring-2 active:ring-4 hover:ring-amber-400 transition-shadow duration-300",
                      selectedColor === color.color
                        ? "ring-2 ring-amber-500"
                        : "ring-1 ring-zinc-500"
                    )}
                    style={{
                      backgroundColor: color.color,
                    }}
                  />
                );
              })}

            <button
              onClick={() => {
                setColors({});
                localStorage.setItem("droppl.palette", "{}");
              }}
              className="w-6 h-6 ring-1 ring-zinc-500 text-zinc-500 hover:text-amber-400 flex flex-col justify-center items-center rounded-md shadow hover:ring-2 active:ring-4 hover:ring-amber-400 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="relative py-1 px-2 border-t bg-amber-300 text-amber-900 shadow-inner text-[0.65rem] transition-colors duration-300 border-amber-400">
        droppl, 0.0.1
      </div>
    </div>
  );
};

export default App;
