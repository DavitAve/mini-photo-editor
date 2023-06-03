import { LegacyRef, useEffect, useRef } from "react";

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref?.current?.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback]);

  return ref as LegacyRef<HTMLDivElement> | undefined;
};

export default useOutsideClick;
