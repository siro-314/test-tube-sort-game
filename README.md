# 試験管パズルゲーム

色分けされた試験管の中身を整理するパズルゲームです。

## 特徴

- **4つのモード**: イージー、ハード、RTA イージー、RTA ハード
- **デイリーボーナス**: 毎日ログインで空き試験管アイテムを獲得
- **オンラインランキング**: ベストタイムを競おう！

## 技術スタック

- React + Vite
- Netlify Functions (サーバーレスAPI)
- GitHub Pages (静的ホスティング)
- CORS対応済み

## 開発環境セットアップ

```bash
# 依存関係をインストール
npm install

# 通常の開発サーバー起動（ランキング機能なし）
npm run dev

# Netlify Functionsを使った開発サーバー起動（ランキング機能あり）
npm run dev:netlify
```

## デプロイ

### GitHub Pagesへのデプロイ

```bash
npm run build
# dist/ フォルダの内容をGitHub Pagesにデプロイ
```

### Netlifyへのデプロイ

1. Netlifyアカウントにログイン
2. "New site from Git"を選択
3. このリポジトリを接続
4. ビルド設定:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

## ランキング機能について

ランキング機能は以下の仕組みで動作します：

1. **ローカル記録**: ブラウザのlocalStorageに各モードのベストスコアを保存
2. **サーバー送信**: 記録更新時またはTop10入り時のみサーバーに送信
3. **CORS対応**: Netlify Functionsを経由することでCORS問題を回避

### データベース実装（TODO）

現在はダミーデータですが、以下のような実装が可能です：

- Firebase Realtime Database
- Supabase
- MongoDB Atlas
- Netlify Blobs

## ライセンス

MIT
