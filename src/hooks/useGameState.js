// ゲーム状態管理フック
import { useState, useEffect, useCallback } from 'react';
import { GameMode } from '../domain/types.js';
import { generateEasyStage, generateHardStage, generateDevHardStage } from '../domain/stageGenerator.js';
import { canMoveTube, moveTube, isGameCompleted, addEmptyTube, calculateTubeCount } from '../domain/gameRules.js';
import { saveProgress, loadProgress } from '../infrastructure/storage.js';

export function useGameState(initialMode = GameMode.EASY, initialExtraTubes = 0) {
  const [gameState, setGameState] = useState(() => {
    // RTAモードの場合は保存データを読み込まない
    const isRTAMode = initialMode === GameMode.RTA_EASY || initialMode === GameMode.RTA_HARD;
    
    if (!isRTAMode) {
      const saved = loadProgress();
      if (saved && saved.mode === initialMode) {
        return {
          ...saved,
          extraTubes: saved.extraTubes + initialExtraTubes
        };
      }
    }
    
    // 新規ゲーム開始
    let stageNum = 1;
    if (initialMode === GameMode.RTA_HARD) {
      stageNum = 1; // RTAハードもステージ1から（5本）
    }
    
    const tubeCount = calculateTubeCount(stageNum, initialMode);
    const tubes = (initialMode === GameMode.EASY || initialMode === GameMode.RTA_EASY)
      ? generateEasyStage(tubeCount)
      : (initialMode === GameMode.RTA_HARD || (initialMode === GameMode.HARD && tubeCount <= 8))
      ? generateDevHardStage(tubeCount) // RTAハードまたは8本以下はソルバー使用
      : generateHardStage(tubeCount);
    
    return {
      tubes,
      moves: 0,
      stage: stageNum,
      mode: initialMode,
      extraTubes: initialExtraTubes,
      startTime: isRTAMode ? Date.now() : undefined,
      completedStages: isRTAMode ? [] : undefined
    };
  });
  
  const [selectedTube, setSelectedTube] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // 進行度の自動保存（RTAモード以外）
  useEffect(() => {
    if (gameState.mode !== GameMode.RTA_EASY && gameState.mode !== GameMode.RTA_HARD) {
      saveProgress(gameState);
    }
  }, [gameState]);
  
  // クリア判定
  useEffect(() => {
    if (isGameCompleted(gameState.tubes)) {
      setIsCompleted(true);
    }
  }, [gameState.tubes]);

  // 試験管を選択
  const selectTube = useCallback((index) => {
    if (selectedTube === null) {
      // 最初の選択
      if (gameState.tubes[index].length > 0) {
        setSelectedTube(index);
      }
    } else if (selectedTube === index) {
      // 同じ試験管を選択 → 選択解除
      setSelectedTube(null);
    } else {
      // 移動試行
      if (canMoveTube(gameState.tubes, selectedTube, index, gameState.mode)) {
        const newTubes = moveTube(gameState.tubes, selectedTube, index);
        setGameState(prev => ({
          ...prev,
          tubes: newTubes,
          moves: prev.moves + 1
        }));
      }
      setSelectedTube(null);
    }
  }, [selectedTube, gameState]);
  
  // 空き試験管を追加（アイテム使用）
  const useExtraTube = useCallback(() => {
    if (gameState.extraTubes > 0 && gameState.mode !== GameMode.EXTREME) {
      setGameState(prev => ({
        ...prev,
        tubes: addEmptyTube(prev.tubes),
        extraTubes: prev.extraTubes - 1
      }));
    }
  }, [gameState]);
  
  // 次のステージへ
  const nextStage = useCallback(() => {
    // RTAモード処理
    if (gameState.mode === GameMode.RTA_EASY) {
      const completedStages = [...(gameState.completedStages || []), gameState.stage];
      
      // ステージ1,2,3全てクリアしたか確認
      if (completedStages.length >= 3) {
        const totalTime = Date.now() - gameState.startTime;
        alert(`🎉 RTA完走！タイム: ${(totalTime / 1000).toFixed(2)}秒`);
        return;
      }
      
      // 次のステージへ
      const nextStageNum = completedStages.length + 1;
      const tubeCount = calculateTubeCount(nextStageNum, gameState.mode);
      const tubes = generateEasyStage(tubeCount);
      
      setGameState({
        ...gameState,
        tubes,
        moves: gameState.moves, // 累積
        stage: nextStageNum,
        completedStages
      });
      setIsCompleted(false);
      setSelectedTube(null);
      return;
    }
    
    if (gameState.mode === GameMode.RTA_HARD) {
      // ステージ10クリアで終了
      const totalTime = Date.now() - gameState.startTime;
      alert(`🎉 RTA完走！タイム: ${(totalTime / 1000).toFixed(2)}秒\n移動回数: ${gameState.moves}`);
      return;
    }
    
    // 通常モード
    const nextStageNum = gameState.stage + 1;
    const tubeCount = calculateTubeCount(nextStageNum, gameState.mode);
    const tubes = (gameState.mode === GameMode.EASY || gameState.mode === GameMode.RTA_EASY)
      ? generateEasyStage(tubeCount)
      : (gameState.mode === GameMode.HARD && tubeCount <= 8)
      ? generateDevHardStage(tubeCount) // 8本以下はソルバー使用
      : generateHardStage(tubeCount);
    
    setGameState({
      tubes,
      moves: 0,
      stage: nextStageNum,
      mode: gameState.mode,
      extraTubes: gameState.extraTubes
    });
    setIsCompleted(false);
    setSelectedTube(null);
  }, [gameState]);
  
  // ステージリセット
  const resetStage = useCallback(() => {
    // RTAモードの場合は最初から
    if (gameState.mode === GameMode.RTA_EASY || gameState.mode === GameMode.RTA_HARD) {
      const stageNum = 1; // 両方ステージ1から
      const tubeCount = calculateTubeCount(stageNum, gameState.mode);
      const tubes = gameState.mode === GameMode.RTA_EASY
        ? generateEasyStage(tubeCount)
        : generateDevHardStage(tubeCount); // RTAハードはソルバー使用
      
      setGameState({
        tubes,
        moves: 0,
        stage: stageNum,
        mode: gameState.mode,
        extraTubes: 0,
        startTime: Date.now(),
        completedStages: []
      });
      setIsCompleted(false);
      setSelectedTube(null);
      return;
    }
    
    // 通常モード
    const tubeCount = calculateTubeCount(gameState.stage, gameState.mode);
    const tubes = (gameState.mode === GameMode.EASY || gameState.mode === GameMode.RTA_EASY)
      ? generateEasyStage(tubeCount)
      : (gameState.mode === GameMode.HARD && tubeCount <= 8)
      ? generateDevHardStage(tubeCount) // 8本以下はソルバー使用
      : generateHardStage(tubeCount);
    
    setGameState(prev => ({
      ...prev,
      tubes,
      moves: 0
    }));
    setIsCompleted(false);
    setSelectedTube(null);
  }, [gameState]);
  
  // アイテム追加（デイリーボーナス用）
  const addExtraTubes = useCallback((count) => {
    setGameState(prev => ({
      ...prev,
      extraTubes: prev.extraTubes + count
    }));
  }, []);
  
  return {
    gameState,
    selectedTube,
    isCompleted,
    selectTube,
    useExtraTube,
    nextStage,
    resetStage,
    addExtraTubes
  };
}
