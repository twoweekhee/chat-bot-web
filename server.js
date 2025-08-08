// server.js
const express = require('express');
const path = require('path');
const app = express();

// Render가 제공하는 포트 사용
const PORT = process.env.PORT || 10000;

// React 빌드 파일 제공
app.use(express.static(path.join(__dirname, 'build')));

// React Router를 위한 fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 0.0.0.0에 바인딩 (중요!)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});