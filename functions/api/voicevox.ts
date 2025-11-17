// Cloudflare Pages Functions version of Voicevox proxy
// Route: /api/voicevox (POST)
// Expects JSON { message: string, speaker?: string }
// Returns JSON { audio: base64wav }

// Use an explicit type (Cloudflare Pages provides env, request, etc.)
// We avoid referencing PagesFunction to keep TS from erroring without DOM lib types.
export const onRequestPost = async (context: { env: Record<string,string>; request: Request }) => {
  const { env, request } = context as any;
  const apiKey = env.VOICEVOX_KEY;
  if (!apiKey) {
    return json({ message: "VOICEVOX_KEY not set on server" }, 500);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (_) {
    return json({ message: "Invalid JSON body" }, 400);
  }

  const message: string = body.message;
  if (!message) {
    return json({ message: "message is required" }, 400);
  }
  const speaker: string = body.speaker || "3"; // default speaker

  try {
    const endpointUrl = "https://deprecatedapis.tts.quest/v2/voicevox/audio/";
    const query = new URLSearchParams({ key: apiKey, text: message, speaker });
    const upstream = await fetch(`${endpointUrl}?${query}`, { method: "POST" });

    if (!upstream.ok) {
      const text = await upstream.text();
      return json({ message: `Voicevox upstream error: ${text}` }, upstream.status);
    }

    const arrayBuffer = await upstream.arrayBuffer();
    // Convert ArrayBuffer to base64 without stack overflow (chunk processing)
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    const base64 = btoa(binary);
    return json({ audio: base64 });
  } catch (e: any) {
    return json({ message: e?.message || "Voicevox proxy error" }, 500);
  }
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
