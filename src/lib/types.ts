export interface PlayerData {
  name: string;
  score: number;
  history: number[];
}

export interface RoomData {
  createdAt: number;
  players: Record<string, PlayerData>;
}

export type Screen = "lobby" | "waiting" | "game";