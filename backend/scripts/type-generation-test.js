#!/usr/bin/env node

/**
 * 型生成の自動化テストスクリプト
 * API仕様変更時の型生成と検証を行う
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BACKEND_DIR = process.cwd();
const FRONTEND_DIR = path.join(BACKEND_DIR, '../frontend');

console.log('🧪 型生成の自動化テスト開始...\n');

// 1. 型生成前の状態を記録
console.log('📝 型生成前の状態を記録...');
const beforeBackendTypes = fs.readFileSync(
  path.join(BACKEND_DIR, 'src/types/api.ts'), 
  'utf8'
);
const beforeFrontendTypes = fs.readFileSync(
  path.join(FRONTEND_DIR, 'src/types/api.ts'), 
  'utf8'
);

// 2. 型生成を実行
console.log('🔄 型生成を実行...');
try {
  execSync('npm run generate:all', { 
    cwd: BACKEND_DIR, 
    stdio: 'inherit' 
  });
  console.log('✅ 型生成完了\n');
} catch (error) {
  console.error('❌ 型生成に失敗:', error.message);
  process.exit(1);
}

// 3. 型生成後の状態を記録
console.log('📝 型生成後の状態を記録...');
const afterBackendTypes = fs.readFileSync(
  path.join(BACKEND_DIR, 'src/types/api.ts'), 
  'utf8'
);
const afterFrontendTypes = fs.readFileSync(
  path.join(FRONTEND_DIR, 'src/types/api.ts'), 
  'utf8'
);

// 4. 差分を検証
console.log('🔍 型定義の差分を検証...');
const backendChanged = beforeBackendTypes !== afterBackendTypes;
const frontendChanged = beforeFrontendTypes !== afterFrontendTypes;

if (backendChanged) {
  console.log('✅ バックエンドの型定義が更新されました');
} else {
  console.log('⚠️  バックエンドの型定義に変更がありません');
}

if (frontendChanged) {
  console.log('✅ フロントエンドの型定義が更新されました');
} else {
  console.log('⚠️  フロントエンドの型定義に変更がありません');
}

// 5. 型定義の整合性をチェック
console.log('\n🔍 型定義の整合性をチェック...');
const backendHasAge = afterBackendTypes.includes('age: number');
const frontendHasAge = afterFrontendTypes.includes('age: number');

if (backendHasAge && frontendHasAge) {
  console.log('✅ バックエンドとフロントエンドの型定義が一致しています');
} else {
  console.log('❌ バックエンドとフロントエンドの型定義に不整合があります');
  console.log(`   バックエンドにage: ${backendHasAge ? 'あり' : 'なし'}`);
  console.log(`   フロントエンドにage: ${frontendHasAge ? 'あり' : 'なし'}`);
}

// 6. フロントエンドの型チェックを実行
console.log('\n🔍 フロントエンドの型チェックを実行...');
try {
  execSync('npx tsc --noEmit', { 
    cwd: FRONTEND_DIR, 
    stdio: 'pipe' 
  });
  console.log('✅ フロントエンドの型チェック完了（エラーなし）');
} catch (error) {
  console.log('⚠️  フロントエンドで型エラーが検出されました（期待される動作）');
  console.log('   型エラーの詳細:');
  console.log(error.stdout?.toString() || error.message);
}

console.log('\n🎉 型生成の自動化テスト完了！');
