export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["01.webp", "02.webp", "03.jpg"]);

export async function GET(_: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = decodeURIComponent(file);
  if (!ALLOWED.has(name)) return new NextResponse("Not found", { status: 404 });
  const p = path.join("C:\\Users\\visha\\Desktop\\Cortexify-AI\\images", name);
  const buf = await readFile(p).catch(() => null);
  if (!buf) return new NextResponse("Not found", { status: 404 });
  const ct = name.endsWith(".webp") ? "image/webp" : name.endsWith(".jpg") ? "image/jpeg" : "application/octet-stream";
  return new NextResponse(buf as any, { headers: { "Content-Type": ct, "Cache-Control": "public, max-age=3600" } });
}