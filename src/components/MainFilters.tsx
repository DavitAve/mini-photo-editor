import { FunctionComponent } from "react";
import Toggle from "./UI/Toggle";
import { IChanges } from "../interfaces/main";

interface IMainFiltersProps {
  changes: IChanges;
  onAction: (key: string, value: boolean) => void;
}

const visiableKeys: string[] = ["grayscale", "invert", "sepia"];

const MainFilters: FunctionComponent<IMainFiltersProps> = ({
  changes,
  onAction,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-3xl">Filters</span>
      <div className="flex flex-col gap-3">
        {Object.keys(changes).map((key, index) => {
          if (visiableKeys.includes(key))
            return (
              <Toggle
                value={!!changes[key as keyof IChanges]}
                key={index}
                label={key}
                onChange={(value) => onAction(key, value)}
              />
            );
        })}
      </div>
    </div>
  );
};

export default MainFilters;
