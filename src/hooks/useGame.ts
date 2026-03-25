import { useCallback, useEffect, useRef, useState } from "react";
import {
  ref,
  set,
  onValue,
  off,
  serverTimestamp,
  runTransaction,
  update,
  remove,
  get,
  type Database,
} from "firebase/database";
import { initFirebase, getDb } from "../config/firebase";
import type { PlayerData, RoomData, Screen } from "../lib/types";
import {
  getPlayerId,
  generateRoomCode,
  saveName,
  saveRoom,
  clearRoom,
  getSavedRoom,
} from "../lib/utils";

const playerId = getPlayerId();

interface GameState {
  screen: Screen;
  roomCode: string | null;
  selfData: PlayerData | null;
  opponentData: PlayerData | null;
  toast: string | null;
  loading: boolean;
  onlineAvailable: boolean;
}

export function useGame() {
  const [state, setState] = useState<GameState>({
    screen: "lobby",
    roomCode: null,
    selfData: null,
    opponentData: null,
    toast: null,
    loading: true,
    onlineAvailable: false,
  });

  const roomRefCurrent = useRef<ReturnType<typeof ref> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dbRef = useRef<Database | null>(null);

  const showToast = useCallback((msg: string) => {
    setState((s) => ({ ...s, toast: msg }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setState((s) => ({ ...s, toast: null })),
      2000
    );
  }, []);

  const cleanup = useCallback(() => {
    if (roomRefCurrent.current) {
      off(roomRefCurrent.current);
      roomRefCurrent.current = null;
    }
    clearRoom();
    setState((prev) => ({
      screen: "lobby",
      roomCode: null,
      selfData: null,
      opponentData: null,
      toast: null,
      loading: prev.loading,
      onlineAvailable: prev.onlineAvailable,
    }));
  }, []);

  const listenToRoom = useCallback(
    (roomRef: ReturnType<typeof ref>, code: string) => {
      if (roomRefCurrent.current) off(roomRefCurrent.current);
      roomRefCurrent.current = roomRef;

      onValue(
        roomRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            showToast("Room was deleted");
            cleanup();
            return;
          }

          const data = snapshot.val() as RoomData;
          const players = data.players ?? {};
          const ids = Object.keys(players);

          if (ids.length < 2) {
            setState((prev) => {
              if (prev.screen === "game") showToast("Opponent left the room");
              return {
                ...prev,
                roomCode: code,
                selfData: players[playerId] ?? prev.selfData,
                opponentData: null,
                screen:
                  prev.screen === "game" || prev.screen === "waiting"
                    ? prev.screen
                    : "waiting",
              };
            });
            return;
          }

          const opponentId = ids.find((id) => id !== playerId)!;
          setState((prev) => ({
            ...prev,
            roomCode: code,
            selfData: players[playerId] ?? null,
            opponentData: players[opponentId] ?? null,
            screen: "game",
          }));
        },
        (err) => {
          console.error("Listener error:", err);
          showToast("Connection error");
        }
      );
    },
    [showToast, cleanup]
  );

  // Initialize Firebase + auto-rejoin on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const db = await initFirebase(playerId);
        if (cancelled) return;
        dbRef.current = db;
        setState((prev) => ({ ...prev, onlineAvailable: true }));

        // Try auto-rejoin
        const savedRoom = getSavedRoom();
        if (savedRoom) {
          const roomRef = ref(db, "rooms/" + savedRoom);
          const snapshot = await get(roomRef);
          if (!snapshot.exists()) {
            clearRoom();
          } else {
            const data = snapshot.val() as RoomData;
            const players = data.players ?? {};
            if (!players[playerId]) {
              clearRoom();
            } else {
              const ids = Object.keys(players);
              if (!cancelled) {
                setState((prev) => ({
                  ...prev,
                  roomCode: savedRoom,
                  screen: ids.length < 2 ? "waiting" : "game",
                  loading: false,
                }));
                listenToRoom(roomRef, savedRoom);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error("Firebase init failed:", err);
        if (!cancelled) {
          setState((prev) => ({ ...prev, onlineAvailable: false }));
          showToast("Online mode unavailable — connection failed");
        }
      }

      if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
    }

    init();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (roomRefCurrent.current) off(roomRefCurrent.current);
    };
  }, []);

  const createRoom = useCallback(
    async (name: string) => {
      if (!state.onlineAvailable) {
        showToast("Online mode unavailable");
        return;
      }
      if (!name.trim()) {
        showToast("Enter your name");
        return;
      }
      saveName(name.trim());

      const db = getDb();
      const code = generateRoomCode();
      const roomRef = ref(db, "rooms/" + code);

      await set(roomRef, {
        createdAt: serverTimestamp(),
        players: {
          [playerId]: { name: name.trim(), score: 0, history: [0] },
        },
      });

      saveRoom(code);
      setState((prev) => ({ ...prev, roomCode: code, screen: "waiting" }));
      listenToRoom(roomRef, code);
    },
    [showToast, listenToRoom, state.onlineAvailable]
  );

  const joinRoom = useCallback(
    async (name: string, code: string) => {
      if (!state.onlineAvailable) {
        showToast("Online mode unavailable");
        return;
      }
      if (!name.trim()) {
        showToast("Enter your name");
        return;
      }
      saveName(name.trim());

      const upperCode = code.trim().toUpperCase();
      if (!upperCode) {
        showToast("Enter a room code");
        return;
      }

      const db = getDb();
      const roomRef = ref(db, "rooms/" + upperCode);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        showToast("Room not found");
        return;
      }

      const data = snapshot.val() as RoomData;
      const players = data.players ?? {};
      const ids = Object.keys(players);

      if (ids.includes(playerId)) {
        saveRoom(upperCode);
        setState((prev) => ({
          ...prev,
          roomCode: upperCode,
          screen: ids.length < 2 ? "waiting" : "game",
        }));
        listenToRoom(roomRef, upperCode);
        return;
      }

      if (ids.length >= 2) {
        showToast("Room is full");
        return;
      }

      await set(ref(getDb(), "rooms/" + upperCode + "/players/" + playerId), {
        name: name.trim(),
        score: 0,
        history: [0],
      });

      saveRoom(upperCode);
      setState((prev) => ({ ...prev, roomCode: upperCode, screen: "game" }));
      listenToRoom(roomRef, upperCode);
    },
    [showToast, listenToRoom, state.onlineAvailable]
  );

  const addPoints = useCallback(
    async (points: number) => {
      if (!roomRefCurrent.current || !state.roomCode) return;
      const playerRef = ref(
        getDb(),
        "rooms/" + state.roomCode + "/players/" + playerId
      );
      try {
        await runTransaction(playerRef, (current) => {
          if (!current) return current;
          const history: number[] = current.history ?? [0];
          history.push(points);
          current.history = history;
          current.score = history.reduce((a: number, b: number) => a + b, 0);
          return current;
        });
      } catch {
        showToast("Failed to update score");
      }
    },
    [state.roomCode, showToast]
  );

  const undoLast = useCallback(async () => {
    if (!roomRefCurrent.current || !state.roomCode) return;
    const playerRef = ref(
      getDb(),
      "rooms/" + state.roomCode + "/players/" + playerId
    );
    try {
      const result = await runTransaction(playerRef, (current) => {
        if (!current) return current;
        const history: number[] = current.history ?? [];
        if (history.length <= 1) return undefined;
        history.pop();
        current.history = history;
        current.score = history.reduce((a: number, b: number) => a + b, 0);
        return current;
      });
      if (!result.committed) showToast("Nothing to undo");
    } catch {
      showToast("Failed to undo");
    }
  }, [state.roomCode, showToast]);

  const resetScores = useCallback(async () => {
    if (!roomRefCurrent.current || !state.roomCode) return;

    try {
      const playersRef = ref(getDb(), "rooms/" + state.roomCode + "/players");
      const snapshot = await get(playersRef);
      const players = snapshot.val() as Record<string, PlayerData>;
      const updates: Record<string, number | number[]> = {};
      for (const id of Object.keys(players)) {
        updates[id + "/score"] = 0;
        updates[id + "/history"] = [0];
      }
      await update(playersRef, updates);
      showToast("Scores reset!");
    } catch {
      showToast("Failed to reset");
    }
  }, [state.roomCode, showToast]);

  const leaveRoom = useCallback(async () => {
    if (roomRefCurrent.current && state.roomCode) {
      try {
        await remove(
          ref(getDb(), "rooms/" + state.roomCode + "/players/" + playerId)
        );
      } catch {
        /* room may already be gone */
      }
    }
    cleanup();
  }, [state.roomCode, cleanup]);

  const copyRoomCode = useCallback(() => {
    if (state.roomCode && navigator.clipboard) {
      navigator.clipboard.writeText(state.roomCode).then(() => showToast("Copied!"));
    }
  }, [state.roomCode, showToast]);

  return {
    ...state,
    createRoom,
    joinRoom,
    addPoints,
    undoLast,
    resetScores,
    leaveRoom,
    copyRoomCode,
  };
}