// Firebase初期化テスト
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('/Users/kitazawaharesora/Downloads/tube-sort-game-firebase-adminsdk-fbsvc-1dee2e603d.json', 'utf-8')
);

// Base64エンコードして、Netlifyと同じ処理でデコードする
const base64Key = Buffer.from(JSON.stringify(serviceAccount)).toString('base64');
console.log('Base64 encoded (first 100 chars):', base64Key.substring(0, 100));

// デコード
const decoded = JSON.parse(Buffer.from(base64Key, 'base64').toString('utf-8'));
console.log('✅ Decoded successfully');
console.log('private_key starts with:', decoded.private_key.substring(0, 50));

// Firebase初期化
try {
  admin.initializeApp({
    credential: admin.credential.cert(decoded),
    databaseURL: 'https://tube-sort-game-default-rtdb.firebaseio.com'
  });
  console.log('✅ Firebase initialized successfully!');
  
  // データベース接続テスト
  const db = admin.database();
  const ref = db.ref('rankings/easy');
  const snapshot = await ref.limitToFirst(1).once('value');
  console.log('✅ Database connection successful!');
  console.log('Data:', snapshot.val());
  
  process.exit(0);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}
