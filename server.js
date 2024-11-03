const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const jsonFilePath = path.join(__dirname, 'public', 'assets', 'test2.json');

app.use(express.json());

console.log("서버가 시작되었습니다.");

app.get('/api/medicine', (req, res) => {
  console.log("GET 요청 수신됨"); 
  fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error("파일 읽기 오류:", err); 
      return res.status(500).json({ message: '데이터를 읽는 중 오류가 발생했습니다.' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/medicine', (req, res) => {
  console.log("POST 요청 수신됨:", req.body); 
  fs.writeFile(jsonFilePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error("파일 저장 오류:", err); 
      return res.status(500).json({ message: '데이터를 저장하는 중 오류가 발생했습니다.' });
    }
    res.json({ message: '데이터가 성공적으로 저장되었습니다.' });
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
