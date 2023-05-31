import { FunctionComponent } from "react";
import Toggle from "./UI/Toggle";

interface IMainFiltersProps {
  changes: {
    [key: string]: number;
  };
  onAction: (key: string, value: boolean) => void;
}

const visiableKeys: string[] = ["grayscale", "invert", "sepia"];

const MainFilters: FunctionComponent<IMainFiltersProps> = ({
  changes,
  onAction,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {Object.keys(changes).map((key, index) => {
        if (visiableKeys.includes(key))
          return (
            <Toggle
              key={index}
              label={key}
              onChange={(value) => onAction(key, value)}
            />
          );
      })}
    </div>
  );
};

export default MainFilters;
