// 試験管コンポーネント
import React, { useState, useEffect } from 'react';
import '../styles/TestTube.css';

const COLORS = [
  '#E74C3C', // 赤
  '#3498DB', // 青
  '#2ECC71', // 緑
  '#F39C12', // オレンジ
  '#9B59B6', // 紫
  '#1ABC9C', // ティール
  '#E67E22'  // 焦げオレンジ
];

export function TestTube({ colors, isSelected, onClick }) {
  const [bubbles, setBubbles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  
  // 炭酸バブル生成
  useEffect(() => {
    if (colors.length === 0) return;
    
    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now() + Math.random(),
        left: Math.random() * 50 + 5, // 5-55%の範囲
        delay: Math.random() * 2
      };
      
      setBubbles(prev => [...prev.slice(-4), newBubble]);
    }, 800);
    
    return () => clearInterval(interval);
  }, [colors]);
  
  // 一色統一チェック
  useEffect(() => {
    const uniqueColors = new Set(colors.filter(c => c !== 0));
    const isSingleColor = uniqueColors.size === 1 && colors.filter(c => c !== 0).length === 5;
    
    if (isSingleColor && !isComplete) {
      setIsComplete(true);
      
      // キラキラエフェクト生成
      const newSparkles = [];
      for (let i = 0; i < 8; i++) {
        newSparkles.push({
          id: Date.now() + i,
          angle: (360 / 8) * i,
          delay: i * 0.05
        });
      }
      setSparkles(newSparkles);
      
      // 2秒後にエフェクトクリア
      setTimeout(() => {
        setSparkles([]);
      }, 2000);
    } else if (!isSingleColor) {
      setIsComplete(false);
    }
  }, [colors, isComplete]);
  
  return (
    <div 
      className={`test-tube ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''}`}
      onClick={onClick}
    >
      <div className="tube-container">
        {[...Array(5)].map((_, index) => {
          const colorIndex = colors[index];
          const bgColor = colorIndex ? COLORS[colorIndex - 1] : 'transparent';
          const isTop = colorIndex && (!colors[index + 1] || colors[index + 1] === 0);
          
          return (
            <div 
              key={index}
              className={`tube-segment ${isTop ? 'liquid-top' : ''}`}
              style={{ backgroundColor: bgColor }}
            />
          );
        })}
        
        {/* 炭酸バブル */}
        {colors.length > 0 && bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        ))}
      </div>
      
      {/* キラキラエフェクト */}
      {sparkles.length > 0 && (
        <div className="sparkle-container">
          {sparkles.map(sparkle => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                '--angle': `${sparkle.angle}deg`,
                animationDelay: `${sparkle.delay}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
