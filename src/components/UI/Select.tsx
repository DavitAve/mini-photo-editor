import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useState } from "react";
import useOutsideClick from "../../hooks/useOutSideClick";
import { ISelectOption } from "../../interfaces/main";

interface ISelectProps {
  title?: string;
  value?: string;
  options?: ISelectOption[];
  onChange?: (value: string) => void;
}

const Select: FunctionComponent<ISelectProps> = ({
  options = [],
  value = "",
  title = "",
  onChange,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const [activeValue, setActiveValue] = useState<string>("");
  const handleOutsideClick = () => setActive(false);

  const ref = useOutsideClick(handleOutsideClick);

  const getSelectHeight = () => {
    const height = options.length < 6 ? options.length * 32 + "px" : 160 + "px";
    return height;
  };

  return (
    <div ref={ref} onClick={() => setActive(!active)} className="relative z-40">
      <div className="bg-[#1b1b1b]  text-white px-4 text-xl cursor-pointer font-medium flex gap-2 items-center min-w-[140px] justify-center">
        {value || activeValue || title}
        <FontAwesomeIcon
          className={`dark-ic text-sm ${active ? "rotate-180" : ""} tr-2`}
          icon={faCaretDown}
        />
      </div>
      <div
        className="absolute top-[110%] left-0 w-full tr-2 overflow-hidden"
        style={{
          height: active ? getSelectHeight() : "0px",
        }}
      >
        <ul className="flex flex-col list-none bg-white">
          {options?.map((item: ISelectOption) => {
            return (
              <li
                className={`px-2 py-1 text-black cursor-pointer tr-2 hover:bg-[#eee] ${
                  activeValue === item.value ? "bg-[#eee]" : ""
                }`}
                onClick={() => {
                  setActive(false);
                  setActiveValue(item.value);
                  onChange && onChange(item.value);
                }}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Select;
