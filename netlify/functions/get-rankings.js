// ランキング取得API
exports.handler = async (event, context) => {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONSリクエスト（プリフライト）への対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // モードごとのランキングを取得
    const mode = event.queryStringParameters?.mode || 'easy';
    
    // TODO: 実際のデータベースから取得（後で実装）
    // 現在はダミーデータ
    const dummyRankings = {
      easy: [],
      hard: [],
      rta_easy: [],
      rta_hard: []
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rankings: dummyRankings[mode] || []
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
