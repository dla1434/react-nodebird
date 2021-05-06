const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        //로그인 id/password로 사용되는 필드명을 여기에서 지정
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            // where: { email: email },
            //es6 문법에 따라서 줄일 수 있다.
            where: { email },
          });

          if (!user) {
            //여기서 바로 resp 응답을 내려줄 수가 없고..done을 담아서 처리해야 한다.
            //첫번째는 서버에러
            //두번째는 성공
            //세번째는 클라이언트 에러 메시지
            done(null, false, { reason: '존재하지 않는 이메일입니다!' });
          }

          const result = await bcrypt.compare(password, user.password);
          if (result) {
            //두번재 자리가 성공이므로 사용자 정보를 넘겨준다.
            return done(null, user);
          }

          return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
