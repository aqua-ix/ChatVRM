# ずんだもんBOT

ずんだもんBOTはブラウザでずんだもんと会話ができるWebアプリケーションです。

各機能は主に以下の技術を使用しています。

- ユーザーの音声の認識
  - [Web Speech API(SpeechRecognition)](https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition)
- 返答文の生成
  - [OpenAI API](https://platform.openai.com/docs/api-reference/chat)
- 読み上げ音声の生成
  - [WEB版VOICEVOX](https://www.voicevox.su-shiki.com/)
- 3Dキャラクターの表示
  - [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)

## ローカル環境での実行方法

ローカル環境で実行する場合はこのリポジトリをクローンするか、ダウンロードしてください。

### 環境変数の設定

OpenAI APIおよびWEB版VOICEVOXのAPIキーを取得し、`.dev.vars` ファイルを作成して設定してください。

```bash
# .dev.vars
OPENAI_KEY=your_openai_api_key
VOICEVOX_KEY=your_voicevox_api_key
```

`wrangler pages dev` は自動的に `.dev.vars` を読み込みます。

### 実行手順

必要なパッケージをインストールしてください。

```bash
npm install
```

パッケージのインストールが完了した後、以下のコマンドで開発サーバーを起動します。

```bash
npm run dev
```

内部で `next build && next export` を行い、`out/` を wrangler で提供します。`functions/` 以下の API エンドポイント (例: `/api/chatStream`, `/api/voicevox`) が利用可能になります。

アクセスURL: <http://localhost:8788>

**注意**: HMR (Hot Module Replacement) は動作しないため、フロントエンドのコード変更後は `Ctrl+C` で停止して再度 `npm run dev` を実行してください。

### Cloudflare Pages 本番デプロイ

1. ダッシュボードで `OPENAI_KEY`, `VOICEVOX_KEY` を Secrets として登録
2. `git push` で自動ビルド
3. Pages が静的アセット(`out/`)と Functions(`functions/`) を同時に配信

### 備考

- 開発・本番環境ともに Cloudflare Pages Functions (`functions/`) でAPI を提供
- `src/pages/api/*` は使用していません
- `.dev.vars` はローカル開発専用（Git には含めないこと）
- 本番では Cloudflare ダッシュボードの Environment variables で Secrets を設定
