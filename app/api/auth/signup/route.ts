export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readUsers, writeUsers, type User } from "@/lib/store";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const trimmedEmail = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const users = await readUsers();
  if (users.find((u) => u.email === trimmedEmail)) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const { salt, hash } = hashPassword(password);
  const user: User = { email: trimmedEmail, salt, hash, createdAt: new Date().toISOString() };
  users.push(user);
  await writeUsers(users);

  const token = createSession(trimmedEmail);
  const res = NextResponse.json({ ok: true });
  const isHttps = new URL(req.url).protocol === "https:";
  res.cookies.set("cortexify_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}