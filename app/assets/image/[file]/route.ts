export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ALLOWED_FILES = new Set(["01.webp", "02.webp", "03.jpg"]);

export async function GET(
  _req: NextRequest,
  context: { params: { file: string } }
) {
  const fileName = decodeURIComponent(context.params.file);

  // Validate allowed list
  if (!ALLOWED_FILES.has(fileName)) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Local folder path
  const filePath = path.resolve(
    "C:/Users/visha/Desktop/Cortexify-AI/images",
    fileName
  );

  let buffer: Buffer;

  try {
    buffer = await readFile(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  // Content type
  const contentType = fileName.endsWith(".webp")
    ? "image/webp"
    : fileName.endsWith(".jpg")
    ? "image/jpeg"
    : "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
