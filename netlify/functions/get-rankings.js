// ランキングデータ管理（30日自動削除機能付き）
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
    
    // TODO: Firebaseから取得
    // 現在はダミー
    let rankings = [
      // { playerName: "テスト太郎", time: 45000, moves: 120, timestamp: 1234567890 }
    ];
    
    // 30日以上古い記録を自動削除
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // 30日（ミリ秒）
    
    rankings = rankings.filter(record => {
      const age = now - record.timestamp;
      return age < THIRTY_DAYS; // 30日以内のみ残す
    });
    
    // スコアでソート（RTAモードは時間、通常モードはステージ）
    if (mode.startsWith('rta')) {
      // RTAモード: 時間が短い順
      rankings.sort((a, b) => a.time - b.time);
    } else {
      // 通常モード: ステージが高い順、同じなら移動回数が少ない順
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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
