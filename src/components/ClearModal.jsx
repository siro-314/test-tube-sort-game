// クリアモーダルコンポーネント（紙吹雪付き）
import React, { useState, useEffect } from 'react';
import '../styles/ClearModal.css';

export function ClearModal({ moves, stage, mode, clearTime, onNext, onRetry, onReturnToMenu }) {
  const [confetti, setConfetti] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  
  const isRTAMode = mode === 'rta_easy' || mode === 'rta_hard';
  
  // 紙吹雪生成
  useEffect(() => {
    const pieces = [];
    for (let i = 0; i < 80; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 720 - 360,
        color: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'][Math.floor(Math.random() * 6)]
      });
    }
    setConfetti(pieces);
  }, []);
  
  // 次へボタンで逆再生
  const handleNext = () => {
    setIsClosing(true);
    setTimeout(() => {
      onNext();
    }, 800); // 逆再生アニメーション時間
  };
  
  const handleRetry = () => {
    setIsClosing(true);
    setTimeout(() => {
      onRetry();
    }, 800);
  };
  
  const handleReturnToMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      onReturnToMenu();
    }, 800);
  };
  
  return (
    <div className="modal-overlay">
      {/* 紙吹雪 */}
      <div className="confetti-container">
        {confetti.map(piece => (
          <div
            key={piece.id}
            className={`confetti-piece ${isClosing ? 'reverse' : ''}`}
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--rotation': `${piece.rotation}deg`,
              backgroundColor: piece.color
            }}
          />
        ))}
      </div>
      
      <div className={`modal-content ${isClosing ? 'closing' : ''}`}>
        <h2 className="modal-title">🎉 ステージクリア！</h2>
        <div className="modal-stats">
          {isRTAMode ? (
            <>
              <div className="stat-item">
                <span className="stat-label">クリアタイム</span>
                <span className="stat-value">{(clearTime / 1000).toFixed(2)}秒</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">移動回数</span>
                <span className="stat-value">{moves}</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-item">
                <span className="stat-label">ステージ</span>
                <span className="stat-value">{stage}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">移動回数</span>
                <span className="stat-value">{moves}</span>
              </div>
            </>
          )}
        </div>
        <div className="modal-actions">
          {isRTAMode ? (
            <button className="btn btn-primary btn-large" onClick={handleReturnToMenu}>
              タイトルに戻る
            </button>
          ) : (
            <>
              <button className="btn btn-primary btn-large" onClick={handleNext}>
                次のステージ
              </button>
              <button className="btn btn-secondary" onClick={handleReturnToMenu}>
                タイトルに戻る
              </button>
            </>
          )}
          <button className="btn btn-secondary" onClick={handleRetry}>
            もう一度
          </button>
        </div>
      </div>
    </div>
  );
}
