"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PickCtx = {
  pick: string;
  setPick: (title: string) => void;
};

const Ctx = createContext<PickCtx>({ pick: "", setPick: () => {} });

export function PickProvider({ children }: { children: ReactNode }) {
  const [pick, setPickState] = useState("");
  const setPick = useCallback((title: string) => setPickState(title), []);
  const value = useMemo(() => ({ pick, setPick }), [pick, setPick]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePick() {
  return useContext(Ctx);
}
