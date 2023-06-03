import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";

interface IDialogProps {
  show: boolean;
  children?: ReactNode;
}

const Dialog: FunctionComponent<PropsWithChildren<IDialogProps>> = ({
  show,
  children,
}) => {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      setActive(show);
      setTimeout(() => {
        setActive(!show);
      }, 4000);
    }
  }, [show]);
  return (
    <div className={`absolute left-8 tr-5 ${active ? "top-4" : "top-[-100%]"}`}>
      <div className="px-4 py-2 rounded-md bg-white">{children}</div>
    </div>
  );
};

export default Dialog;
