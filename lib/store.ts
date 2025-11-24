import { promises as fs } from "fs";
import path from "path";

export type User = { email: string; salt: string; hash: string; createdAt: string };

const DATA_PATH = path.join(process.cwd(), "data", "users.json");

export async function ensureStore() {
  try {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, "[]", "utf8");
  }
}

export async function readUsers(): Promise<User[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw || "[]");
}

export async function writeUsers(users: User[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), "utf8");
}