import { useCallback, useRef, useState } from "react";
import type { PlayerData } from "../lib/types";

interface SoloState {
  team1: PlayerData;
  team2: PlayerData;
  toast: string | null;
}

export function useSoloGame() {
  const [state, setState] = useState<SoloState>({
    team1: { name: "Team 1", score: 0, history: [0] },
    team2: { name: "Team 2", score: 0, history: [0] },
    toast: null,
  });

  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((msg: string) => {
    setState((s) => ({ ...s, toast: msg }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setState((s) => ({ ...s, toast: null })),
      2000
    );
  }, []);

  const startGame = useCallback((name1: string, name2: string) => {
    setState({
      team1: { name: name1 || "Team 1", score: 0, history: [0] },
      team2: { name: name2 || "Team 2", score: 0, history: [0] },
      toast: null,
    });
  }, []);

  const addPoints = useCallback((team: "team1" | "team2", points: number) => {
    setState((prev) => {
      const player = { ...prev[team] };
      const history = [...player.history, points];
      player.history = history;
      player.score = history.reduce((a, b) => a + b, 0);
      return { ...prev, [team]: player };
    });
  }, []);

  const undoLast = useCallback((team: "team1" | "team2") => {
    setState((prev) => {
      const player = { ...prev[team] };
      if (player.history.length <= 1) {
        return prev;
      }
      const history = player.history.slice(0, -1);
      player.history = history;
      player.score = history.reduce((a, b) => a + b, 0);
      return { ...prev, [team]: player };
    });
  }, []);

  const resetScores = useCallback(() => {
    setState((prev) => ({
      ...prev,
      team1: { ...prev.team1, score: 0, history: [0] },
      team2: { ...prev.team2, score: 0, history: [0] },
    }));
    showToast("Scores reset!");
  }, [showToast]);

  return {
    ...state,
    startGame,
    addPoints,
    undoLast,
    resetScores,
    showToast,
  };
}