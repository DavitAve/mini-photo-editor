import { FunctionComponent } from "react";

interface IMainRangeProps {
  value: number;
  label?: string;
  max?: number;
  min?: number;
  disabled?: boolean;
  icon?: string;
  onChange: (value: number) => void;
}

const MainRange: FunctionComponent<IMainRangeProps> = ({
  value = 0,
  label,
  max = 100,
  min = 0,
  icon,
  disabled = false,
  onChange,
}) => {
  return (
    <>
      <div className="flex gap-6">
        <div className="w-32 capitalize">
          {label} {value} {icon}
        </div>
        <input
          disabled={disabled}
          type="range"
          className="flex-auto disabled:background-[#666666]"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange(val);
          }}
        />
      </div>
    </>
  );
};

export default MainRange;
