import { useCallback, useState } from "react";

type InitialValueType<T> = T | ((prev: T) => T);

type ReturnValueType<T> = [
  T,
  (data: InitialValueType<T>) => void,
  () => UndoT<T>,
  () => UndoT<T>
];

type UndoT<T> = [T, () => void];

const useHistoryState: <T>(initialState: T) => ReturnValueType<T> = <T,>(
  initialState: T
) => {
  const [state, _setState] = useState<T>(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);
  const [pointer, setPointer] = useState<number>(0);

  const undo = useCallback(() => {
    const action = () => {
      if (pointer > 0) {
        _setState(history[pointer - 1]);
        setPointer((prev) => prev - 1);
      }
    };
    return [history[pointer - 1], action] as UndoT<T>;
  }, [state, pointer]);

  const redo = useCallback(() => {
    const action = () => {
      if (pointer + 1 < history.length) {
        _setState(history[pointer + 1]);
        setPointer((prev) => prev + 1);
      }
    };
    return [history[pointer + 1], action] as UndoT<T>;
  }, [state, pointer]);

  const setState = (data: InitialValueType<T>) => {
    let valueToAdd = data;
    if (typeof data === "function") {
      valueToAdd = (data as (prev?: T) => T)(state);
    }
    setHistory((prev) => [...prev, valueToAdd as T]);
    _setState(data);
    setPointer((prev) => prev + 1);
  };

  return [state, setState, undo, redo];
};

export default useHistoryState;
