import { useState, ChangeEvent } from "react";
import { FileT } from "../interfaces/main";

const useUploadFile = (): {
  data: FileT;
  action: (e: ChangeEvent<HTMLInputElement>) => Promise<FileT>;
} => {
  const [data, setData] = useState<FileT>(null);

  const action = (e: ChangeEvent<HTMLInputElement>) => {
    return new Promise<FileT>((resolve, reject) => {
      const file = e?.target?.files && e?.target?.files[0];
      const reader = new FileReader();
      if (!file) {
        reject("No file selected");
        return;
      }
      reader.onload = () => {
        const src = reader.result;
        setData(src);
        resolve(src);
      };
      reader.onerror = () => {
        reject("Error reading file");
      };
      reader.readAsDataURL(file);
    });
  };

  return { data, action };
};

export default useUploadFile;
