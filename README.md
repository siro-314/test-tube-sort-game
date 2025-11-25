# 試験管パズルゲーム

色分けされた試験管の中身を整理するパズルゲームです。

## 特徴

- **4つのモード**: イージー、ハード、RTA イージー、RTA ハード
- **デイリーボーナス**: 毎日ログインで空き試験管アイテムを獲得
- **オンラインランキング**: ベストタイムを競おう！
- **30日自動削除**: 古い記録は自動的に削除されます
- **XSS対策**: 安全なプレイヤー名表示

## 技術スタック

- React + Vite
- Firebase Realtime Database
- Netlify Functions (サーバーレスAPI)
- GitHub Pages (静的ホスティング)

## 開発環境セットアップ

### 1. 依存関係をインストール

```bash
npm install
```

### 2. Firebase設定

`.env.example`をコピーして`.env`を作成し、Firebase設定を記入：

```bash
cp .env.example .env
```

`.env`に以下を記入：
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. 開発サーバー起動

```bash
# 通常の開発サーバー（ランキング機能なし）
npm run dev

# Netlify Functionsを使った開発サーバー（ランキング機能あり）
npm run dev:netlify
```

## Netlifyへのデプロイ

### 1. Netlifyアカウント準備

1. [Netlify](https://www.netlify.com/)にログイン
2. "New site from Git"を選択
3. このリポジトリを接続

### 2. ビルド設定

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### 3. 環境変数の設定（重要！）

Netlifyの**Site settings → Environment variables**に以下を追加：

#### フロントエンド用（Vite）
```
VITE_FIREBASE_API_KEY=AIzaSyCXkfUk1st76JtvfU6qORpWXCYYng5L24s
VITE_FIREBASE_AUTH_DOMAIN=tube-sort-game.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tube-sort-game-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=tube-sort-game
VITE_FIREBASE_STORAGE_BUCKET=tube-sort-game.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=17997872224
VITE_FIREBASE_APP_ID=1:17997872224:web:ca09e9ffc10c020bf4d705
```

#### バックエンド用（Netlify Functions）
```
FIREBASE_PROJECT_ID=tube-sort-game
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@tube-sort-game.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCiyS3VOt43DuEx\ni5yBUD+GwZ+GFfzljtukZ9TtSWWkynZKtVulo/Yq/XrZvRD4Rexc+tdI7Lnwr0GS\nirP8/Y3PPiDZAGh8AgpgG6Kaiv/OHV0gZXqjND5D5yXjSS4HSkGEokhJzjGIdJWc\no4f8L1fbSlg87SeGbvafoDLxcaQ7FOd7Rf90ouRn2R99hFxBVT9MNDrd+qJUAE5F\nvbcf9Tq/JCjto5d9HzC8Cuyaf8p49nVt/0pul6veaIaWvZBMcyEaTH5dUWdc9OGQ\nolR+fsBGmdiX21M+gfkNooCnBPCFJqPLz35reSHuboFOdbzeOPREt4TsJK+VG17R\n/ajQ7z3AgMBAAECggEAL8hHuNBXy+eFOIrXfKm2i/Knxa8MlcFyPXbw7FngCRgY\n0uMbLKrNJl9TQTibE5VKxRwoN1KtXbXD1KT8IiW3C38cGzZgdQ4QR5e1ChIE9lZu\nMIU5E1DRehMObwHbDe7A/pK4D1oD9h7qj5j84IxxCIBxGCkwseg+Yiqe6XpHD8Qh\nwGZvIlLO10Jx43NGMpmgzUeLv/NS75lcxjo89Fr/Xb27acSiYl8sLiHlNXQ0wfkc\nNIv4b5mR2wpEORFPbPPay+AmZczhCwtjG8V/ewzj2LpCUiAQNomGc/PYBoaccj7b\nF1WLmXkNPvP7SNdO7A/1mS3oo8PTR873p98FoLlQWQKBgQDfLSuABC9KdB1JI89+\n1JRwyF0q9OqzMM8mfFiCZovACYTL1VCvmXpm0flti6inX69fCyRMQopFMMm3ZfXA\nb9BDNa+O720TfR1Yunp0/Xm/uNCTBrXmV9rsCwkAR9ZOE1OnckIilpqiF9Njb/Al\n0EmCSI0C4C3t0dzVzT9tmhCxQwKBgQC6uj1DgTGDYZ/0qq5+yD7ufp5smusjz3FY\nw7MRGuDQJfb3UxA4Df6iiGb3kVfmRFRuxF8xEP9sBRBEZnTmBAKKAUPjz/PcGzBB\nPTPR7D96PpPT0jBmVRHl/FPnDIvXi1FTD2gVsyOHs/1Wanv1XHBf6U1jzX3NfdrN\nHVwjGjiAPQKBgQDM4EeVvsG3JL8ZvKEoOniGzLkSzUGD/GO+XdpW41KZmWNqR8pJ\nWajPKSVEVjgeZq20n6LTyyXp/K7BCP3AiiTy/h7LJarJgErngFEYgvU4dq4qurdT\n3QUhOcQqmMf4Zq+eATsLS5xq/1pUZ5da70n8KyQgJrKjJswHDeOTdyKpxwKBgE95\nsVWoCWD4DlLeysJfjJmJ/vgOwAJP6thzAyZGoGU3o3QFQKP7IOQg1mKM1DLH5n/2\nyOVjbLOXPCNA0ISONF50x2aRPiPy1okN+Z5hxWrMc7L2hW8oyiNvUG7I4kRtocGO\njyidRIQf0bYUQIpgO9w2up+9+Mubw6MF2g9+u4mpAoGAQNGskhP517SHae+eEDEv\n9onFOhYEpvh6zVnuH14SUeB2pdBl8zgLPsjCLFCYfKBB9d7wx2cenyRIs7xcYcLV\nVl2l5aYIsW4vjL8Kxwx6IxkcYvnEeAvgcohRgWxMzjrG4078bUai4ss9THaPtQXI\nRbIhBdV63JJjxRgv4OIup3A=\n-----END PRIVATE KEY-----\n
FIREBASE_DATABASE_URL=https://tube-sort-game-default-rtdb.asia-southeast1.firebasedatabase.app
```

⚠️ **重要**: `FIREBASE_PRIVATE_KEY`は改行を`\n`に置き換えて1行にしてください。

### 4. デプロイ

設定完了後、Netlifyが自動的にビルド・デプロイします。

## ランキング機能について

### データフロー
1. **ローカル記録**: ブラウザのlocalStorageに各モードのベストスコアを保存
2. **サーバー送信**: 記録更新時またはTop10入り時のみFirebaseに送信
3. **30日自動削除**: 記録から30日経過で自動削除

### セキュリティ対策
- XSS対策（HTMLタグ除去、エスケープ処理）
- IP制限（1分間に5回まで）
- プレイヤー名サニタイズ（20文字制限）

## ライセンス

MIT
