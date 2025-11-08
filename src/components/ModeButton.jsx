// モード選択用の試験管ボタンコンポーネント
import React, { useState, useEffect } from 'react';
import '../styles/ModeButton.css';

export function ModeButton({ title, description, color, onClick, children }) {
  const [bubbles, setBubbles] = useState([]);
  
  // 気泡生成（重力方向に上昇）
  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now() + Math.random(),
        left: Math.random() * 80 + 10, // 10-90%の範囲
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2 // 2-4秒
      };
      
      setBubbles(prev => [...prev.slice(-5), newBubble]);
    }, 600);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="mode-button-wrapper">
      <button className="tube-button" onClick={onClick}>
        {/* 試験管本体（横向き） */}
        <div className="tube-button-body">
          {/* 液体（満タン） */}
          <div
            className="tube-button-segment"
            style={{ backgroundColor: color }}
          />
          
          {/* 気泡（重力方向=上） */}
          {bubbles.map(bubble => (
            <div
              key={bubble.id}
              className="tube-button-bubble"
              style={{
                left: `${bubble.left}%`,
                animationDelay: `${bubble.delay}s`,
                animationDuration: `${bubble.duration}s`
              }}
            />
          ))}
          
          {/* テキスト情報（試験管内に表示） */}
          <div className="tube-button-info">
            <span className="tube-button-title">{title}</span>
            <span className="tube-button-desc">{description}</span>
          </div>
        </div>
      </button>
      
      {children}
    </div>
  );
}
