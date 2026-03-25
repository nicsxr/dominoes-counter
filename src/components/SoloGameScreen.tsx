import { useState } from "react";
import type { PlayerData } from "../lib/types";
import ScoreCard from "./ScoreCard";

const POINT_VALUES = [5, 10, 15, 20, 25, 30] as const;

type TeamKey = "team1" | "team2";

interface SoloGameScreenProps {
  team1: PlayerData;
  team2: PlayerData;
  onAddPoints: (team: TeamKey, points: number) => void;
  onUndo: (team: TeamKey) => void;
  onReset: () => void;
  onLeave: () => void;
}

export default function SoloGameScreen({
  team1,
  team2,
  onAddPoints,
  onUndo,
  onReset,
  onLeave,
}: SoloGameScreenProps) {
  const [selected, setSelected] = useState<TeamKey>("team1");

  const selectedData = selected === "team1" ? team1 : team2;

  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-3 gap-0">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-[400px] pb-2">
        <span className="text-[13px] text-[var(--text-dim)] bg-[var(--surface)] px-3 py-1.5 rounded-lg">
          Local Game
        </span>
        <button
          onClick={onLeave}
          className="bg-[var(--surface)] border-none text-[var(--text-dim)] text-lg w-9 h-9 rounded-lg cursor-pointer flex items-center justify-center transition-colors active:bg-[var(--red)] active:text-white"
          title="Leave"
        >
          ✕
        </button>
      </div>

      {/* Scoreboard — tap to select */}
      <div className="w-full max-w-[400px] flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
        <ScoreCard
          name={team1.name}
          score={team1.score}
          variant={selected === "team1" ? "self" : "opponent"}
          selected={selected === "team1"}
          onClick={() => setSelected("team1")}
        />

        <div className="text-[13px] font-bold text-[var(--text-dim)] bg-[var(--surface)] w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10">
          VS
        </div>

        <ScoreCard
          name={team2.name}
          score={team2.score}
          variant={selected === "team2" ? "self" : "opponent"}
          selected={selected === "team2"}
          onClick={() => setSelected("team2")}
        />
      </div>

      {/* Controls for selected team */}
      <div className="w-full max-w-[400px] pt-3 pb-2 shrink-0">
        <p className="text-center text-xs text-[var(--text-dim)] mb-2">
          Adding to <strong className="text-white">{selectedData.name}</strong>
        </p>
        <div className="grid grid-cols-3 gap-2.5 mb-2.5">
          {POINT_VALUES.map((pts) => (
            <button
              key={pts}
              onClick={() => onAddPoints(selected, pts)}
              className="bg-[var(--green)] text-white text-[22px] max-[640px]:text-[18px] font-bold py-[22px] max-[640px]:py-4 border-none rounded-[14px] cursor-pointer transition-transform active:scale-[0.93] active:bg-[var(--green-dark)]"
            >
              +{pts}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              if (window.confirm("Reset both scores to 0?")) onReset();
            }}
            className="bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--text-dim)] text-sm font-semibold py-3 rounded-xl cursor-pointer transition-transform active:scale-[0.97] active:bg-[var(--surface-light)]"
          >
            New Game
          </button>
          <button
            onClick={() => {
              if (window.confirm("Undo last score?")) onUndo(selected);
            }}
            className="bg-[var(--orange)] text-white text-[15px] font-bold py-3 border-none rounded-xl cursor-pointer transition-transform active:scale-[0.93] active:bg-[#e68200]"
          >
            ↩ Undo
          </button>
        </div>
      </div>
    </div>
  );
}