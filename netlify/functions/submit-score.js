// ランキング登録API（30日自動削除＋同一IP制限付き）
import { sanitizePlayerName } from '../../src/utils/sanitize.js';

// IP制限用のメモリキャッシュ（Netlify Functionsは一定時間同じインスタンスを使い回す）
const ipCache = new Map();
const IP_LIMIT_WINDOW = 60 * 1000; // 1分間
const IP_LIMIT_COUNT = 5; // 1分間に5回まで

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
    // IP制限チェック
    const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const now = Date.now();
    
    // IPごとのリクエスト履歴を確認
    if (ipCache.has(clientIp)) {
      const requests = ipCache.get(clientIp);
      // 古いリクエストを削除
      const recentRequests = requests.filter(time => now - time < IP_LIMIT_WINDOW);
      
      if (recentRequests.length >= IP_LIMIT_COUNT) {
        return {
          statusCode: 429, // Too Many Requests
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

    // プレイヤー名をサニタイズ（XSS対策）
    playerName = sanitizePlayerName(playerName);

    // バリデーション
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

    // タイムスタンプを追加（30日自動削除用）
    const timestamp = Date.now();
    
    const recordData = {
      playerName,
      score,
      mode,
      time: time || 0,
      moves: moves || 0,
      stage: stage || 1,
      timestamp, // 記録日時（30日後に自動削除）
      ip: clientIp.substring(0, 10) // デバッグ用（最初の10文字のみ保存）
    };

    // TODO: Firebaseに保存
    // await firebase.database().ref(`rankings/${mode}`).push(recordData);
    
    // 現在はダミーレスポンス
    const result = {
      success: true,
      rank: null, // Top10に入った場合のみ順位を返す（後で実装）
      message: '記録を保存しました',
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
