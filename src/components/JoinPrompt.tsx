import { useState } from "react";
import { getSavedName } from "../lib/utils";

interface JoinPromptProps {
  roomCode: string;
  onJoin: (name: string) => void;
  onCancel: () => void;
}

export default function JoinPrompt({ roomCode, onJoin, onCancel }: JoinPromptProps) {
  const [name, setName] = useState(getSavedName);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-6">
      <div className="w-full max-w-[360px] text-center">
        <h2 className="text-[22px] font-bold mb-1">Join Room</h2>
        <p className="text-sm text-[var(--text-dim)] mb-6">
          Joining room{" "}
          <strong className="text-[var(--blue)] tracking-[2px] font-mono">
            {roomCode}
          </strong>
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onJoin(name)}
          placeholder="Your name"
          maxLength={12}
          autoComplete="off"
          autoFocus
          className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl px-4 py-3.5 text-base text-white text-center outline-none transition-colors focus:border-[var(--blue)] placeholder:text-[var(--text-dim)] w-full mb-4"
        />

        <button
          onClick={() => name.trim() && onJoin(name)}
          className="btn-primary w-full mb-3"
        >
          Join Game
        </button>

        <button
          onClick={onCancel}
          className="text-[var(--text-dim)] text-sm cursor-pointer bg-transparent border-none"
        >
          ← Back to menu
        </button>
      </div>
    </div>
  );
}
