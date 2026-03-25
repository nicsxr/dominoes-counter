import type { PlayerData } from "../lib/types";
import ScoreCard from "./ScoreCard";

const POINT_VALUES = [5, 10, 15, 20, 25, 30] as const;

interface GameScreenProps {
  roomCode: string;
  selfData: PlayerData;
  opponentData: PlayerData;
  onAddPoints: (points: number) => void;
  onUndo: () => void;
  onReset: () => void;
  onLeave: () => void;
}

export default function GameScreen({
  roomCode,
  selfData,
  opponentData,
  onAddPoints,
  onUndo,
  onReset,
  onLeave,
}: GameScreenProps) {
  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-3 gap-0">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-[400px] pb-2">
        <span className="text-[13px] text-[var(--text-dim)] bg-[var(--surface)] px-3 py-1.5 rounded-lg">
          Room:{" "}
          <strong className="text-[var(--blue) tracking-[2px]">
            {roomCode}
          </strong>
        </span>
        <button
          onClick={onLeave}
          className="bg-[var(--surface)] border-none text-[var(--text-dim)] text-lg w-9 h-9 rounded-lg cursor-pointer flex items-center justify-center transition-colors active:bg-[var(--red)] active:text-white"
          title="Leave room"
        >
          ✕
        </button>
      </div>

      {/* Scoreboard */}
      <div className="w-full max-w-[400px] flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
        <ScoreCard name={opponentData.name} score={opponentData.score} variant="opponent" />

        {/* VS */}
        <div className="text-[13px] font-bold text-[var(--text-dim)] bg-[var(--surface)] w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10">
          VS
        </div>

        <ScoreCard name={selfData.name} score={selfData.score} variant="self" />
      </div>

      {/* Controls */}
      <div className="w-full max-w-[400px] pt-3 pb-2 shrink-0">
        <div className="grid grid-cols-3 gap-2.5 mb-2.5">
          {POINT_VALUES.map((pts) => (
            <button
              key={pts}
              onClick={() => onAddPoints(pts)}
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
              if (window.confirm("Undo last score?")) onUndo();
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