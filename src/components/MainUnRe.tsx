import { FunctionComponent } from "react";
import Button from "./UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "./UI/Tooltip";

interface IMainUnReProps {
  onAction: (type: string) => void;
}

const MainUnRe: FunctionComponent<IMainUnReProps> = ({ onAction }) => {
  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <div data-content>Ctrl + Z</div>
        <Button onClick={() => onAction("undo")} data-on>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </Button>
      </Tooltip>
      <Tooltip>
        <div data-content>Ctrl + B</div>
        <Button onClick={() => onAction("redo")} data-on>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default MainUnRe;
