export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readUsers } from "@/lib/store";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const trimmedEmail = email.trim().toLowerCase();

  const users = await readUsers();
  const user = users.find((u) => u.email === trimmedEmail);
  console.log(`Login attempt for email: ${trimmedEmail}, user found: ${!!user}`);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const passwordMatch = verifyPassword(password, user.salt, user.hash);
  console.log(`Password verification result for ${trimmedEmail}: ${passwordMatch}`);
  if (!passwordMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const token = createSession(trimmedEmail);
  const res = NextResponse.json({ ok: true });
  const isHttps = new URL(req.url).protocol === "https:";
  res.cookies.set("cortexify_session", token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
