import {
  FunctionComponent,
  useRef,
  ChangeEvent,
  useState,
  useLayoutEffect,
  useContext,
} from "react";
import useHistoryState from "../hooks/useHistoryState";
import { IChanges } from "../interfaces/main";
import FolderImg from "../assets/images/folder.png";
import MainFunc from "./MainFunc";
import MainPanel from "./MainPanel";
import MainFilters from "./MainFilters";
import MainUnRe from "./MainUnRe";
import Context from "./Context";

const canvasSize = 630;

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
  });
  const [fileName, setFileName] = useState<string>("New image");

  const canvasUpd = ({ ...args }) => {
    const img = new Image();
    img.src = args.src?.toString() || "";

    const animateSizeChange = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const { w, h } = widthCond(img.width, img.height);
      if (canvas) {
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        context?.clearRect(0, 0, canvas.width, canvas.height);
        context?.save();
      }
      const x = ((canvas?.width || 0) - (w * args.zoom) / 100 - w) / 2;
      const y = ((canvas?.height || 0) - (h * args.zoom) / 100 - h) / 2;

      context?.translate(canvasSize / 2, canvasSize / 2);
      context?.rotate(args.rotate * (Math.PI / 180));
      context?.translate(-canvasSize / 2, -canvasSize / 2);
      context?.clearRect(0, 0, w, h);
      if (context)
        context.filter = `blur(${args.blur}px) contrast(${
          args.contr || 1
        }) brightness(${args.brightness || 1}) saturate(${
          args.saturate || 1
        }) grayscale(${args.grayscale}) invert(${args.invert}) sepia(${
          args.sepia
        })`;

      context?.drawImage(
        img,
        x,
        y,
        w + (w * args.zoom) / 100,
        h + (h * args.zoom) / 100
      );
    };

    img.onload = () => animateSizeChange();
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
    setChanges((prev) => {
      Object.keys(prev).forEach((key) => (prev[key as keyof IChanges] = 0));
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

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas?.toDataURL("image/png");

    const anchor = document.createElement("a");
    anchor.href = image || "";
    anchor.download = `${fileName || "image-" + Date.now()}.png`;

    anchor.click();
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    const reader = new FileReader();
    if (file) reader.readAsDataURL(file);

    reader.onload = () => {
      nulledChng();
      setSelectedImg && setSelectedImg(reader.result);
      canvasUpd({ src: reader.result, zoom: 0 });
    };
  };

  const handleSetChanges = (key: string, value: number | boolean) => {
    const change = (value: number) => {
      canvasUpd({
        ...changes,
        src: selectedImg,
        [key]: value,
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
  const handleRest = (type: string) => {
    if (type === "undo") {
      const [data, act] = undo();
      act();
      canvasUpd({ src: selectedImg, ...changes, ...data });
    } else {
      const [data, act] = redo();
      act();
      canvasUpd({ src: selectedImg, ...changes, ...data });
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
          <div className="w-[640px] h-[640px] flex items-center justify-center">
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
              <canvas ref={canvasRef} />
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
