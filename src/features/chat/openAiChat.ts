import { Message } from "../messages/messages";

// getChatResponse は非ストリーミング用（現在未使用）
export async function getChatResponse(messages: Message[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return { message: data.message as string };
}

// Workers(サーバー)側の秘密鍵を使ったストリーミングをプロキシするエンドポイントへ接続
// apiKey 引数は後方互換のため残すが無視する。
export async function getChatResponseStream(messages: Message[], _apiKey: string) {
  const res = await fetch("/api/chatStream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Streaming upstream error");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = decoder.decode(value);
          const chunks = data
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");
          for (const chunk of chunks) {
            try {
              const json = JSON.parse(chunk);
              const messagePiece = json.choices?.[0]?.delta?.content;
              if (messagePiece) controller.enqueue(messagePiece);
            } catch (_e) {
              // 解析失敗は握りつぶす（OpenAIのkeep-alive等）
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
  return stream;
}
