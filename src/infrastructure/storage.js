// ローカルストレージ管理
const STORAGE_KEYS = {
  PROGRESS: 'testTubeGame_progress',
  DAILY_BONUS: 'testTubeGame_dailyBonus',
  SETTINGS: 'testTubeGame_settings'
};

/**
 * 進行度データの保存
 */
export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save progress:', error);
    return false;
  }
}

/**
 * 進行度データの読み込み
 */
export function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

/**
 * デイリーボーナスの取得状態を保存（日付文字列）
 */
export function saveDailyBonus(dateString) {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_BONUS, dateString);
    return true;
  } catch (error) {
    console.error('Failed to save daily bonus:', error);
    return false;
  }
}

/**
 * 設定の保存
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

/**
 * 設定の読み込み
 */
export function loadSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error('Failed to load settings:', error);
    return getDefaultSettings();
  }
}

/**
 * デフォルト設定
 */
function getDefaultSettings() {
  return {
    soundEnabled: true,
    musicEnabled: true,
    theme: 'default'
  };
}
/**
 * デイリーボーナスが受け取り可能かチェック（0:00基準）
 */
export function canClaimDailyBonus() {
  try {
    const lastClaimDate = localStorage.getItem(STORAGE_KEYS.DAILY_BONUS);
    if (!lastClaimDate) return true;
    
    const today = new Date().toDateString();
    return lastClaimDate !== today;
  } catch (error) {
    console.error('Failed to check daily bonus:', error);
    return false;
  }
}

/**
 * デイリーボーナスを受け取る（日付を保存）
 */
export function claimDailyBonus() {
  const today = new Date().toDateString();
  return saveDailyBonus(today);
}

/**
 * 次のボーナスまでの時間を取得（0:00までの時間）
 */
export function getTimeUntilNextBonus() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } catch (error) {
    console.error('Failed to get time until next bonus:', error);
    return '00:00';
  }
}

/**
 * 水の残量パーセンテージを取得（0:00までの蒸発進行度）
 */
export function getWaterPercentage() {
  try {
    const lastClaimDate = localStorage.getItem(STORAGE_KEYS.DAILY_BONUS);
    if (!lastClaimDate) return 0;
    
    const today = new Date().toDateString();
    if (lastClaimDate !== today) return 0; // 日付が変わっていたら完全蒸発
    
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    
    const elapsed = now - startOfToday;
    const total = endOfToday - startOfToday; // 24時間
    
    // 0:00からの経過時間に応じて減少（100% → 0%）
    const remaining = 100 - (elapsed / total * 100);
    return Math.max(0, Math.min(100, remaining));
  } catch (error) {
    console.error('Failed to get water percentage:', error);
    return 0;
  }
}
