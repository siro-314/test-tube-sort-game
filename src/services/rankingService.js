// ランキングAPI通信サービス
// Netlify Functionsを使用してCORS問題を回避

// 本番環境とローカル開発環境でエンドポイントを切り替え
const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions'  // 本番: Netlify Functions
  : 'http://localhost:8888/.netlify/functions';  // ローカル: Netlify Dev

/**
 * ランキングを取得
 * @param {string} mode - ゲームモード (easy/hard/rta_easy/rta_hard)
 * @returns {Promise<Array>} ランキングデータ
 */
export async function fetchRankings(mode) {
  try {
    const response = await fetch(`${API_BASE_URL}/get-rankings?mode=${mode}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch rankings');
    }
    
    return data.rankings;
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return []; // エラー時は空配列を返す
  }
}

/**
 * スコアを送信（記録更新時またはTop10入り時のみ）
 * @param {Object} scoreData - スコアデータ
 * @param {string} scoreData.playerName - プレイヤー名
 * @param {number} scoreData.score - スコア
 * @param {string} scoreData.mode - ゲームモード
 * @param {number} scoreData.time - クリアタイム（ミリ秒）
 * @param {number} scoreData.moves - 移動回数
 * @returns {Promise<Object>} 送信結果
 */
export async function submitScore(scoreData) {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to submit score');
    }
    
    return data;
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

/**
 * ローカルベストスコアを取得
 * @param {string} mode - ゲームモード
 * @returns {Object|null} ベストスコア
 */
export function getLocalBestScore(mode) {
  try {
    const key = `best_score_${mode}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting local best score:', error);
    return null;
  }
}

/**
 * ローカルベストスコアを保存
 * @param {string} mode - ゲームモード
 * @param {Object} scoreData - スコアデータ
 */
export function saveLocalBestScore(mode, scoreData) {
  try {
    const key = `best_score_${mode}`;
    localStorage.setItem(key, JSON.stringify(scoreData));
  } catch (error) {
    console.error('Error saving local best score:', error);
  }
}

/**
 * 記録更新かどうかチェック
 * @param {string} mode - ゲームモード
 * @param {number} newScore - 新しいスコア（小さいほど良い）
 * @returns {boolean} 記録更新ならtrue
 */
export function isNewRecord(mode, newScore) {
  const localBest = getLocalBestScore(mode);
  return !localBest || newScore < localBest.score;
}
