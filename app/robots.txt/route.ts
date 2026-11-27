import { isAeoV1Enabled } from "@/lib/aeo/flag";

export function GET() {
  if (!isAeoV1Enabled()) return new Response(null, { status: 404 });

  return new Response("User-agent: *\nAllow: /\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
