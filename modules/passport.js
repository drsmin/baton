const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const comUser = require(global.__base + '/model/com/comUser.js');

module.exports = function() {
    passport.serializeUser(function(user, done) { // Strategy 성공 시 호출됨
        done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
    });

    passport.deserializeUser(function(user, done) { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
        done(null, user); // 여기의 user가 req.user가 됨
    });

    passport.use(new LocalStrategy({ // local 전략을 세움
        usernameField: 'userId',
        passwordField: 'userPw',
        session: true, // 세션에 저장 여부
        passReqToCallback: true,
    }, function(req, userId, userPw, done) {
        comUser.selectLogin(userId, userPw, function (err, results) {
      
        if (err) return done(err); // 서버 에러 처리
        if (!results || results.length === 0) return done(null, false);
      
        return done(null, results[0]); // 검증 성공
      
    });
    }));
};