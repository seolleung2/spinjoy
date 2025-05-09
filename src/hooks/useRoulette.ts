import { useContext } from "react";
import { RouletteContext } from "../contexts/RouletteContext";

export function useRoulette() {
  const context = useContext(RouletteContext);
  if (!context) {
    throw new Error("useRoulette must be used within a RouletteProvider");
  }
  return context;
}
