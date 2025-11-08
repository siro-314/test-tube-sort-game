// デイリーボーナス試験管コンポーネント
import React, { useState, useEffect } from 'react';
import '../styles/DailyBonus.css';

export function DailyBonusTube({ canClaim, onClaim, timeUntilNext, percentFilled }) {
  const [bubbles, setBubbles] = useState([]);
  
  // 気泡生成
  useEffect(() => {
    if (percentFilled === 0) return;
    
    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now() + Math.random(),
        left: Math.random() * 40 + 30, // 30-70%の範囲
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 1.5
      };
      
      setBubbles(prev => [...prev.slice(-4), newBubble]);
    }, 800);
    
    return () => clearInterval(interval);
  }, [percentFilled]);
  
  return (
    <div className="daily-bonus-tube-container">
      <div className="bonus-tube-vertical">
        {/* 水の残量表示 */}
        <div 
          className="bonus-water-vertical"
          style={{ 
            height: `${percentFilled}%`,
            backgroundColor: 'rgba(100, 200, 255, 0.5)'
          }}
        />
        
        {/* 気泡 */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="bonus-bubble"
            style={{
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`
            }}
          />
        ))}
        
        {/* タイマー表示（試験管内） */}
        <div className="bonus-timer">
          {canClaim ? (
            <button className="btn-claim-mini" onClick={onClaim}>
              受取
            </button>
          ) : (
            <span className="timer-text">{timeUntilNext}</span>
          )}
        </div>
      </div>
    </div>
  );
}
