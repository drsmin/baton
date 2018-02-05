const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const comUser = require(global.__base + '/model/com/comUser.js');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy

/** pass포트 로컬 전략 모듈 */
module.exports = function() {
    /** 로컬 전략 직렬화 */
    passport.serializeUser(function(user, done) { // Strategy 성공 시 호출됨
        done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
    });
    
    /** 실제 세션의 유저 정보를 세팅 */
    passport.deserializeUser(function(user, done) { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
        done(null, user); // 여기의 user가 req.user가 됨
    });

    /** 로컬 전략 */
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
    
    /** Facebook 전략 */
    passport.use(new FacebookStrategy({
        clientID: __env["facebookAppId"],
        clientSecret: __env["facebookSecretCode"],
        callbackURL: '/com/login/facebook/callback',
        session: true, // 세션에 저장 여부
        passReqToCallback: true }
    , function(req, accessTken, refreshToken, profile, done) {
        comUser.selectLoginFB(profile.id, function(err, results) {
            
            if (err) return done(err, false); //서버 에러 처리
            if (!results || results.length === 0) {
                
                console.log(profile);
                
                //없는 경우 신규로 등록
                let data = {};
                data["USER_ID"] = profile.id;
                data["USER_NM"] = profile.displayName;
                data["SNS_DIV_CD"] = "FB";
                
                comUser.insert(data, function (err, results) {
                    
                    if (err) {
                        return done("회원 등록 중 오류", null);
                    }
                    
                    return done(null, data); // 검증 성공
                });
            } else {
                return done(null, results[0]); // 검증 성공
            }
      
        });
        }
    ));
    
    /** google 전략 */
    passport.use(new GoogleStrategy({
            clientID: __env["googleAppId"],
            clientSecret: __env["googleSecretCode"],
            callbackURL: '/com/login/google/callback',
            session: true, // 세션에 저장 여부
            passReqToCallback: true }
        , function(req, accessTken, refreshToken, profile, done) {
        comUser.selectLoginGG(profile.id, function(err, results) {
            
            if (err) return done(err, false); //서버 에러 처리
            if (!results || results.length === 0) {
                
                console.log(profile);
                
                //없는 경우 신규로 등록
                let data = {};
                data["USER_ID"] = profile.id;
                data["USER_NM"] = profile.displayName;
                data["SNS_DIV_CD"] = "GG";
                data["LIVE_AREA"] = profile.placeLived[0];
                data["LNGG_CD"] = profile.language;
                
                
                comUser.insert(data, function (err, results) {
                    
                    if (err) {
                        return done("회원 등록 중 오류", null);
                    } else {
                        return done(null, data); // 검증 성공                        
                    }
                });
                
            } else {
                return done(null, results[0]); // 검증 성공
            }
      
        });
        }
    ));
};