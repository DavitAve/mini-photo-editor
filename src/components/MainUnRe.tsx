import { FunctionComponent, useContext } from "react";
import Button from "./UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "./UI/Tooltip";
import Context from "./Context";

interface IMainUnReProps {
  onAction: (type: string) => void;
}

const MainUnRe: FunctionComponent<IMainUnReProps> = ({ onAction }) => {
  const context = useContext(Context);
  const { selectedImg } = context || {};
  return (
    <div className="flex items-center gap-3">
      <Tooltip disabled={!!!selectedImg} withDis={true}>
        <div data-content>Ctrl + Z</div>
        <Button
          disabled={!!!selectedImg}
          onClick={() => onAction("undo")}
          data-on
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </Button>
      </Tooltip>
      <Tooltip disabled={!!!selectedImg} withDis={true}>
        <div data-content>Ctrl + B</div>
        <Button
          disabled={!!!selectedImg}
          onClick={() => onAction("redo")}
          data-on
        >
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </Button>
      </Tooltip>
      <Tooltip disabled={!!!selectedImg} withDis={true}>
        <div data-content>Add image</div>
        <Button
          disabled={!!!selectedImg}
          onClick={() => onAction("redo")}
          data-on
        >
          <FontAwesomeIcon icon={faCamera} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default MainUnRe;
