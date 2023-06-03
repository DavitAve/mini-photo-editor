import { FunctionComponent, useContext, ChangeEvent } from "react";
import Button from "./UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faCamera,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "./UI/Tooltip";
import Context from "./Context";
import useUploadFile from "../hooks/useUploadFile";
import { FileT } from "../interfaces/main";

interface IMainUnReProps {
  minImg: FileT;
  onAction: (type: string, file?: string | ArrayBuffer) => void;
}

const MainUnRe: FunctionComponent<IMainUnReProps> = ({ minImg, onAction }) => {
  const context = useContext(Context);
  const { selectedImg } = context || {};
  const { action: uploadImage } = useUploadFile();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    uploadImage(e).then((file) => {
      file && onAction("add", file);
    });
  };

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
        <div data-content>{!minImg ? "Add image" : "Delete image"}</div>
        <Button
          disabled={!!!selectedImg}
          onClick={() => onAction(minImg ? "delete" : "add")}
          data-on
        >
          <label className="leading-[0]">
            {minImg ? (
              <FontAwesomeIcon data-on icon={faTrash} />
            ) : (
              <label>
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={!!!selectedImg}
                  onChange={handleUpload}
                />
              </label>
            )}
          </label>
        </Button>
      </Tooltip>
    </div>
  );
};

export default MainUnRe;
