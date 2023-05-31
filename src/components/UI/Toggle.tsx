import { FunctionComponent, useEffect, useState } from "react";

interface IToggleProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
}

const Toggle: FunctionComponent<IToggleProps> = ({
  defaultChecked = false,
  label = "",
  onChange,
}) => {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    setActive(defaultChecked);
  }, [defaultChecked]);

  return (
    <label className="flex items-center gap-1 justify-end">
      <span className="text-lg font-medium capitalize">{label}</span>
      <button
        onClick={() => {
          setActive(!active);
          onChange && onChange(!active);
        }}
        className={`w-12 h-6 tr-2 rounded-3xl cursor-pointer  relative ${
          active ? "bg-[#0F4C75]" : "bg-[#313131]"
        }`}
      >
        <div
          className={`tr-2 absolute top-[50%] translate-y-[-50%] w-5 h-5 rounded-[50%] bg-[#fff] ${
            active ? "left-6" : "left-[4px]"
          }`}
        ></div>
      </button>
    </label>
  );
};

export default Toggle;
