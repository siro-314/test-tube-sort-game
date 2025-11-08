// ゲームの基本定数定義

export const TUBE_CAPACITY = 5;
export const MAX_COLORS = 7;
export const MAX_TUBES = 12; // 最大試験管数

// ゲームモード
export const GameMode = {
  EASY: 'easy',           // どこにでも移動可
  HARD: 'hard',           // 同色の上のみ + アイテム可
  EXTREME: 'extreme',     // ハード + アイテム禁止
  FREE: 'free',           // カスタム設定
  RTA_EASY: 'rta_easy',   // イージー3ステージRTA
  RTA_HARD: 'rta_hard'    // ハード1ステージRTA
};
