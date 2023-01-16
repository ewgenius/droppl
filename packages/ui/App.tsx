import { FC, useCallback, useEffect, useState } from "react";

export interface AppProps {
  onPick?: () => void;
  onChange?: (color?: string) => void;
  version?: string;
}

function classnames(...classes: Array<string | null | undefined | boolean>) {
  return classes.filter(Boolean).join(" ");
}

export const App: FC<AppProps> = ({ onPick, onChange, version = "0.0.1" }) => {
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
    <div className="bg-gray-1 text-gray-12 w-[168px] flex flex-col text-sm font-mono">
      <div className="flex flex-col p-2 gap-2">
        <div className="flex gap-2">
          <button
            onClick={pick}
            className="relative overflow-hidden bg-gray-3 border border-gray-7 rounded-md hover:bg-gray-4 hover:border-gray-8 flex justify-center items-center rounded-md p-2 text-sm transition-colors duration-300"
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

            <div
              className={classnames(
                "absolute bg-green-9 text-green-12 w-full h-full shadow-inner flex justify-center items-center gap-1 transition-opacity duration-75",
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
            </div>
          </button>

          <button
            disabled={!selectedColor}
            onClick={() => selectedColor && copy(selectedColor, true)}
            className="bg-gray-2 border border-gray-7 rounded-md hover:border-gray-8 flex relative overflow-hidden justify-between items-center shadow-inner flex-grow pl-2 pr-2 py-1 text-sm transition-colors duration-300"
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
                      "w-6 h-6 bg-gray-3 border border-gray-7 rounded-md hover:bg-gray-4 hover:border-gray-8 transition-colors duration-300",
                      selectedColor === color.color ? "ring-2 ring-amber-7" : ""
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
              className="w-6 h-6 flex flex-col justify-center items-center bg-gray-3 border border-gray-7 rounded-md hover:bg-gray-4 hover:border-gray-8 transition-colors duration-300"
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

      <div className="relative py-1 px-2 border-t bg-amber-9 text-amber-12 shadow-inner text-[0.65rem] transition-colors duration-300 border-amber-6">
        droppl, {version}
      </div>
    </div>
  );
};

export default App;
