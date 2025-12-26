const fs = require('fs');
const path = require('path');

// 获取所有public.json和faircoin.json文件
const jsonFiles = [
  ...fs.readdirSync('pages', { recursive: true })
    .filter(file => file.endsWith('.json'))
    .map(file => path.join('pages', file))
];

let allValid = true;

// 验证每个JSON文件
jsonFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`✓ ${filePath} - Valid JSON`);
  } catch (error) {
    console.log(`✗ ${filePath} - Invalid JSON: ${error.message}`);
    allValid = false;
  }
});

// 退出码
process.exit(allValid ? 0 : 1);