export function generateId(): string {
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(36))
    .join("")
    .slice(0, 10);
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const arr = new Uint8Array(5);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

const PLAYER_ID_KEY = "dominoes_player_id";
const NAME_KEY = "dominoes_name";
const ROOM_KEY = "dominoes_room";

export function getPlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getSavedName(): string {
  return localStorage.getItem(NAME_KEY) ?? "";
}

export function saveName(name: string) {
  localStorage.setItem(NAME_KEY, name);
}

export function getSavedRoom(): string | null {
  return sessionStorage.getItem(ROOM_KEY);
}

export function saveRoom(code: string) {
  sessionStorage.setItem(ROOM_KEY, code);
}

export function clearRoom() {
  sessionStorage.removeItem(ROOM_KEY);
}