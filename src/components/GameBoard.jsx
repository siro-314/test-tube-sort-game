// ゲームボードコンポーネント
import React from 'react';
import { TestTube } from './TestTube';
import '../styles/GameBoard.css';

export function GameBoard({ tubes, selectedTube, onTubeClick }) {
  return (
    <div className="game-board">
      <div className="tubes-container">
        {tubes.map((tube, index) => (
          <TestTube
            key={index}
            colors={tube}
            isSelected={selectedTube === index}
            onClick={() => onTubeClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
