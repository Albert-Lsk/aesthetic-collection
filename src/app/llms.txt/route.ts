import { buildLlmsText } from "../../lib/llms";

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "Cache-Control": "public max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
