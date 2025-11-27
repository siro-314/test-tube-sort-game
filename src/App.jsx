// アプリのメインコンポーネント
import React, { useState } from 'react';
import { Game } from './components/Game';
import { ModeButton } from './components/ModeButton';
import { DailyBonusTube } from './components/DailyBonusTube';
import { Ranking } from './components/Ranking';
import { GameMode } from './domain/types';
import { useDailyBonus } from './hooks/useDailyBonus';
import './styles/App.css';

function App() {
  const [currentMode, setCurrentMode] = useState(null);
  const [showRTAMenu, setShowRTAMenu] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [extraTubes, setExtraTubes] = useState(0);
  
  const { canClaim, claim, timeUntilNext, percentFilled } = useDailyBonus((count) => {
    setExtraTubes(prev => prev + count);
  });
  
  // ランキング画面
  if (showRanking) {
    return (
      <div className="app">
        <Ranking onBack={() => setShowRanking(false)} />
      </div>
    );
  }
  
  // RTAモード選択画面
  if (showRTAMenu) {
    return (
      <div className="app">
        <DailyBonusTube
          canClaim={canClaim}
          onClaim={claim}
          timeUntilNext={timeUntilNext}
          percentFilled={percentFilled}
        />
        
        <div className="menu-screen">
          <button 
            className="btn btn-back"
            onClick={() => setShowRTAMenu(false)}
          >
            ← 戻る
          </button>
          
          <h1 className="game-title">⏱️ RTA選択</h1>
          
          <div className="mode-selection">
            <div className="mode-buttons">
              <ModeButton
                title="RTA イージー"
                description="ステージ1→2→3を連続クリア！"
                color="#2ECC71"
                onClick={() => {
                  setShowRTAMenu(false);
                  setCurrentMode(GameMode.RTA_EASY);
                }}
              />
              
              <ModeButton
                title="RTA ハード"
                description="ハードステージのクリアタイムを競おう!"
                color="#E74C3C"
                onClick={() => {
                  setShowRTAMenu(false);
                  setCurrentMode(GameMode.RTA_HARD);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // メインモード選択画面
  if (!currentMode) {
    return (
      <div className="app">
        <DailyBonusTube
          canClaim={canClaim}
          onClaim={claim}
          timeUntilNext={timeUntilNext}
          percentFilled={percentFilled}
        />
        
        <div className="menu-screen">
          <h1 className="game-title">試験管パズル</h1>
          
          <div className="mode-selection">
            <div className="mode-buttons">
              <ModeButton
                title="イージー"
                description="どこにでも移動OK！"
                color="#2ECC71"
                onClick={() => setCurrentMode(GameMode.EASY)}
              />
              
              <ModeButton
                title="ハード"
                description="同じ色の上にのみ移動可！"
                color="#E74C3C"
                onClick={() => setCurrentMode(GameMode.HARD)}
              />
              
              <ModeButton
                title="⏱️ RTA"
                description="タイムアタック！"
                color="#F39C12"
                onClick={() => setShowRTAMenu(true)}
              />
              
              <ModeButton
                title="🏆 ランキング"
                description="トップ10を見る"
                color="#3498DB"
                onClick={() => setShowRanking(true)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // ゲーム画面
  return (
    <div className="app">
      <button 
        className="btn btn-back"
        onClick={() => setCurrentMode(null)}
      >
        ← メニューに戻る
      </button>
      
      <Game 
        mode={currentMode} 
        extraTubes={extraTubes}
        onReturnToMenu={() => setCurrentMode(null)}
      />
    </div>
  );
}

export default App;
