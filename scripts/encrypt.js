// scripts/encrypt.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// === 从环境变量读取真实 API 地址（不写死！）===
const API_URL = process.env.API_URL;
const BACKUP_URL = process.env.BACKUP_URL || "";

if (!API_URL) {
  console.error("错误：API_URL 环境变量未设置！");
  process.exit(1);
}

const config = {
  api: API_URL,
  backup: BACKUP_URL
};

// === 密钥也从环境变量读 ===
const KEY = Buffer.from(process.env.API_KEY_BASE64, 'base64');
if (KEY.length !== 32) {
  console.error("密钥必须 32 字节！");
  process.exit(1);
}

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

fs.writeFileSync(path.join(__dirname, '../encrypted_config.json'), JSON.stringify(output, null, 2));
console.log('encrypted_config.json 已生成！');
