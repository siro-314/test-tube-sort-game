// ゲームルールと移動判定ロジック
import { TUBE_CAPACITY, GameMode } from './types.js';

/**
 * 移動が可能かチェック（モードに応じて判定）
 */
export function canMoveTube(tubes, fromIndex, toIndex, mode) {
  const from = tubes[fromIndex];
  const to = tubes[toIndex];
  
  // 基本的な条件チェック
  if (from.length === 0) return false;
  if (to.length >= TUBE_CAPACITY) return false;
  if (fromIndex === toIndex) return false;
  
  // イージーモードとRTAイージーモードの場合はどこにでも移動可能
  if (mode === GameMode.EASY || mode === GameMode.RTA_EASY) {
    return true;
  }
  
  // ハード/エクストリーム/RTAハード/開発者モード：同じ色の上にのみ移動可能
  if (to.length === 0) return true;
  
  const topColorFrom = from[from.length - 1];
  const topColorTo = to[to.length - 1];
  
  return topColorFrom === topColorTo;
}

/**
 * 試験管を移動（同色を一気に移動）
 */
export function moveTube(tubes, fromIndex, toIndex) {
  const newTubes = tubes.map(t => [...t]);
  const from = newTubes[fromIndex];
  const to = newTubes[toIndex];
  
  if (from.length === 0) return newTubes;
  
  // 移動する色を取得
  const topColor = from[from.length - 1];
  
  // 同じ色が連続している数を数える
  let count = 0;
  for (let i = from.length - 1; i >= 0; i--) {
    if (from[i] === topColor) {
      count++;
    } else {
      break;
    }
  }
  
  // 受け入れ先の空き容量を計算
  const spaceAvailable = TUBE_CAPACITY - to.length;
  
  // 移動できる数を決定（少ない方）
  const moveCount = Math.min(count, spaceAvailable);
  
  // 一気に移動
  for (let i = 0; i < moveCount; i++) {
    const color = from.pop();
    to.push(color);
  }
  
  return newTubes;
}

/**
 * ゲームクリア判定
 */
export function isGameCompleted(tubes) {
  for (const tube of tubes) {
    if (tube.length === 0) continue;
    if (tube.length !== TUBE_CAPACITY) return false;
    
    // 全て同じ色かチェック
    const firstColor = tube[0];
    if (!tube.every(c => c === firstColor)) return false;
  }
  return true;
}

/**
 * 空き試験管を追加
 */
export function addEmptyTube(tubes) {
  return [...tubes, []];
}

/**
 * ステージ番号から試験管の本数を計算
 */
export function calculateTubeCount(stage, mode) {
  if (mode === GameMode.EASY) {
    const baseCount = 6;
    const increment = Math.floor(stage / 5); // 5ステージごとに1本増加
    return Math.min(baseCount + increment, 12);
  }
  
  // ハードモード: 10ステージごとに1本増加
  if (stage <= 10) return 5;
  if (stage <= 20) return 6;
  if (stage <= 30) return 7;
  return 8; // 31以降は8本固定
}

/**
 * 次のステージを生成
 */
export function generateNextStage(stage, mode) {
  const tubeCount = calculateTubeCount(stage, mode);
  
  // モードに応じてステージ生成ロジックを切り替え
  // （stageGeneratorから呼び出す想定）
  return { tubeCount };
}
