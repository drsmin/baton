const express = require('express');
const passport = require('passport');
const commUtil = require(global.__base + "/modules/commUtil.js");
const router = express.Router();

/** 로그인 화면 */
router.get('/login', function(req, res, next) {
    
    if (true == res.locals.__isLogin) {
        res.redirect("/");
    }
    
    let message = req.flash("error");
    
    res.render('com/login', {"_message" : message[0]});
});

/** 로그인 Local 전략 */
router.post('/login.do', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/com/login',
    failureFlash : '아이디 또는 패스워드가 잘못되었습니다'
}));

/** 기본 라우터 */
commUtil.commRoute("com/", router);

module.exports = router;
