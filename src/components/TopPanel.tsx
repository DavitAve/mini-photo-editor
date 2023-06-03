import { FunctionComponent } from "react";
import { fileTypes } from "../utils/constants";
import Select from "./UI/Select";

interface ITopPanelProps {
  fileName: string;
  onAction: (key: string, value: string) => void;
}

const TopPanel: FunctionComponent<ITopPanelProps> = ({
  fileName,
  onAction,
}) => {
  return (
    <div className="flex items-center">
      <span>File name: </span>
      <input
        type="text"
        value={fileName}
        onChange={(e) => onAction("name", e.target.value)}
        className="bg-[#1b1b1b] flex-auto relative z-10 p-4 text-white"
      />
      <Select
        title="File Type"
        options={fileTypes}
        onChange={(type) => onAction("type", type)}
      />
    </div>
  );
};

export default TopPanel;
