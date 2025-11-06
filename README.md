# API 地址加密分发

## 客户端使用
```js
fetch('https://raw.githubusercontent.com/yyssr2025/api-addr/main/encrypted_config.json')
  .then(r => r.json())
  .then(data => decrypt(data)); // 你实现的解密函数
