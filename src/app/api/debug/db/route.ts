import { NextResponse } from "next/server";

function getDatabaseSummary() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return {
      configured: false,
      error: "DATABASE_URL is not set",
    };
  }

  try {
    const parsed = new URL(url);

    return {
      configured: true,
      protocol: parsed.protocol.replace(":", ""),
      host: parsed.hostname,
      port: parsed.port || "default",
      database: parsed.pathname.replace(/^\//, "") || null,
      username: parsed.username || null,
    };
  } catch {
    return {
      configured: false,
      error: "DATABASE_URL is not a valid URL",
    };
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    runtime: getDatabaseSummary(),
    nodeEnv: process.env.NODE_ENV || null,
  });
}
