import { useState } from "react";
import Lobby from "./components/Lobby";
import WaitingRoom from "./components/WaitingRoom";
import GameScreen from "./components/GameScreen";
import SoloGameScreen from "./components/SoloGameScreen";
import JoinPrompt from "./components/JoinPrompt";
import Toast from "./components/Toast";
import { useGame } from "./hooks/useGame";
import { useSoloGame } from "./hooks/useSoloGame";
import { getRoomUrl, getSavedName } from "./lib/utils";

export default function App() {
  const [mode, setMode] = useState<"none" | "online" | "solo">("none");

  const online = useGame();
  const solo = useSoloGame();

  // Derive effective mode: if useGame auto-rejoined a room, treat as online
  const effectiveMode =
    mode === "none" && !online.loading && online.screen !== "lobby"
      ? "online"
      : mode;

  const toast = effectiveMode === "solo" ? solo.toast : online.toast;

  // Show join prompt when useGame detected a URL room code and needs a name
  const showJoinPrompt =
    online.pendingLinkCode !== null && !online.loading && online.onlineAvailable && !getSavedName();

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

  function handleLinkJoin(name: string) {
    if (!online.pendingLinkCode) return;
    online.joinViaLink(name);
    setMode("online");
  }

  function handleShareLink() {
    if (!online.roomCode) return;
    const url = getRoomUrl(online.roomCode);
    if (navigator.share) {
      navigator.share({ title: "Join my Dominoes game", url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => online.copyRoomCode());
    }
  }

  const showLobby =
    !showJoinPrompt &&
    (effectiveMode === "none" || (effectiveMode === "online" && online.screen === "lobby"));

  return (
    <>
      {effectiveMode !== "solo" && online.loading ? (
        <div className="flex items-center justify-center min-h-dvh">
          <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--blue)] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {showJoinPrompt && (
            <JoinPrompt
              roomCode={online.pendingLinkCode!}
              onJoin={handleLinkJoin}
              onCancel={() => { online.clearPendingLink(); }}
            />
          )}

          {showLobby && (
            <Lobby
              onCreateRoom={handleOnlineCreate}
              onJoinRoom={handleOnlineJoin}
              onSoloGame={handleSoloGame}
              onlineAvailable={online.onlineAvailable}
            />
          )}

          {effectiveMode === "online" && online.screen === "waiting" && online.roomCode && (
            <WaitingRoom
              roomCode={online.roomCode}
              onCopy={online.copyRoomCode}
              onLeave={() => { online.leaveRoom(); setMode("none"); }}
              onShareLink={handleShareLink}
            />
          )}

          {effectiveMode === "online" && online.screen === "game" && online.roomCode && online.selfData && online.opponentData && (
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

          {effectiveMode === "solo" && (
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