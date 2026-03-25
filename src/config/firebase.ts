import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

let app: FirebaseApp | null = null;
let database: Database | null = null;
let initialized = false;

export async function initFirebase(playerId: string): Promise<Database> {
  if (initialized && database) return database;

  // Fetch public config from backend
  const configRes = await fetch(`${API_URL}/api/config`);
  if (!configRes.ok) throw new Error("Failed to fetch Firebase config");
  const config = await configRes.json();

  app = initializeApp(config);
  database = getDatabase(app);

  // Get custom auth token from backend
  const authRes = await fetch(`${API_URL}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId }),
  });
  if (!authRes.ok) throw new Error("Failed to get auth token");
  const { token } = await authRes.json();

  // Sign in with the custom token
  const auth = getAuth(app);
  await signInWithCustomToken(auth, token);

  initialized = true;
  return database;
}

export function getDb(): Database {
  if (!database) throw new Error("Firebase not initialized. Call initFirebase() first.");
  return database;
}