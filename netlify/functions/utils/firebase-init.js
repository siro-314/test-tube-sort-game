import admin from 'firebase-admin';

// Firebase Admin初期化ロジックを共通化
// これにより、将来的な修正（例：環境変数の扱い変更など）が一箇所で済むようにする
if (!admin.apps.length) {
  // FIREBASE_PRIVATE_KEYの処理
  // 優先順位: FIREBASE_PRIVATE_KEY_BASE64 > FIREBASE_PRIVATE_KEY
  // 疎結合性: 複数の環境変数形式に対応し、デプロイ環境の違いを吸収
  let privateKey = '';
  
  if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
    // Base64エンコード専用の環境変数（改行問題の回避策）
    try {
      privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
    } catch (e) {
      console.error('Failed to decode FIREBASE_PRIVATE_KEY_BASE64:', e);
    }
  } else if (process.env.FIREBASE_PRIVATE_KEY) {
    // 従来の環境変数（後方互換性）
    privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Base64エンコードされている場合はデコード
    if (!privateKey.includes('BEGIN PRIVATE KEY')) {
      try {
        privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
      } catch (e) {
        console.error('Failed to decode base64 private key:', e);
      }
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
