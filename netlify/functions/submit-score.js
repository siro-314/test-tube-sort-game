import admin from 'firebase-admin';
import { sanitizePlayerName } from '../../src/utils/sanitize.js';

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

const ipCache = new Map();
const IP_LIMIT_WINDOW = 60 * 1000;
const IP_LIMIT_COUNT = 5;

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const now = Date.now();
    
    if (ipCache.has(clientIp)) {
      const requests = ipCache.get(clientIp);
      const recentRequests = requests.filter(time => now - time < IP_LIMIT_WINDOW);
      
      if (recentRequests.length >= IP_LIMIT_COUNT) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({
            success: false,
            error: '送信回数が多すぎます。少し待ってから再度お試しください。'
          })
        };
      }
      
      recentRequests.push(now);
      ipCache.set(clientIp, recentRequests);
    } else {
      ipCache.set(clientIp, [now]);
    }

    const data = JSON.parse(event.body);
    let { playerName, score, mode, time, moves, stage } = data;

    playerName = sanitizePlayerName(playerName);

    if (!score || !mode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'スコアとモードは必須です'
        })
      };
    }

    const timestamp = Date.now();
    
    const recordData = {
      playerName,
      score,
      mode,
      time: time || 0,
      moves: moves || 0,
      stage: stage || 1,
      timestamp
    };

    // Firebaseに保存
    const ref = db.ref(`rankings/${mode}`);
    await ref.push(recordData);
    
    // 現在の順位を計算
    const snapshot = await ref.once('value');
    const allRecords = [];
    snapshot.forEach(child => {
      allRecords.push(child.val());
    });
    
    // 30日以上古い記録を削除
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const validRecords = allRecords.filter(r => now - r.timestamp < THIRTY_DAYS);
    
    // ソート
    if (mode.startsWith('rta')) {
      validRecords.sort((a, b) => a.time - b.time);
    } else {
      validRecords.sort((a, b) => {
        if (b.stage !== a.stage) return b.stage - a.stage;
        return a.moves - b.moves;
      });
    }
    
    const rank = validRecords.findIndex(r => 
      r.playerName === playerName && 
      r.score === score && 
      r.timestamp === timestamp
    ) + 1;

    const result = {
      success: true,
      rank: rank <= 10 ? rank : null,
      message: rank <= 10 ? `${rank}位に入りました！` : '記録を保存しました',
      expiresIn: '30日後に自動削除されます'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'サーバーエラーが発生しました'
      })
    };
  }
};
