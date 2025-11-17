// Cloudflare Pages Functions version of streaming Chat proxy
// Route: /api/chatStream (POST)
// Body: { messages: OpenAIChatMessage[] }
// Streams OpenAI ChatCompletion SSE directly back to client without exposing API key.

interface ChatMessage { role: string; content: string }

export const onRequestPost = async (context: { env: Record<string,string>; request: Request }) => {
  const { env, request } = context as any;
  const apiKey = env.OPENAI_KEY;
  if (!apiKey) {
    return json({ message: "OPENAI_KEY not set" }, 500);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (_) {
    return json({ message: "Invalid JSON body" }, 400);
  }
  const messages: ChatMessage[] = body.messages;
  if (!messages || !Array.isArray(messages)) {
    return json({ message: "messages must be an array" }, 400);
  }

  // Upstream streaming request
  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      stream: true,
      max_tokens: 200,
    }),
  });

  if (!upstream.body || upstream.status !== 200) {
    const text = await upstream.text();
    return json({ message: `OpenAI upstream error: ${text}` }, upstream.status);
  }

  // Pipe upstream ReadableStream to client; avoid parsing to keep original format ("data:" lines).
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const reader = upstream.body.getReader();

  (async () => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) await writer.write(value);
      }
    } catch (e) {
      console.error(e);
    } finally {
      await writer.close();
      reader.releaseLock();
    }
  })();

  // NOTE: Cannot set Connection header in Workers; keep minimal SSE headers.
  return new Response(readable, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "text/event-stream",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked", // may be ignored but hints streaming
    },
  });
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
