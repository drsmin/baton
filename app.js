/** 환경 설정 기본 값 */
process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'prod' ) ? 'prod' : 'dev';
/** APP 의 베이스 경로 */
global.__base = __dirname + '/';

const env = require(__base + 'config/env.js');
//const commUtil = require('./modules/commUtil.js');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session'); // 세션 설정
const passport = require('passport'); // local전략
const passportLocal = require('./modules/passport.js'); // local전략

const app = express();

const expressWs = require('express-ws')(app);

global.__env = env;

/** 기본 view 디렉토리 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // favicon 설정 후 주석 제거
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'batonbaton', resave: true, saveUninitialized: false })); // 세션 활성화
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

/** passport 로컬 적용 */
app.use(passport.initialize());
app.use(passport.session());
passportLocal();

/** 라우터 설정 */
const index = require('./routes/index');
const com = require('./routes/com');
const sys = require('./routes/sys');
const sel = require('./routes/sel');
const pay = require('./routes/pay');

/** Router 처리 전 세션 및 메세지 처리 middleware */
app.use(function(req, res, next) {
  
    res.locals.__user = req.user;
    res.locals.__isLogin = (req.user) ? true : false;
    res.locals.__isAdmin = false;
    
    if (req.user) {
        if ("90" == req.user["USER_ROLE_CD"]) {
            res.locals.__isAdmin = true;
        }
    }
    
    let __msg = req.flash("__msg");
    
    //flash 메세지가 있는 경우 처리
    if (__msg.length > 0) {
        res.locals.__msg = __msg;
    } else {
        res.locals.__msg = null;
    }
    
    //console.log("session 처리 : " + JSON.stringify(req.user));
    
    next();
    
});

app.use('/', index);
app.use('/com', com);
app.use('/sys', sys);
app.use('/sel', sel);
app.use('/pay', pay);

/** 개발 환경일 경우 test쪽 소스 사용 */
if (process.env.NODE_ENV == 'dev') {
    let test = require('./test/routes/test');
    app.use('/test', test);
    
    let view = app.get('views');
    let views = [view];
    views.push(path.join(__dirname, 'test/views'));
    
    app.set('views', views );
}


/** 404 error handler */
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/** error handler */
app.use(function(err, req, res, next) {

    if (err.userMsg) {
        res.locals.message = err.userMsg;
    } else {
        res.locals.message = err.message || '오류가 발생하였습니다';
    }
    
    if (err && err.code == "ER_DUP_ENTRY") {
        res.locals.message = "데이터 등록 중 중복 오류가 발생 하였습니다.";
    }
  
    //개발 환경일 때만 상세 trace 로그 표시
    res.locals.error = process.env.NODE_ENV == 'dev' ? err : {};
  
    console.log(err);
    console.log("ERROR Handler Message[%s]", err.message);

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;