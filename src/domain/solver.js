// BFSソルバー（8本までの小規模ステージ用）

/**
 * ステージが解けるかチェック
 */
export function isSolvable(tubes, mode, maxMoves = 50) {
  const queue = [{ tubes, moves: 0 }];
  const visited = new Set();
  visited.add(JSON.stringify(tubes));
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    // クリア判定
    if (isCompleted(current.tubes)) {
      return { solvable: true, moves: current.moves };
    }
    
    if (current.moves >= maxMoves) continue;
    
    // 全ての移動を試す
    for (let from = 0; from < current.tubes.length; from++) {
      for (let to = 0; to < current.tubes.length; to++) {
        if (canMove(current.tubes, from, to, mode)) {
          const newTubes = moveTubes(current.tubes, from, to);
          const state = JSON.stringify(newTubes);
          
          if (!visited.has(state)) {
            visited.add(state);
            queue.push({ tubes: newTubes, moves: current.moves + 1 });
          }
        }
      }
    }
  }
  
  return { solvable: false, moves: maxMoves };
}
/**
 * 移動可能チェック
 */
function canMove(tubes, from, to, mode) {
  if (from === to) return false;
  if (tubes[from].length === 0) return false;
  if (tubes[to].length >= 5) return false;
  
  // イージーはどこでもOK
  if (mode === 'easy') return true;
  
  // ハードは同色の上のみ
  if (tubes[to].length === 0) return true;
  
  const topFrom = tubes[from][tubes[from].length - 1];
  const topTo = tubes[to][tubes[to].length - 1];
  
  return topFrom === topTo;
}

/**
 * 移動実行
 */
function moveTubes(tubes, from, to) {
  const newTubes = tubes.map(t => [...t]);
  const topColor = newTubes[from][newTubes[from].length - 1];
  
  // 連続する同色を数える
  let count = 0;
  for (let i = newTubes[from].length - 1; i >= 0; i--) {
    if (newTubes[from][i] === topColor) count++;
    else break;
  }
  
  // 移動できる数
  const space = 5 - newTubes[to].length;
  const moveCount = Math.min(count, space);
  
  // 移動
  for (let i = 0; i < moveCount; i++) {
    newTubes[to].push(newTubes[from].pop());
  }
  
  return newTubes;
}

/**
 * クリア判定
 */
function isCompleted(tubes) {
  for (const tube of tubes) {
    if (tube.length === 0) continue;
    if (tube.length !== 5) return false;
    if (!tube.every(c => c === tube[0])) return false;
  }
  return true;
}
