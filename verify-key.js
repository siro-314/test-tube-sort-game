import admin from 'firebase-admin';
import dotenv from 'dotenv';

// .envファイルを読み込む
dotenv.config();

console.log('--- Private Key Verification Start ---');

// 1. 環境変数の代わりに、直接Base64文字列を指定してテスト
const rawKey = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5NSUlFdlFJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0JLY3dnZ1NqQWdFQUFvSUJBUUNpeVMzVk90NDNEdUV4XG5pNXlCVUQrR3daK0dGZnpsanR1a1o5VHRTV1dreW5aS3RWdWxvL1lxL1hyWnZSRDRSZXhjK3RkSTdMbndyMEdTXG5pclA4L1kzUFBpRFpBR2g4QWdwZ0c2S2Fpdi9PSFYwZ1pYcWpORDVENXlYalNTNEhTa0dFb2toSnpqR0lkSldjXG5vNGY4TDFmYlNsZzg3U2VHYnZhZm9ETHhjYVE3Rk9kN1JmOTBvdVJuMlI5OWhGeEJWVDlNTkRyZCtxSlVBRTVGXG52YmNmOVRxL0pDanRvNWQ5SHpDOEN1eWFmOHA0OW5WdC8wcHVsNnZlYUlhV3ZaQk1jeUVhVEg1ZFVXZGM5T0dRXG5vbFIrZnNCR21kaVgyMU0rZ2ZrTm9vQ25CUENGSnFQTHozNXJlU0h1Ym9GT2RiemVPUFJFdDRUc0pLK1ZHMTdSXG4vYWpRN3ozQWdNQkFBRUNnZ0VBTDhoSHVOQlh5K2VGT0lyWGZLbTJpL0tueGE4TWxjRnlQWGJ3N0ZuZ0NSZ1lcbjB1TWJMS3JOSmw5VFFUaWJFNVZLeFJ3b04xS3RYYlhEMUtUOElpVzNDMzhjR3paZ2RRNFFSNWUxQ2hJRTlsWnVcbk1JVTVFMURSZWhNT2J3SGJEZTdBL3BLNEQxb0Q5aDdxajVqODRJeHhDSUJ4R0Nrd3NlZytZaXFlNlhwSEQ4UWhcbndHWnZJbExPMTBKeDQzTkdNcG1nelVlTHYvTlM3NWxjeGpvODlGci9YYjI3YWNTaVlsOHNMaUhsTlhRMHdma2Ncbk5JdjRiNW1SMndwRU9SRlBiUFBheStBbVpjemhDd3RqRzhWL2V3emoyTHBDVWlBUU5vbUdjL1BZQm9hY2NqN2JcbkYxV0xtWGtOUHZQN1NOZE83QS8xbVMzb284UFRSODczcDk4Rm9MbFFXUUtCZ1FEZkxTdUFCQzlLZEIxSkk4OStcbjFKUnd5RjBxOU9xek1NOG1mRmlDWm92QUNZVEwxVkN2bVhwbTBmbHRpNmluWDY5ZkN5Uk1Rb3BGTU1tM1pmWEFcbmI5QkROYStPNzIwVGZSMVl1bnAwL1htL3VOQ1RCclhtVjlyc0N3a0FSOVpPRTFPbmNrSWlscHFpRjlOamIvQWxcbjBFbUNTSTBDNEMzdDBkelZ6VDl0bWhDeFF3S0JnUUM2dWoxRGdUR0RZWi8wcXE1K3lEN3VmcDVzbXVzanozRllcbnc3TVJHdURRSmZiM1V4QTREZjZpaUdiM2tWZm1SRlJ1eEY4eEVQOXNCUkJFWm5UbUJBS0tBVVBqei9QY0d6QkJcblBUUFI3RDk2UHBQVDBqQm1WUkhsL0ZQbkRJdlhpMUZURDJnVnN5T0hzLzFXYW52MVhIQmY2VTFqelgzTmZkck5cbkhWd2pHamlBUFFLQmdRRE00RWVWdnNHM0pMOFp2S0VvT25pR3pMa1N6VUdEL0dPK1hkcFc0MUtabVdOcVI4cEpcbldhalBLU1ZFVmpnZVpxMjBuNkxUeXlYcC9LN0JDUDNBaWlUeS9oN0xKYXJKZ0VybmdGRVlndlU0ZHE0cXVyZFRcbjNRVWhPY1FxbU1mNFpxK2VBVHNMUzV4cS8xcFVaNWRhNzBuOEt5UWdKcktqSnN3SERlT1RkeUtweHdLQmdFOTVcbnNWV29DV0Q0RGxMZXlzSmZqSm1KL3ZnT3dBSlA2dGh6QXlaR29HVTNvM1FGUUtQN0lPUWcxbUtNMURMSDVuLzJcbnlPVmpiTE9YUENOQTBJU09ORjUweDJhUlBpUHkxb2tOK1o1aHhXck1jN0wyaFc4b3lpTnZVRzdJNGtSdG9jR09cbmp5aWRSSVFmMGJZVVFJcGdPOXcydXArOStNdWJ3Nk1GMmc5K3U0bXBBb0dBUU5Hc2toUDUxN1NIYWUrZUVERXZcbjlvbkZPaFlFcHZoNnpWbnVIMTRTVWVCMnBkQmw4emdMUHNqQ0xGQ1lmS0JCOWQ3d3gyY2VueVJJczd4Y1ljTFZcblZsMmw1YVlJc1c0dmpMOEt4d3g2SXhrY1l2bkVlQXZnY29oUmdXeE16anJHNDA3OGJVYWk0c3M5VEhhUHRRWElcblJiSWhCZFY2M0pKanhSZ3Y0T0l1cDNBPVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuCg==';
console.log(`Raw Key Length: ${rawKey.length}`);
console.log(`Raw Key Start: ${rawKey.substring(0, 20)}...`);

let privateKey = rawKey;

// 2. Base64デコード試行
if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    console.log('Key does not look like PEM. Attempting Base64 decode...');
    try {
        privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        console.log('Base64 decode successful.');
    } catch (e) {
        console.error('Base64 decode failed:', e.message);
    }
}

// 3. 改行コードの確認
console.log(`Decoded Key Length: ${privateKey.length}`);
const hasRealNewlines = privateKey.includes('\n');
const hasEscapedNewlines = privateKey.includes('\\n');
console.log(`Has real newlines: ${hasRealNewlines}`);
console.log(`Has escaped newlines (\\n): ${hasEscapedNewlines}`);

// 4. 改行置換ロジックの適用
if (hasEscapedNewlines) {
    console.log('Replacing escaped newlines with real newlines...');
    privateKey = privateKey.split('\\n').join('\n');
}

// 5. 最終的なキーのフォーマット確認
console.log(`Final Key Start: ${privateKey.substring(0, 30)}...`);
const isValidFormat = privateKey.includes('-----BEGIN PRIVATE KEY-----') && privateKey.includes('-----END PRIVATE KEY-----');
console.log(`Is Valid PEM Format: ${isValidFormat}`);

// 6. 実際にFirebase Adminでパースできるかテスト
try {
    const cert = admin.credential.cert({
        projectId: 'test-project',
        clientEmail: 'test@example.com',
        privateKey: privateKey
    });
    console.log('✅ SUCCESS: Firebase Admin accepted the key!');
} catch (error) {
    console.error('❌ FAILURE: Firebase Admin rejected the key.');
    console.error('Error details:', error.message);
}

console.log('--- Verification End ---');
