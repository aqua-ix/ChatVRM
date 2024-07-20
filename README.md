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

OpenAI APIおよびWEB版VOICEVOXのAPIキーを取得し、環境変数として設定してください。

```bash
export OPENAI_KEY="your_openai_api_key"
export VOICEVOX_KEY="your_voicevox_api_key"
```

### 実行手順

必要なパッケージをインストールしてください。

```bash
npm install
```

パッケージのインストールが完了した後、以下のコマンドで開発用のWebサーバーを起動します。

```bash
npm run dev
```

実行後、以下のURLにアクセスして動作を確認して下さい。

[http://localhost:3000](http://localhost:3000)
