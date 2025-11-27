import admin from 'firebase-admin';

// Firebase Admin初期化
if (!admin.apps.length) {
  // FIREBASE_PRIVATE_KEYの二重エスケープに対応
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  // まず\\nを\nに変換（Netlify UIからのインポートで発生する二重エスケープ対策）
  privateKey = privateKey.replace(/\\\\n/g, '\\n');
  // 次に\nを実際の改行に変換
  privateKey = privateKey.replace(/\\n/g, '\n');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.database();

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const mode = event.queryStringParameters?.mode || 'easy';
    
    // Firebaseから取得
    const snapshot = await db.ref(`rankings/${mode}`).once('value');
    let rankings = [];
    
    snapshot.forEach(child => {
      rankings.push(child.val());
    });
    
    // 30日以上古い記録を自動削除
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    
    rankings = rankings.filter(record => {
      const age = now - record.timestamp;
      return age < THIRTY_DAYS;
    });
    
    // ソート
    if (mode.startsWith('rta')) {
      rankings.sort((a, b) => a.time - b.time);
    } else {
      rankings.sort((a, b) => {
        if (b.stage !== a.stage) return b.stage - a.stage;
        return a.moves - b.moves;
      });
    }
    
    // Top10のみ返す
    rankings = rankings.slice(0, 10);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rankings,
        lastUpdated: now
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
