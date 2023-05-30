import {
  FunctionComponent,
  useRef,
  useEffect,
  ChangeEvent,
  useState,
} from "react";
import FolderImg from "../assets/images/folder.png";
import MainFunc from "./MainFunc";

const canvasSize = 640;

const Main: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("New image");
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  const canvasUpd = (image: string | ArrayBuffer | null) => {
    const img = new Image();
    let requestId = 0;
    img.src = image as string;
    const animateSizeChange = () => {
      const { w, h } = widthCond(img.width, img.height);
      const x = ((canvas?.width || 0) - (w * zoom) / 100 - w) / 2;
      const y = ((canvas?.height || 0) - (h * zoom) / 100 - h) / 2;
      context?.clearRect(0, 0, w, h);
      context?.drawImage(img, x, y, w + (w * zoom) / 100, h + (h * zoom) / 100);
      requestId = requestAnimationFrame(animateSizeChange);
    };
    img.onload = async () => {
      animateSizeChange();
    };

    if (canvas) {
      const { w, h } = widthCond(img.width, img.height);
      canvas.width = w;
      canvas.height = h;
    }
    cancelAnimationFrame(requestId);
  };

  const mainAction = (
    type: string,
    event: ChangeEvent<HTMLInputElement> | undefined
  ) => {
    if (type === "delete") setSelectedImage(null);
    else if (type === "download") handleDownload();
    else if (type === "upload" && event) handleUpload(event);
  };

  const widthCond = (w: number, h: number) => {
    if (w < 300 && h < 300) return { w: w * 2, h: h * 2 };
    else if (w > canvasSize || h > canvasSize) {
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
    const file = event.target.files && event?.target?.files[0];
    const reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.onload = () => {
      canvasUpd(reader.result);
      setSelectedImage(reader.result);
    };
  };

  useEffect(() => {
    canvasUpd(selectedImage);
  }, [selectedImage, zoom]);

  return (
    <div className="def-container">
      <div className="flex flex-col items-center py-3">
        <div className="flex flex-col canvas-box">
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
            {!selectedImage ? (
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
              <canvas ref={canvasRef} className="transition-all" />
            )}
          </div>
        </div>
        <div className="w-[640px] py-4">
          <MainFunc
            fileRef={fileRef}
            image={selectedImage}
            onAction={mainAction}
          />
          <div className="flex gap-6">
            <div>Zoom</div>
            <input
              defaultValue={0}
              type="range"
              className="flex-auto"
              min="-90"
              max="100"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
