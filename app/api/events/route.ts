import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { isBotUserAgent } from "@/lib/events";

const MAX_PAYLOAD_BYTES = 2048; // 2 KB

const eventPayloadSchema = z.object({
  type: z.enum(["wa_click", "product_view"]),
  productId: z.number().int().positive().optional().nullable(),
});

// In-memory rate limiting: IP -> { count, expiresAt }
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const MAX_REQUESTS_PER_WINDOW = 30; // 30 event per menit per IP
const ipRateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  // Bersihkan record kadaluwarsa sesekali
  if (ipRateLimitMap.size > 2000) {
    for (const [key, val] of ipRateLimitMap.entries()) {
      if (val.expiresAt < now) ipRateLimitMap.delete(key);
    }
  }

  if (!record || record.expiresAt < now) {
    ipRateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: NextRequest): Promise<Response> {
  const userAgent = request.headers.get("user-agent");
  if (isBotUserAgent(userAgent)) {
    return new Response(null, { status: 204 });
  }

  // Cek ukuran payload
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  // Cek IP untuk rate limiting (tanpa menyimpannya ke database)
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  if (isRateLimited(clientIp)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const json = JSON.parse(rawBody);
    const parsed = eventPayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
    }

    const { type, productId } = parsed.data;

    db.insert(events)
      .values({
        type,
        productId: productId ?? null,
        createdAt: sql`(unixepoch())`,
      })
      .run();

    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

