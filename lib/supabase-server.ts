// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export function createServerSupabase(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = new Map(
    cookieHeader.split(";").map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      return [name, rest.join("=")];
    })
  );

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies.get(name);
        },
      },
    }
  );
}
