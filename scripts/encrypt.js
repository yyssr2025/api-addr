// scripts/encrypt.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// === 你要加密的 API 地址 ===
const config = {
  api: "https://38.22.93.250:2025",
  backup: "https://38.22.93.250:12025"
};

// === 修复：正确读取 Base64 密钥 ===
const keyBase64 = process.env.API_KEY_BASE64;
if (!keyBase64) {
  console.error("错误：API_KEY_BASE64 环境变量未设置！");
  process.exit(1);
}

let KEY;
try {
  KEY = Buffer.from(keyBase64, 'base64');
  if (KEY.length !== 32) {
    console.error(`密钥长度错误：${KEY.length} 字节，AES-256 必须 32 字节！`);
    process.exit(1);
  }
} catch (e) {
  console.error("密钥 Base64 解码失败！");
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

// 写入到仓库根目录
fs.writeFileSync(path.join(__dirname, '../encrypted_config.json'), JSON.stringify(output, null, 2));
console.log('encrypted_config.json 已成功生成！');
