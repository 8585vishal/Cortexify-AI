export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Allowed image filenames
const ALLOWED_FILES = new Set(["01.webp", "02.webp", "03.jpg"]);

// Root directory for images
const IMAGE_DIR = "C:/Users/visha/Desktop/Cortexify-AI/images";

export async function GET(_req: NextRequest, { params }: { params: { file: string } }) {
  const fileName = decodeURIComponent(params.file);

  // Validate allowed file list
  if (!ALLOWED_FILES.has(fileName)) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Build absolute image path
  const filePath = path.resolve(IMAGE_DIR, fileName);

  // Read file safely
  let fileBuffer: Buffer;
  try {
    fileBuffer = await readFile(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  // Detect content type
  const contentType =
    fileName.endsWith(".webp") ? "image/webp" :
    fileName.endsWith(".jpg")  ? "image/jpeg" :
    "application/octet-stream";

  // Return the image
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

