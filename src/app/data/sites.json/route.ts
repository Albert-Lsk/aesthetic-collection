import { buildSitesJson } from "../../../lib/site-json";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSitesJson(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
