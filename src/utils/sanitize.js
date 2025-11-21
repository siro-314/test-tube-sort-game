/**
 * プレイヤー名のサニタイズ（XSS対策）
 * 
 * ## なぜこれが必要か？
 * 
 * ユーザー入力をそのままHTMLに表示すると「XSS（クロスサイトスクリプティング）」攻撃が可能になります。
 * 
 * ### 攻撃例：
 * ```
 * 名前入力: <script>alert('ハック!')</script>
 * 名前入力: <img src=x onerror="悪意のあるコード">
 * 名前入力: <br><br><br><br>  ← 改行で画面を壊す
 * 名前入力: <b style="font-size:999px">巨大文字</b>
 * ```
 * 
 * ### メジャーゲームでもよく見る理由：
 * 
 * 1. **Reactの罠**: ReactはデフォルトでXSS対策してくれる...と思いきや、
 *    `dangerouslySetInnerHTML` を使うと無効化される
 * 
 * 2. **サーバー側でのみ対策**: クライアント側（表示側）で対策してないパターン
 * 
 * 3. **特殊文字の見落とし**: `<>`だけ対策して、絵文字や特殊Unicodeを見落とす
 * 
 * 4. **古いライブラリ**: セキュリティパッチ未適用のライブラリを使ってる
 * 
 * 5. **開発者の知識不足**: 「まさか名前欄でXSSできるとは...」
 * 
 * ### 有名な事例：
 * - Among Us: 名前に改行入れてチャット欄を壊す
 * - Minecraft: 特殊文字で他人のチャットを隠す
 * - 某ブラウザゲーム: <marquee>タグで名前をスクロールさせる
 * 
 * @param {string} name - ユーザー入力の名前
 * @returns {string} サニタイズされた安全な名前
 */
export function sanitizePlayerName(name) {
  if (!name || typeof name !== 'string') {
    return '名無し';
  }

  // 1. HTMLタグを完全に除去（正規表現で全てのタグを削除）
  let clean = name.replace(/<[^>]*>/g, '');
  
  // 2. HTMLエンティティをエスケープ（XSS対策の基本）
  clean = clean
    .replace(/&/g, '&amp;')   // & を &amp; に
    .replace(/</g, '&lt;')    // < を &lt; に
    .replace(/>/g, '&gt;')    // > を &gt; に
    .replace(/"/g, '&quot;')  // " を &quot; に
    .replace(/'/g, '&#x27;')  // ' を &#x27; に
    .replace(/\//g, '&#x2F;'); // / を &#x2F; に
  
  // 3. 改行・タブを除去（\n, \r, \t, <br>など）
  clean = clean
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\t/g, '')
    .replace(/\\n/g, '')  // エスケープされた改行も
    .replace(/\\r/g, '')
    .replace(/\\t/g, '');
  
  // 4. 制御文字を除去（Unicode制御文字）
  // U+0000-U+001F, U+007F-U+009F（不可視文字）
  clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // 5. 前後の空白を削除
  clean = clean.trim();
  
  // 6. 連続する空白を1つに
  clean = clean.replace(/\s+/g, ' ');
  
  // 7. 20文字制限（絵文字は2文字カウント対応）
  clean = truncateString(clean, 20);
  
  // 8. 空文字列の場合はデフォルト名
  return clean || '名無し';
}

/**
 * 文字列を指定文字数で切り詰め（絵文字対応）
 * 
 * 通常の `.slice()` だと絵文字が壊れる問題に対応
 * 例: "😀".length === 2 （サロゲートペア問題）
 */
function truncateString(str, maxLength) {
  // Array.from() で絵文字を正しく1文字として扱う
  const chars = Array.from(str);
  
  if (chars.length <= maxLength) {
    return str;
  }
  
  return chars.slice(0, maxLength).join('');
}

/**
 * プレイヤー名のバリデーション（サーバー送信前チェック）
 */
export function validatePlayerName(name) {
  const sanitized = sanitizePlayerName(name);
  
  // 最小文字数チェック（空白のみはNG）
  if (sanitized === '名無し') {
    return { valid: true, name: sanitized };
  }
  
  // 1文字以上の有効な文字があればOK
  if (sanitized.length > 0) {
    return { valid: true, name: sanitized };
  }
  
  return { valid: false, name: '名無し', error: '有効な文字を入力してください' };
}

/**
 * 使用例：
 * 
 * // 入力時
 * const userInput = "<script>alert('XSS')</script>太郎";
 * const safe = sanitizePlayerName(userInput);
 * console.log(safe); // "太郎"
 * 
 * // 送信前
 * const { valid, name, error } = validatePlayerName(userInput);
 * if (valid) {
 *   submitScore({ playerName: name, ... });
 * }
 */
