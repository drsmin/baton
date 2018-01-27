const express = require('express');
const passport = require('passport');
const commUtil = require(global.__base + "/modules/commUtil.js");
const router = express.Router();
const comUser = require(global.__base + '/model/com/comUser.js');

/** 로그인 */
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

/** 회원 가입 */
router.get('/joinUser', function(req, res, next) {
    
    if (true == res.locals.__isLogin) {
        res.redirect("/");
    }
    
    commUtil.getCdList("LNGG_CD", function (err, results) {
        
        if (err) {
            throw new Error(err);
        }
        
        let lnggCd = results;
        
        commUtil.getCdList("NATI_CD", function (err, results) {
        
            if (err) {
                throw new Error(err);
            }
            
            let natiCd = results;
            
            res.render('com/joinUser', {"lnggCd" : lnggCd, "natiCd" : natiCd });
        
        });
    });
        
});

/** 회원 가입 처리 */
router.post("/joinUser", function (req, res, next) {
    
    req.body["USER_ID"] = req.body.EMAL_ADDR;
    
    comUser.insert(req.body, function(err, results){
        res.redirect("/");
    });
    
});


/** 기본 라우터 */
commUtil.commRoute("com/", router);

module.exports = router;
