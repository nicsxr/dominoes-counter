import { useState } from "react";
import { getSavedName } from "../lib/utils";

interface LobbyProps {
    onCreateRoom: (name: string) => void;
    onJoinRoom: (name: string, code: string) => void;
    onSoloGame: (team1: string, team2: string) => void;
    onlineAvailable: boolean;
}

export default function Lobby({ onCreateRoom, onJoinRoom, onSoloGame, onlineAvailable }: LobbyProps) {
    const [name, setName] = useState(getSavedName);
    const [roomCode, setRoomCode] = useState("");
    const [mode, setMode] = useState<"menu" | "online" | "solo">("menu");
    const [team1Name, setTeam1Name] = useState("Team 1");
    const [team2Name, setTeam2Name] = useState("Team 2");

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-6">
            <div className="w-full max-w-[360px] text-center">
                <img src="/logo.png" alt="Dominoes Counter" className="w-16 h-16 mx-auto mb-2 drop-shadow-[0_0_20px_rgba(68,138,255,0.3)]" />
                <h1 className="text-[28px] font-bold mb-1">Dominoes Counter</h1>
                <p className="text-sm text-(--text-dim) mb-8">
                    Real-time score tracking
                </p>

                {mode === "menu" && (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => onlineAvailable ? setMode("online") : onCreateRoom("")}
                            className={`btn-primary ${!onlineAvailable ? "opacity-50" : ""}`}
                        >
                            Online Game{!onlineAvailable ? " (unavailable)" : ""}
                        </button>
                        <button onClick={() => setMode("solo")} className="btn-secondary">
                            Local Game
                        </button>
                    </div>
                )}

                {mode === "online" && (
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onCreateRoom(name)}
                            placeholder="Your name"
                            maxLength={12}
                            autoComplete="off"
                            className="bg-(--surface) border-2 border-(--border) rounded-xl px-4 py-3.5 text-base text-white text-center outline-none transition-colors focus:border-[var(--blue)] placeholder:text-[var(--text-dim)]"
                        />

                        <div className="flex items-center gap-3 my-2 text-(--text-dim) text-[13px]">
                            <span className="flex-1 h-px bg-(--border)" />
                            <span>create new room</span>
                            <span className="flex-1 h-px bg-(--border)" />
                        </div>
                        <button
                            onClick={() => onCreateRoom(name)}
                            className="btn-primary"
                        >
                            Create Room
                        </button>

                        <div className="flex items-center gap-3 my-2 text-(--text-dim) text-[13px]">
                            <span className="flex-1 h-px bg-(--border)" />
                            <span>or join existing</span>
                            <span className="flex-1 h-px bg-(--border)" />
                        </div>

                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onJoinRoom(name, roomCode)}
                            placeholder="Room code"
                            maxLength={6}
                            autoComplete="off"
                            className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl px-4 py-3.5 text-base text-white text-center uppercase outline-none transition-colors focus:border-[var(--blue)] placeholder:text-[var(--text-dim)]"
                        />
                        <button
                            onClick={() => onJoinRoom(name, roomCode)}
                            className="btn-secondary"
                        >
                            Join Room
                        </button>

                        <button
                            onClick={() => setMode("menu")}
                            className="text-[var(--text-dim)] text-sm mt-2 cursor-pointer bg-transparent border-none"
                        >
                            ← Back
                        </button>
                    </div>
                )}

                {mode === "solo" && (
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={team1Name}
                            onChange={(e) => setTeam1Name(e.target.value)}
                            placeholder="Team 1 name"
                            maxLength={12}
                            autoComplete="off"
                            className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl px-4 py-3.5 text-base text-white text-center outline-none transition-colors focus:border-[var(--blue)] placeholder:text-[var(--text-dim)]"
                        />
                        <input
                            type="text"
                            value={team2Name}
                            onChange={(e) => setTeam2Name(e.target.value)}
                            placeholder="Team 2 name"
                            maxLength={12}
                            autoComplete="off"
                            className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl px-4 py-3.5 text-base text-white text-center outline-none transition-colors focus:border-[var(--blue)] placeholder:text-[var(--text-dim)]"
                        />
                        <button
                            onClick={() => onSoloGame(team1Name, team2Name)}
                            className="btn-primary"
                        >
                            Start Game
                        </button>

                        <button
                            onClick={() => setMode("menu")}
                            className="text-[var(--text-dim)] text-sm mt-2 cursor-pointer bg-transparent border-none"
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}