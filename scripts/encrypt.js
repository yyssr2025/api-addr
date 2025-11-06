// scripts/encrypt.js
const crypto = require('crypto');
const fs = require('fs');

// === 你要加密的真实 API 地址 ===
const config = {
  api: "https://api.your-real-domain.com/v1",
  backup: "https://backup.your-real-domain.com"
};

// === 密钥（从环境变量读，Actions 会自动填）===
const KEY = Buffer.from(process.env.API_KEY_BASE64, 'base64');
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
let encrypted = cipher.update(JSON.stringify(config), 'utf8', 'base64');
encrypted += cipher.final('base64');
const tag = cipher.getAuthTag();

const output = {
  data: encrypted,
  iv: iv.toString('base64'),
  tag: tag.toString('base64'),
  version: new Date().toISOString().split('T')[0] + '-v1',
  update_time: Math.floor(Date.now() / 1000)
};

// 写入文件
fs.writeFileSync('../encrypted_config.json', JSON.stringify(output, null, 2));
console.log('encrypted_config.json 已生成！');
