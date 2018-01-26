// 환경 기본 값 설정
process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'prod' ) ? 'prod' : 'dev';
// APP 의 베이스 경로
global.__base = __dirname + '/';

const commUtil = require('./modules/commUtil.js');
global.commUtil = commUtil;
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'batonbaton', resave: true, saveUninitialized: false })); // 세션 활성화
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
passportLocal(); // 이 부분 추가

// Router 목록
const index = require('./routes/index');
//const users = require('./routes/users');
const com = require('./routes/com');
const sys = require('./routes/sys');
const sel = require('./routes/sel');
const pay = require('./routes/pay');

//세션 처리
app.use(function(req, res, next) {
  
    res.locals.__user = req.user;
    res.locals.__isLogin = (req.user) ? true : false;
    
    //console.log("session 처리 : " + JSON.stringify(req.user));
    
    next();
    
});

app.use('/', index);
//app.use('/users', users);
app.use('/com', com);
app.use('/sys', sys);
app.use('/sel', sel);
app.use('/pay', pay);

// 개발 환경일 경우 테스트 쪽 소스 사용
if (process.env.NODE_ENV == 'dev') {
    let test = require('./test/routes/test');
    app.use('/test', test);
    
    let view = app.get('views');
    let views = [view];
    views.push(path.join(__dirname, 'test/views'));
    
    app.set('views', views );
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message || '오류가 발생하였습니다';
  
    res.locals.error = process.env.NODE_ENV == 'dev' ? err : {};
  
    console.log("ERROR Handler Message[%s]", err.message)

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
