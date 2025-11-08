// ステージ自動生成ロジック
import { TUBE_CAPACITY, MAX_COLORS } from './types.js';

/**
 * イージーモード用ステージ生成
 * 各色が5の倍数個になるように生成（必ずクリア可能）
 */
export function generateEasyStage(numTubes) {
  const numColorTubes = numTubes - 1; // 1本は空き
  const numColors = Math.min(numColorTubes, MAX_COLORS);
  
  // 各色5個ずつ作成
  const colors = [];
  for (let i = 1; i <= numColors; i++) {
    for (let j = 0; j < TUBE_CAPACITY; j++) {
      colors.push(i);
    }
  }
  
  // シャッフル
  shuffle(colors);
  
  // 試験管に分配
  const tubes = [];
  for (let i = 0; i < numColorTubes; i++) {
    tubes.push(colors.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
  }
  
  // 空き試験管を追加
  tubes.push([]);
  
  return tubes;
}

/**
 * ハード/エクストリームモード用ステージ生成
 * クリア可能性をチェックしてクリア可能なステージのみ返す
 */
export function generateHardStage(numTubes, maxAttempts = 100) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const stage = generateRandomStage(numTubes);
    
    if (isSolvable(stage)) {
      return stage;
    }
  }
  
  // クリア可能なステージが見つからない場合はイージーモードの生成を使用
  return generateEasyStage(numTubes);
}

/**
 * ランダムなステージを生成
 */
function generateRandomStage(numTubes) {
  const numColorTubes = numTubes - 1; // 1本は空き
  const numColors = Math.min(numColorTubes, MAX_COLORS);
  
  // 色の総数を決定（試験管の容量を考慮）
  const totalColors = numColors * TUBE_CAPACITY;
  const colors = [];
  
  for (let i = 1; i <= numColors; i++) {
    for (let j = 0; j < TUBE_CAPACITY; j++) {
      colors.push(i);
    }
  }
  
  shuffle(colors);
  
  // 試験管に分配
  const tubes = [];
  for (let i = 0; i < numColorTubes; i++) {
    tubes.push(colors.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
  }
  
  tubes.push([]); // 空き試験管
  
  return tubes;
}

/**
 * ステージがクリア可能かを判定（BFSで探索）
 */
function isSolvable(tubes) {
  const visited = new Set();
  const queue = [tubes.map(t => [...t])]; // ディープコピー
  
  while (queue.length > 0) {
    const current = queue.shift();
    const stateKey = JSON.stringify(current);
    
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);
    
    // クリア判定
    if (isCompleted(current)) {
      return true;
    }
    
    // 全ての可能な移動を試す
    for (let from = 0; from < current.length; from++) {
      if (current[from].length === 0) continue;
      
      for (let to = 0; to < current.length; to++) {
        if (from === to) continue;
        
        if (canMove(current, from, to)) {
          const next = current.map(t => [...t]);
          const color = next[from].pop();
          next[to].push(color);
          
          const nextKey = JSON.stringify(next);
          if (!visited.has(nextKey)) {
            queue.push(next);
          }
        }
      }
    }
    
    // 訪問数が多すぎる場合は打ち切り（パフォーマンス対策）
    if (visited.size > 10000) {
      return false;
    }
  }
  
  return false;
}

/**
 * 移動が可能かチェック（ハードモードルール）
 */
function canMove(tubes, fromIndex, toIndex) {
  const from = tubes[fromIndex];
  const to = tubes[toIndex];
  
  if (from.length === 0) return false;
  if (to.length >= TUBE_CAPACITY) return false;
  
  // 移動先が空、または同じ色の上にのみ移動可能
  if (to.length === 0) return true;
  
  const topColorFrom = from[from.length - 1];
  const topColorTo = to[to.length - 1];
  
  return topColorFrom === topColorTo;
}

/**
 * クリア判定
 */
function isCompleted(tubes) {
  for (const tube of tubes) {
    if (tube.length === 0) continue;
    if (tube.length !== TUBE_CAPACITY) return false;
    
    const firstColor = tube[0];
    if (!tube.every(c => c === firstColor)) return false;
  }
  return true;
}

/**
 * Fisher-Yatesシャッフル
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * 開発者モード用：ソルバーで確実に解けるステージを生成
 */
export function generateDevHardStage(numTubes = 8) {
  const maxAttempts = 10; // 最大10回試行
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const stage = generateRandomStage(numTubes);
    
    // 簡易BFSで50手以内に解けるかチェック
    if (isSolvableWithLimit(stage, 50)) {
      return stage;
    }
  }
  
  // 見つからなければイージー生成にフォールバック
  console.warn('解けるステージが見つからなかったためイージーモードで生成');
  return generateEasyStage(numTubes);
}

/**
 * 手数制限付きでクリア可能かチェック
 */
function isSolvableWithLimit(tubes, maxMoves) {
  const queue = [{ tubes: tubes.map(t => [...t]), moves: 0 }];
  const visited = new Set();
  visited.add(JSON.stringify(tubes));
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (isCompleted(current.tubes)) {
      return true;
    }
    
    if (current.moves >= maxMoves) continue;
    
    // 全ての移動を試す
    for (let from = 0; from < current.tubes.length; from++) {
      for (let to = 0; to < current.tubes.length; to++) {
        if (canMove(current.tubes, from, to)) {
          const newTubes = moveTubesForSolver(current.tubes, from, to);
          const state = JSON.stringify(newTubes);
          
          if (!visited.has(state)) {
            visited.add(state);
            queue.push({ tubes: newTubes, moves: current.moves + 1 });
          }
        }
      }
    }
  }
  
  return false;
}

/**
 * ソルバー用移動処理（連続同色を一気に移動）
 */
function moveTubesForSolver(tubes, from, to) {
  const newTubes = tubes.map(t => [...t]);
  const topColor = newTubes[from][newTubes[from].length - 1];
  
  let count = 0;
  for (let i = newTubes[from].length - 1; i >= 0; i--) {
    if (newTubes[from][i] === topColor) count++;
    else break;
  }
  
  const space = TUBE_CAPACITY - newTubes[to].length;
  const moveCount = Math.min(count, space);
  
  for (let i = 0; i < moveCount; i++) {
    newTubes[to].push(newTubes[from].pop());
  }
  
  return newTubes;
}
