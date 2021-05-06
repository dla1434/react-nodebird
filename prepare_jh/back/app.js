const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const testRouter = require('./routes/test');
const db = require('./models');

const passport = require('passport');
const passportConfig = require('./passport');

const dotenv = require('dotenv');

const app = express();
passportConfig();

dotenv.config();

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

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    //쿠키에 보내주는 랜덤한 문자열은 저희 데이터를 기반으로 만들어진 문자열이다.
    //이 키값이 노출되면 정보가 노출될 수 있다.
    // secret: 'nodebirdsecret',
    //이런 경우를 위해서 dotenv를 설치해서 .env에 변수를 관리하면 좋다.
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/test', testRouter);

app.listen(3065, () => {
  console.log('서버 실행 중!!');
});
