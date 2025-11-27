import admin from 'firebase-admin';

// Firebase Admin初期化ロジックを共通化
// これにより、将来的な修正（例：環境変数の扱い変更など）が一箇所で済むようにする
if (!admin.apps.length) {
  // FIREBASE_PRIVATE_KEYの処理
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  
  // Base64エンコードされている場合はデコード
  // 疎結合性: 環境変数の形式（生テキスト or Base64）に関わらず動作するようにチェックを入れる
  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    try {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
    } catch (e) {
      console.error('Failed to decode base64 private key:', e);
      // ここでエラーを投げると、呼び出し元でハンドリングが必要になるが、
      // 秘密鍵が壊れている場合はそもそも動作しないので、ログを出して続行（Firebase初期化で落ちる）させる
    }
  }
  
  // リテラル文字列 "\\n" を実際の改行に変換
  // Netlifyなどの環境変数で改行がエスケープされてしまう問題への対策
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.split('\\n').join('\n');
  }
  
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    // 初期化失敗時はエラーを投げて、呼び出し元のFunctionが適切に500エラーを返せるようにする
    throw error;
  }
}

// 初期化済みのDBインスタンスをエクスポート
const db = admin.database();
export { db };
