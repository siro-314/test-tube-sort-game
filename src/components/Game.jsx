// メインゲームコンポーネント
import React from 'react';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { ClearModal } from './ClearModal';
import { useGameState } from '../hooks/useGameState';
import { GameMode } from '../domain/types';
import '../styles/Game.css';

export function Game({ mode = GameMode.EASY, extraTubes = 0, onReturnToMenu }) {
  const {
    gameState,
    selectedTube,
    isCompleted,
    selectTube,
    useExtraTube,
    nextStage,
    resetStage
  } = useGameState(mode, extraTubes);
  
  const canUseExtraTube = mode !== GameMode.RTA_EASY && mode !== GameMode.RTA_HARD;
  
  return (
    <div className="game">
      <GameHeader
        stage={gameState.stage}
        moves={gameState.moves}
        mode={gameState.mode}
        onReset={onReturnToMenu}
      />
      
      <GameBoard
        tubes={gameState.tubes}
        selectedTube={selectedTube}
        onTubeClick={selectTube}
      />
      
      {/* 空き試験管追加アイコン */}
      {canUseExtraTube && gameState.extraTubes > 0 && (
        <div className="extra-tube-icon" onClick={useExtraTube}>
          <div className="tube-icon">🧪</div>
          <div className="badge">{gameState.extraTubes}</div>
        </div>
      )}
      
      {isCompleted && (
        <ClearModal
          moves={gameState.moves}
          stage={gameState.stage}
          mode={gameState.mode}
          clearTime={gameState.startTime ? Date.now() - gameState.startTime : null}
          onNext={nextStage}
          onRetry={resetStage}
          onReturnToMenu={onReturnToMenu}
        />
      )}
    </div>
  );
}
