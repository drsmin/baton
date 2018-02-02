const express = require('express');
const passport = require('passport');
const commUtil = require(__base + "/modules/commUtil.js");
const router = express.Router();
const comUser = require(__base + '/model/com/comUser.js');

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
   
    let lnggCd;
    var promise1 = commUtil.getCdList("LNGG_CD").then(function (results) {
       
        lnggCd = results;
       
    });
   
    let natiCd;
    var promise2 = commUtil.getCdList("NATI_CD").then(function (results) {
       
        natiCd = results;

    });
   
    Promise.all([promise1, promise2]).then(function () {
	   
        res.render('com/joinUser', {"lnggCd" : lnggCd, "natiCd" : natiCd });
    });
   

        
});

/** 회원 가입 처리 */
router.post("/joinUser", function (req, res, next) {
    
    req.body["USER_ID"] = req.body.EMAL_ADDR;
    
    comUser.insert(req.body, function(err, results) {
        
        if(err) {
            return next(err);
        }
        
        req.flash("__msg", "회원 가입이 완료 되었습니다");
        
        res.redirect("/");
    });
    
});

/** 이메일 중복 체크 */
router.post("/chkDupEmalAddr", function (req, res, next) {
    
    comUser.chkDupEmalAddr(req.body.EMAL_ADDR).then(function (results) {
        res.send(results);
    });
});

/** 로그아웃 */
router.get("/logout", function (req, res, next) {
    
    let sess = req.session;
    
    if (sess) {
        
        req.session.destroy( function(err) {
            
            if(err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
    
});

/** 페이스북 로그인 */
router.get('/login/facebook', passport.authenticate('facebook', {
    authType: 'rerequest', 
    scope: ['public_profile', 'email']
}));

/** 페이스북 로그인 callback */
router.get('/login/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect: '/com/login',
    failureFlash : 'Facebook 로그인을 실패 했습니다.' })
);

/** 기본 라우터 */
commUtil.commRoute("com/", router);

module.exports = router;
