import { createContext, useContext } from "react";

export type TimerContextType = {
  tempo: number;
  rodando: boolean;
  sessaoAtiva: boolean;
  setTempo: (t: number) => void;
  setRodando: (r: boolean) => void;
  setSessaoAtiva: (s: boolean) => void;
};

export const TimerContext = createContext<TimerContextType>({
  tempo: 0,
  rodando: false,
  sessaoAtiva: false,
  setTempo: () => {},
  setRodando: () => {},
  setSessaoAtiva: () => {},
});

export const useTimer = () => useContext(TimerContext);