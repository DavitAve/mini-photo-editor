import { useState, createContext, FunctionComponent, ReactNode } from "react";

export interface IContextValue {
  selectedImg?: string | ArrayBuffer | null;
  setSelectedImg?: (newValue: string | ArrayBuffer | null) => void;
}

const Context = createContext<IContextValue | undefined>(undefined);

export const ContextProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedImg, setSelectedImg] = useState<string | ArrayBuffer | null>(
    null
  );
  const contextValue: IContextValue = {
    selectedImg,
    setSelectedImg,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default Context;
