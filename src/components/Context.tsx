import { useState, createContext, FunctionComponent, ReactNode } from "react";
import { FileT } from "../interfaces/main";

export interface IContextValue {
  selectedImg?: FileT;
  setSelectedImg?: (newValue: FileT) => void;
}

const Context = createContext<IContextValue | undefined>(undefined);

export const ContextProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedImg, setSelectedImg] = useState<FileT>(null);
  const contextValue: IContextValue = {
    selectedImg,
    setSelectedImg,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default Context;
