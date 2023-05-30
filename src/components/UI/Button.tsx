import { FunctionComponent, ReactNode } from "react";

interface IButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: FunctionComponent<IButtonProps> = ({
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <>
      <button
        disabled={disabled}
        onClick={() => onClick && onClick()}
        className={`def-btn relative flex items-center${
          typeof children === "string" ? "py-3 px-5" : ""
        } ${
          disabled ? "_disabled" : ""
        } bg-[#0F4C75] tr-2 hover:bg-[#3282B8] active:scale-95 text-lg rounded-lg`}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
