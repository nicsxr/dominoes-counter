import { useState } from "react";
import Lobby from "./components/Lobby";
import WaitingRoom from "./components/WaitingRoom";
import GameScreen from "./components/GameScreen";
import SoloGameScreen from "./components/SoloGameScreen";
import Toast from "./components/Toast";
import { useGame } from "./hooks/useGame";
import { useSoloGame } from "./hooks/useSoloGame";

export default function App() {
  const [mode, setMode] = useState<"none" | "online" | "solo">("none");

  const online = useGame();
  const solo = useSoloGame();

  const toast = mode === "solo" ? solo.toast : online.toast;

  function handleSoloGame(team1: string, team2: string) {
    solo.startGame(team1, team2);
    setMode("solo");
  }

  function handleOnlineCreate(name: string) {
    setMode("online");
    online.createRoom(name);
  }

  function handleOnlineJoin(name: string, code: string) {
    setMode("online");
    online.joinRoom(name, code);
  }

  const showLobby = mode === "none" || (mode === "online" && online.screen === "lobby");

  return (
    <>
      {mode !== "solo" && online.loading ? (
        <div className="flex items-center justify-center min-h-dvh">
          <div className="w-12 h-12 border-4 border-(--border)] border-t-(--blue)] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {showLobby && (
            <Lobby
              onCreateRoom={handleOnlineCreate}
              onJoinRoom={handleOnlineJoin}
              onSoloGame={handleSoloGame}
              onlineAvailable={online.onlineAvailable}
            />
          )}

          {mode === "online" && online.screen === "waiting" && online.roomCode && (
            <WaitingRoom
              roomCode={online.roomCode}
              onCopy={online.copyRoomCode}
              onLeave={() => { online.leaveRoom(); setMode("none"); }}
            />
          )}

          {mode === "online" && online.screen === "game" && online.roomCode && online.selfData && online.opponentData && (
            <GameScreen
              roomCode={online.roomCode}
              selfData={online.selfData}
              opponentData={online.opponentData}
              onAddPoints={online.addPoints}
              onUndo={online.undoLast}
              onReset={online.resetScores}
              onLeave={() => { online.leaveRoom(); setMode("none"); }}
            />
          )}

          {mode === "solo" && (
            <SoloGameScreen
              team1={solo.team1}
              team2={solo.team2}
              onAddPoints={solo.addPoints}
              onUndo={solo.undoLast}
              onReset={solo.resetScores}
              onLeave={() => setMode("none")}
            />
          )}
        </>
      )}

      <Toast message={toast} />
    </>
  );
}