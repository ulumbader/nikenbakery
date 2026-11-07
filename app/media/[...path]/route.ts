import { promises as fs } from "node:fs";
import path from "node:path";
import { getUploadDir } from "@/lib/upload";

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
};

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { path: pathSegments } = await context.params;

  if (!pathSegments || pathSegments.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const uploadDir = getUploadDir();
  const requestedFile = path.join(...pathSegments);
  const resolvedPath = path.resolve(uploadDir, requestedFile);

  // Blokir upaya Path Traversal (misal: /media/../../etc/passwd)
  if (!resolvedPath.startsWith(uploadDir)) {
    return new Response("Forbidden: Path traversal detected", { status: 403 });
  }

  try {
    const fileStat = await fs.stat(resolvedPath);
    if (!fileStat.isFile()) {
      return new Response("Not Found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": fileStat.size.toString(),
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
