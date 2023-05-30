import { FunctionComponent, ChangeEvent } from "react";
import Button from "./UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "./UI/Tooltip";
import {
  faDownload,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

interface IMainFuncProps {
  image: string | ArrayBuffer | null;
  fileRef: React.RefObject<HTMLInputElement>;
  onAction: (type: string, event?: ChangeEvent<HTMLInputElement>) => void;
}

const MainFunc: FunctionComponent<IMainFuncProps> = ({
  image,
  fileRef,
  onAction,
}) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <Button onClick={() => onAction("download")} disabled={!image}>
        Download Image
        <FontAwesomeIcon className="ml-2" icon={faDownload} />
      </Button>
      <div className="flex items-center gap-3">
        {image && (
          <Tooltip>
            <FontAwesomeIcon
              onClick={() => {
                onAction("delete");
              }}
              data-on
              className="btn-ic text-2xl"
              icon={faTrash}
            />
            <div data-content>Delete image</div>
          </Tooltip>
        )}
        <Button>
          <label htmlFor="imageUpl">
            Upload image
            <FontAwesomeIcon className="ml-2" icon={faUpload} />
            <input
              ref={fileRef}
              id="imageUpl"
              type="file"
              className="hidden"
              onChange={(event) => onAction("upload", event)}
            />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default MainFunc;
