// ゲームヘッダーコンポーネント
import React from 'react';
import '../styles/GameHeader.css';

export function GameHeader({ stage, moves, mode, onReset }) {
  const getModeLabel = (mode) => {
    switch(mode) {
      case 'easy': return 'イージー';
      case 'hard': return 'ハード';
      case 'rta_easy': return 'RTA - イージー';
      case 'rta_hard': return 'RTA - ハード';
      default: return mode;
    }
  };
  
  return (
    <div className="game-header">
      <div className="header-info">
        <div className="info-item">
          <span className="label">モード:</span>
          <span className="value">{getModeLabel(mode)}</span>
        </div>
        <div className="info-item">
          <span className="label">ステージ:</span>
          <span className="value">{stage}</span>
        </div>
        <div className="info-item">
          <span className="label">移動回数:</span>
          <span className="value">{moves}</span>
        </div>
      </div>
      
      <div className="header-actions">
        <button className="btn btn-secondary" onClick={onReset}>
          リタイア
        </button>
      </div>
    </div>
  );
}
