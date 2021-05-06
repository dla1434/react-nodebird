const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();

// app.use(cors());
// cors를 다 허용하면 보안에 위험이 생길수도 있으므로 도메인 지정이 필요하지만 지금은 테스트이니깐 다 허용하자
// app.use(cors({
//   origin: 'https://nodebird.com'
// }));
app.use(
  cors({
    origin: '*',
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('서버 실행 중!!');
});
