import {
  FunctionComponent,
  useRef,
  ChangeEvent,
  useState,
  useLayoutEffect,
  useContext,
} from "react";
import useHistoryState from "../hooks/useHistoryState";
import { FileT, IChanges } from "../interfaces/main";
import FolderImg from "../assets/images/folder.png";
import MainFunc from "./MainFunc";
import MainPanel from "./MainPanel";
import MainFilters from "./MainFilters";
import MainUnRe from "./MainUnRe";
import Context from "./Context";
import { numberKeys } from "../utils/constants";
import useUploadFile from "../hooks/useUploadFile";

const canvasSize = 630;

interface IMousePos {
  x: number;
  y: number;
}

const Main: FunctionComponent = () => {
  const context = useContext(Context);
  const { selectedImg, setSelectedImg } = context || {};
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [changes, setChanges, undo, redo] = useHistoryState<IChanges>({
    zoom: 0,
    rotate: 0,
    blur: 0,
    contr: 1,
    brightness: 0,
    saturate: 0,
    grayscale: 0,
    invert: 0,
    sepia: 0,
    images: null,
  });
  const { action: uploadImage } = useUploadFile();
  const [fileName, setFileName] = useState<string>("New image");
  const [mouseOnCnv, setMouseOnCnv] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<IMousePos>({
    x: 0,
    y: 0,
  });

  const canvasUpd = ({ ...args }) => {
    const img = new Image();
    img.src = args.src?.toString() || "";
    const minImg = new Image();
    minImg.src = args.images;
    const minImgCond =
      !minImg.src.includes("undefined") && !minImg.src.includes("null");
    const animateSizeChange = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const { w, h } = widthCond(img.width, img.height);

      const zoomedW = w + (w * args.zoom) / 100;
      const zoomedH = h + (h * args.zoom) / 100;

      if (canvas) {
        if (!args.rotate) {
          canvas.width = zoomedW < 640 ? zoomedW : 640;
          canvas.height = zoomedH < 640 ? zoomedH : 640;
        } else {
          const c = Math.sqrt(zoomedW ** 2 + zoomedH ** 2);
          canvas.width = c < 640 ? c : 640;
          canvas.height = c < 640 ? c : 640;
        }
        context?.clearRect(0, 0, canvas.width, canvas.height);
        context?.save();
      }
      const x = ((canvas?.width || 0) - (w * args.zoom) / 100 - w) / 2;
      const y = ((canvas?.height || 0) - (h * args.zoom) / 100 - h) / 2;
      if (canvas) {
        context?.translate(canvas.width / 2, canvas.height / 2);
        context?.rotate(args.rotate * (Math.PI / 180));
        context?.translate(-canvas.width / 2, -canvas.height / 2);
      }

      context?.clearRect(0, 0, w, h);
      if (context) {
        context.filter = `blur(${args.blur}px) contrast(${
          args.contr || 1
        }) brightness(${args.brightness || 1}) saturate(${
          args.saturate || 1
        }) grayscale(${args.grayscale}) invert(${args.invert}) sepia(${
          args.sepia
        })`;
      }
      context?.drawImage(img, x, y, zoomedW, zoomedH);
      const { w: minW, h: minH } = widthCond(minImg.width, minImg.height);
      minImgCond &&
        context?.drawImage(
          minImg,
          args.mousePos.x,
          args.mousePos.y,
          minW / 3,
          minH / 3
        );
    };

    img.onload = () => {
      if (minImgCond) minImg.onload = () => animateSizeChange();
      else animateSizeChange();
    };
  };

  const mainAction = (
    type: string,
    event: ChangeEvent<HTMLInputElement> | undefined
  ) => {
    if (type === "delete") {
      setSelectedImg && setSelectedImg(null);
      nulledChng();
    } else if (type === "download") handleDownload();
    else if (type === "upload" && event) handleUpload(event);
  };

  const nulledChng = () => {
    setChanges((prev: any) => {
      numberKeys.forEach((key) => {
        if (!Number.isNaN(prev[key])) prev[key] = 0;
        else {
          prev[key] = [];
        }
      });
      return prev;
    });
  };

  const widthCond = (w: number, h: number) => {
    // if (w < 300 && h < 300) return { w: w * 2, h: h * 2 };
    if (w > canvasSize || h > canvasSize) {
      if (h > w) {
        const perc = ((h - w) / h) * 100;
        const newW = canvasSize - (canvasSize * perc) / 100;
        return { w: newW, h: canvasSize };
      } else if (h < w) {
        const perc = ((w - h) / w) * 100;
        const newH = canvasSize - (canvasSize * perc) / 100;
        return { w: canvasSize, h: newH };
      }
      return { w: canvasSize, h: canvasSize };
    } else return { w: w, h: h };
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (mouseOnCnv && changes.images) {
      const parentRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - parentRect.left;
      const y = e.clientY - parentRect.top;
      setMousePosition({ x: x, y: y });
      canvasUpd({
        src: selectedImg,
        mousePos: { x: x, y: y },
        ...changes,
      });
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas?.toDataURL("image/png");

    const anchor = document.createElement("a");
    anchor.href = image || "";
    anchor.download = `${fileName || "image-" + Date.now()}.png`;

    anchor.click();
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    uploadImage(event).then((file) => {
      setSelectedImg && file && setSelectedImg(file);
      canvasUpd({ src: file, zoom: 0, mousePos: mousePosition });
    });
  };

  const handleSetChanges = (key: string, value: number | boolean) => {
    const change = (value: number) => {
      canvasUpd({
        ...changes,
        src: selectedImg,
        [key]: value,
        mousePos: mousePosition,
      });
    };

    if (typeof value === "number") {
      setChanges((prev) => ({ ...prev, [key]: value }));
      change(value);
    } else {
      setChanges((prev) => ({ ...prev, [key]: value ? 1 : 0 }));
      change(value ? 1 : 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLocaleLowerCase();
    if (key === "z" && e.ctrlKey) {
      handleRest("undo");
    } else if (e.ctrlKey && key === "b") {
      handleRest("redo");
    }
  };

  const handleRest = (type: string, file?: FileT) => {
    if (type === "undo") {
      const [data, action] = undo();
      action();
      canvasUpd({
        src: selectedImg,
        ...changes,
        ...data,
        mousePos: mousePosition,
      });
    } else if (type === "redo") {
      const [data, action] = redo();
      action();
      canvasUpd({
        src: selectedImg,
        ...changes,
        ...data,
        mousePos: mousePosition,
      });
    } else if (type === "add" && file) {
      setMousePosition({ x: 0, y: 0 });

      setChanges((prev) => {
        const data = {
          ...prev,
          images: file,
        };
        canvasUpd({ src: selectedImg, ...data, mousePos: { x: 0, y: 0 } });
        return data;
      });
    }
  };

  useLayoutEffect(() => {
    window.onkeydown = (e) => {
      handleKeyDown(e);
    };
  }, [changes]);

  return (
    <div className="def-container">
      <div className="flex flex-col items-center py-3">
        <div className="relative w-[640px] flex flex-col canvas-box">
          <div className="absolute right-[-160px] top-0">
            <MainFilters changes={changes} onAction={handleSetChanges} />
          </div>
          <div className="flex justify-end">
            <MainUnRe onAction={handleRest} />
          </div>
          <div className="flex items-center">
            <span>File name: </span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-[#1b1b1b] flex-auto relative z-10 p-4"
            />
          </div>
          <div className="w-[640px] h-[640px] flex items-center justify-center relative">
            {!selectedImg ? (
              <div
                className="flex flex-col justify-center cursor-pointer"
                onClick={() => {
                  fileRef?.current?.click();
                }}
              >
                <div>
                  <img src={FolderImg} alt="" />
                </div>
                <div className="text-center">Choose image</div>
              </div>
            ) : (
              <canvas
                className={`${
                  mouseOnCnv && changes.images ? "cursor-grabbing" : ""
                }`}
                ref={canvasRef}
                onMouseUp={() => setMouseOnCnv(false)}
                onMouseMove={(e) => mouseOnCnv && handleMouseMove(e)}
                onMouseDown={() => setMouseOnCnv(true)}
              />
            )}
          </div>
        </div>
        <div className="w-[640px] py-4">
          <MainFunc
            fileRef={fileRef}
            image={selectedImg || null}
            onAction={mainAction}
          />
          <MainPanel
            changes={changes}
            onAction={handleSetChanges}
            disabled={!!selectedImg}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
