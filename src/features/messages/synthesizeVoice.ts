import { reduceTalkStyle } from "@/utils/reduceTalkStyle";
import { koeiromapV0 } from "../koeiromap/koeiromap";
import { TalkStyle } from "../messages/messages";

export async function synthesizeVoice(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle
) {
  const koeiroRes = await koeiromapV0(message, speakerX, speakerY, style);
  return { audio: koeiroRes.audio };
}

export async function synthesizeVoicevox(
  message: string,
  apiKey: string,
) {
  const endpointUrl = "https://deprecatedapis.tts.quest/v2/voicevox/audio/";

  const query_params = {
    key: apiKey,
    text: message,
    speaker: "3",
  }

  const query = new URLSearchParams(query_params);

  const voicevoxResponse = await fetch(
    `${endpointUrl}?${query}`,
    { method: "POST" },
  );

  return { audio: await voicevoxResponse.blob() };
}

export async function synthesizeVoiceApi(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle,
  apiKey: string
) {
  // Free向けに感情を制限する
  const reducedStyle = reduceTalkStyle(style);

  const body = {
    message: message,
    speakerX: speakerX,
    speakerY: speakerY,
    style: reducedStyle,
    apiKey: apiKey,
  };

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as any;

  return { audio: data.audio };
}
