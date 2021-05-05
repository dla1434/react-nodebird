const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/api/posts', (req, res) => {
  res.json([
    {
      id: 1,
      content: 'hello',
    },
    {
      id: 2,
      content: 'hello2',
    },
    {
      id: 3,
      content: 'hello3',
    },
  ]);
});

app.post('/api/post', (req, res) => {
  // res.json('작성 완료');
  //응답 작성이 완료 걸 그대로 응답을 주는 경우도 많다.
  res.json({ id: 1, content: 'hello' });
});

app.delete('/api/post', (req, res) => {
  //삭제된 id를 응답으로 내려준다면
  res.json({ id: 1 });
});

app.listen(3065, () => {
  console.log('서버 실행 중');
});
