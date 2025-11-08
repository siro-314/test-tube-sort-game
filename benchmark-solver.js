// ソルバー性能測定プログラム
import { generateHardStage } from './src/domain/stageGenerator.js';
import { calculateTubeCount } from './src/domain/gameRules.js';

// 簡易BFSソルバー
function solvePuzzle(initialTubes, maxMoves, mode = 'hard') {
  const queue = [{ tubes: initialTubes, moves: 0 }];
  const visited = new Set();
  visited.add(JSON.stringify(initialTubes));
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    // クリア判定
    if (isCompleted(current.tubes)) {
      return { solved: true, moves: current.moves };
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
  
  return { solved: false, moves: maxMoves };
}

// 移動可能チェック（ハードモード）
function canMove(tubes, from, to, mode) {
  if (from === to) return false;
  if (tubes[from].length === 0) return false;
  if (tubes[to].length >= 5) return false;
  
  if (tubes[to].length === 0) return true;
  
  const topFrom = tubes[from][tubes[from].length - 1];
  const topTo = tubes[to][tubes[to].length - 1];
  
  return topFrom === topTo;
}

// 移動実行
function moveTubes(tubes, from, to) {
  const newTubes = tubes.map(t => [...t]);
  const topColor = newTubes[from][newTubes[from].length - 1];
  
  let count = 0;
  for (let i = newTubes[from].length - 1; i >= 0; i--) {
    if (newTubes[from][i] === topColor) count++;
    else break;
  }
  
  const space = 5 - newTubes[to].length;
  const moveCount = Math.min(count, space);
  
  for (let i = 0; i < moveCount; i++) {
    newTubes[to].push(newTubes[from].pop());
  }
  
  return newTubes;
}

// クリア判定
function isCompleted(tubes) {
  for (const tube of tubes) {
    if (tube.length === 0) continue;
    if (tube.length !== 5) return false;
    if (!tube.every(c => c === tube[0])) return false;
  }
  return true;
}

// ベンチマーク実行
async function runBenchmark() {
  console.log('=== ハードモード ソルバー性能測定 ===\n');
  
  const tubeCounts = [9, 10, 11, 12];
  const moveLimits = [70, 90, 110, 130, 150, 170, 190, 200];
  const trials = 10; // 10回で十分
  
  for (const tubeCount of tubeCounts) {
    console.log(`\n試験管${tubeCount}本:`);
    console.log('手数制限 | 成功率 | 平均試行 | 平均時間');
    console.log('---------|--------|----------|----------');
    
    for (const maxMoves of moveLimits) {
      let successCount = 0;
      let totalAttempts = 0;
      let totalTime = 0;
      
      for (let trial = 0; trial < trials; trial++) {
        const startTime = Date.now();
        let attempts = 0;
        let solved = false;
        
        // 10秒制限で試行
        while (Date.now() - startTime < 10000 && !solved) {
          attempts++;
          const tubes = generateHardStage(tubeCount);
          const result = solvePuzzle(tubes, maxMoves);
          
          if (result.solved) {
            solved = true;
            successCount++;
          }
        }
        
        totalAttempts += attempts;
        totalTime += Date.now() - startTime;
      }
      
      const successRate = (successCount / trials * 100).toFixed(1);
      const avgAttempts = (totalAttempts / trials).toFixed(2);
      const avgTime = (totalTime / trials).toFixed(0);
      
      console.log(`${maxMoves}手     | ${successRate}%   | ${avgAttempts}回    | ${avgTime}ms`);
      
      // 成功率90%以上、かつ平均時間が3秒以内なら次の試験管数へ
      if (successRate >= 90 && avgTime < 3000) break;
    }
  }
  
  console.log('\n測定完了！');
}

runBenchmark().catch(console.error);
