import { FunctionComponent, useState } from "react";
import MainRange from "./MainRange";
import { minMax } from "../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface IMainPanelProps {
  changes: {
    [key: string]: number;
  };
  disabled: boolean;
  onAction: (key: string, value: number) => void;
}

const visiableKeys: string[] = [
  "zoom",
  "rotate",
  "blur",
  "contr",
  "brightness",
  "saturate",
];

const MainPanel: FunctionComponent<IMainPanelProps> = ({
  changes,
  disabled,
  onAction,
}) => {
  const [show, setShow] = useState<boolean>(true);

  return (
    <>
      <div className="w-[640px] py-4">
        <div className="pb-4">
          <button
            className="text-3xl w-full flex justify-between items-center"
            onClick={() => setShow(!show)}
          >
            <span>Settings</span>
            <FontAwesomeIcon
              icon={faCaretDown}
              className={`tr-2 text-lg ${show ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        <div
          className={`flex flex-col gap-4 overflow-hidden tr-2 ${
            show ? "h-[223px]" : "h-0"
          }`}
        >
          {Object.entries(changes).map(([key, item], index) => {
            if (visiableKeys.includes(key))
              return (
                <MainRange
                  key={index}
                  label={key}
                  disabled={!disabled}
                  value={item}
                  icon={minMax[key]?.ic}
                  min={minMax[key]?.min || 0}
                  max={minMax[key]?.max || 100}
                  onChange={(value) => onAction(key, value)}
                />
              );
          })}
        </div>
      </div>
    </>
  );
};

export default MainPanel;
