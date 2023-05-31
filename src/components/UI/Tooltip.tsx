import React, {
  FunctionComponent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { CSSTransition } from "react-transition-group";

interface ITooltipProps {
  side?: "left" | "right" | "top" | "bottom";
  children?: ReactNode[];
}

const Tooltip: FunctionComponent<ITooltipProps> = ({
  side = "left",
  children,
}) => {
  const [onElement, setOnElement] = useState<ReactElement>();
  const [contentElem, setContentElem] = useState<ReactElement>();
  const [active, setActive] = useState(false);

  const handleShow = (value: boolean) => {
    setActive(value);
  };
  const getElement = (attr: string) => {
    return React.Children.toArray(children).find(
      (item) => React.isValidElement(item) && item.props[attr]
    ) as ReactElement;
  };

  useEffect(() => {
    setOnElement(getElement("data-on"));
    setContentElem(getElement("data-content"));
  }, [children]);

  return (
    <div className="tooltip">
      <div
        className="relative tooltip-body"
        onMouseEnter={() => handleShow(true)}
        onMouseLeave={() => handleShow(false)}
      >
        {onElement}
        {active && (
          <div className="tooltip-cont hidden absolute p-4 bg-[#fff] rounded-md">
            {contentElem}
          </div>
        )}

        <CSSTransition
          in={active}
          timeout={200}
          classNames="tooltip"
          unmountOnExit
        >
          <div className="tooltip-cont top-[120%] absolute p-4 bg-[#fff] rounded-md z-20 w-max">
            <div className="cont">{contentElem}</div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default Tooltip;
