import { FunctionComponent, useEffect, useState } from "react";

interface IToggleProps {
  value?: boolean;
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

const Toggle: FunctionComponent<IToggleProps> = ({
  value = false,
  defaultChecked = false,
  label = "",
  disabled = false,
  onChange,
}) => {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    setActive(value);
  }, [value]);

  useEffect(() => {
    setActive(defaultChecked);
  }, [defaultChecked]);

  return (
    <label className="flex items-center gap-1 justify-end">
      <span className="text-lg font-medium capitalize">{label}</span>
      <button
        onClick={() => {
          if (!disabled) {
            setActive(!active);
            onChange && onChange(!active);
          }
        }}
        className={`w-12 h-6 tr-2 rounded-3xl cursor-pointer  relative ${
          active ? "bg-[#0F4C75]" : "bg-[#313131]"
        } ${disabled ? "cursor-auto" : ""}`}
      >
        <div
          className={`tr-2 absolute top-[50%] translate-y-[-50%] w-5 h-5 rounded-[50%] bg-[#fff] ${
            active ? "left-6" : "left-[4px]"
          } ${disabled ? "bg-[#666666]" : ""}`}
        ></div>
      </button>
    </label>
  );
};

export default Toggle;
