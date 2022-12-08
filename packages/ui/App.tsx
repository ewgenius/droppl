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
    <div className="bg-white shadow-white w-[168px] flex flex-col text-sm font-mono">
      <div className="flex flex-col p-2 gap-2">
        <div className="flex gap-2">
          <button
            onClick={pick}
            className="flex justify-center ring-2 ring-amber-400 active:ring-4 hover:bg-amber-200 items-center border border-amber-600 text-amber-600 rounded-md p-2 text-sm transition-all duration-300"
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
          <span className="flex justify-between items-center shadow-inner bg-gray-200 text-gray-500 flex-grow border border-gray-300 rounded-md pl-2 pr-1 py-1 text-sm">
            <span>{selectedColor || "#......"}</span>
            <button
              onClick={toggleDetails}
              className="border border-gray-300 bg-gray-100 rounded p-1 hover:ring-1 hover:bg-gray-50 active:ring-2 ring-zinc-300 transition-all duration-300"
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </span>
        </div>
      </div>

      {selectedColor && showDetails && (
        <div className="flex flex-col gap-2 px-2">
          <div className="bg-zinc-700 flex flex-col gap-1 p-2 text-zinc-100 rounded-lg shadow-inner text-[0.65rem]">
            <div
              className="h-8 m-0.5 rounded ring-2 ring-zinc-800 shadow-inner transition-colors duration-300"
              style={{
                backgroundColor: selectedColor,
              }}
            />

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
        <div className="flex flex-col p-2 gap-2">
          <div className="flex gap-2 flex-wrap">
            {colors.map((color, i) => (
              <button
                key={i}
                onClick={() => selectColor(color)}
                className="w-6 h-6 rounded-md shadow ring-1 ring-zinc-200 active:ring-4 hover:ring-2 hover:ring-amber-400 transition-shadow duration-300"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className={classnames(
          "relative py-1 px-2 border-t border-amber-300 bg-amber-200 text-gray-400 shadow-inner text-[0.65rem] transition-colors duration-300",
          copied && "border-green-300"
        )}
      >
        droppl, 0.0.1
        <div
          className={classnames(
            "absolute opacity-0 inset-0 bg-green-300 text-green-500 w-full h-full shadow-inner flex justify-center items-center gap-1 transition-opacity",
            copied && "opacity-100"
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
      </div>
    </div>
  );
};
