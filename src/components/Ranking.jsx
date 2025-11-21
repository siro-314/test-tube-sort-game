// ランキング表示コンポーネント
import React, { useState, useEffect } from 'react';
import { fetchRankings } from '../services/rankingService';
import { sanitizePlayerName } from '../utils/sanitize';
import '../styles/Ranking.css';

export function Ranking({ onBack }) {
  const [selectedMode, setSelectedMode] = useState('rta_easy');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankings();
  }, [selectedMode]);

  const loadRankings = async () => {
    setLoading(true);
    try {
      const data = await fetchRankings(selectedMode);
      setRankings(data);
    } catch (error) {
      console.error('Failed to load rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModeLabel = (mode) => {
    switch(mode) {
      case 'easy': return 'イージー';
      case 'hard': return 'ハード';
      case 'rta_easy': return 'RTA イージー';
      case 'rta_hard': return 'RTA ハード';
      default: return mode;
    }
  };

  const formatTime = (ms) => {
    return (ms / 1000).toFixed(2) + '秒';
  };

  return (
    <div className="ranking-container">
      <button className="btn btn-back" onClick={onBack}>
        ← 戻る
      </button>

      <h1 className="ranking-title">🏆 ランキング</h1>

      {/* モード選択タブ */}
      <div className="mode-tabs">
        {['rta_easy', 'rta_hard', 'easy', 'hard'].map(mode => (
          <button
            key={mode}
            className={`mode-tab ${selectedMode === mode ? 'active' : ''}`}
            onClick={() => setSelectedMode(mode)}
          >
            {getModeLabel(mode)}
          </button>
        ))}
      </div>

      {/* ランキングテーブル */}
      <div className="ranking-list">
        {loading ? (
          <div className="loading">読み込み中...</div>
        ) : rankings.length === 0 ? (
          <div className="empty-message">
            <p>まだ記録がありません</p>
            <p>最初のランカーになろう！</p>
          </div>
        ) : (
          <table className="ranking-table">
            <thead>
              <tr>
                <th className="rank-col">順位</th>
                <th className="name-col">名前</th>
                <th className="score-col">タイム</th>
                <th className="moves-col">移動回数</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry, index) => (
                <tr key={index} className={`rank-${index + 1}`}>
                  <td className="rank-col">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}位`}
                  </td>
                  <td className="name-col" title={entry.playerName}>
                    {sanitizePlayerName(entry.playerName)}
                  </td>
                  <td className="score-col">{formatTime(entry.time)}</td>
                  <td className="moves-col">{entry.moves}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="ranking-footer">
        <p className="note">※記録は定期的にリセットされる場合があります</p>
      </div>
    </div>
  );
}
