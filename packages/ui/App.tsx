import { FC, useCallback, useState } from "react";

export interface AppProps {
  onPick?: () => void;
  onChange?: (color?: string) => void;
}

function classnames(...classes: Array<string | null | undefined | boolean>) {
  return classes.filter(Boolean).join(" ");
}

export const App: FC<AppProps> = ({ onPick, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [colors, setColors] = useState<Array<string>>([]);
  const [selectedColor, selectColor] = useState<string>();
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails((s) => !s);

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
          setColors((c) => [sRGBHex, ...c.slice(0, 19)]);
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

          <button onClick={() => copy(selectedColor, true)} className="flex relative overflow-hidden justify-between items-center shadow-inner bg-zinc-800 text-zinc-300 flex-grow border border-zinc-500 rounded-lg pl-2 pr-2 py-1 text-sm">
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
                "absolute inset-0 bg-green-600 text-green-100 w-full h-full shadow-inner flex justify-center items-center gap-1 transition-opacity duration-150",
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

      {selectedColor && showDetails && (
        <div className="flex flex-col gap-2 p-2">
          <div className="bg-zinc-900 flex flex-col gap-1 p-2 text-zinc-100 rounded-lg shadow-inner text-[0.65rem]">
            {/* <div
              className="h-8 m-0.5 rounded ring-2 ring-zinc-800 shadow-inner transition-colors duration-300"
              style={{
                backgroundColor: selectedColor,
              }}
            /> */}

            <div>
              <div className="flex justify-between">
                <span>hsl:</span>
                {selectedColor}
              </div>
              <div className="flex justify-between">
                <span>hex:</span>
                {selectedColor}
              </div>
              <div className="flex justify-between">
                <span>rgb:</span>
                {selectedColor}
              </div>
            </div>
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div className="flex flex-col p-2 pb-3 gap-2">
          <div className="flex gap-2 flex-wrap">
            {colors.map((color, i) => (
              <button
                key={colors.length - i - 1}
                onClick={() => selectColor(color)}
                className="w-6 h-6 rounded-md shadow ring-1 ring-zinc-500 hover:ring-2 active:ring-4 hover:ring-amber-400 transition-shadow duration-300"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative py-1 px-2 border-t bg-amber-300 text-amber-900 shadow-inner text-[0.65rem] transition-colors duration-300 border-amber-400">
        droppl, 0.0.1
      </div>
    </div>
  );
};
