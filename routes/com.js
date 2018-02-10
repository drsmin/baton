const express = require('express');
const passport = require('passport');
const commUtil = require(__base + "/modules/commUtil.js");
const router = express.Router();
const comUser = require(__base + '/model/com/comUser.js');

/** 로그인 */
router.get('/login', function(req, res, next) {
    
    if (true == res.locals.__isLogin) {
        res.redirect("/");
    } else {
    
        let message = req.flash("error");
        
        res.render('com/login', {"_message" : message[0]});
    }

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
    
    //req.body["USER_ID"] = req.body.EMAL_ADDR;
    req.body["SNS_DIV_CD"] = "10";
    
    comUser.insert(req.body, function(err, results) {
        
        if(err) {
            return next(err, req, res);
        }
        
        req.flash("__msg", "회원 가입이 완료 되었습니다");
        
        res.redirect("/");
    });
    
});

/** ID 중복 체크 */
router.post("/chkDupUserId", function (req, res, next) {
    
    comUser.chkDupUserId(req.body.USER_ID).then(function (results) {
        res.send(results);
    });
});

/** 이메일 중복 체크 */
router.post("/chkDupEmalAddr", function (req, res, next) {
    
    comUser.chkDupEmalAddr(req.body.EMAL_ADDR, req.body.USER_ID).then(function (results) {
        res.send(results);
    });
});

/** 로그아웃 */
router.get("/logout", function (req, res, next) {
    
    let sess = req.session;
    
    if (sess) {
        
        req.session.destroy( function(err) {
            
            if(err) {
                //console.log(err);
                next(err, req, res);
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
scope: ['public_profile', 'email']
}));

/** 페이스북 로그인 callback */
router.get('/login/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect: '/com/login',
    failureFlash : 'Facebook 로그인을 실패 했습니다.' })
);

/** google 로그인 */
router.get('/login/google', passport.authenticate('google', {
    authType: 'rerequest', 
    scope: ['profile']
}));

/** 페이스북 로그인 callback */
router.get('/login/google/callback', passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect: '/com/login',
    failureFlash : 'Google 로그인을 실패 했습니다.' })
);

/** 판매자 등록 */
router.get('/joinSeller', function(req, res, next) {
    
    if (true == res.locals.__isLogin) {
        res.redirect("/sel/selReg1");
    } else {
        res.render('com/joinSeller');
    }

});

/** 회원 정보 수정 */
router.get('/uptUserInfo', commUtil.chkLogin, function(req, res, next) {
    
    let rParam = {};
    let promises = [];
    
    let promise1 = commUtil.getCdList("LNGG_CD").then(function (results) {
       
        rParam["lnggCd"] = results;
       
    });
    
    promises.push(promise1);
   
    let promise2 = commUtil.getCdList("NATI_CD").then(function (results) {
       
        rParam["natiCd"] = results;

    });
    
    promises.push(promise2);
    
    let promise3 = new Promise(function (resolver, reject) {
        
        let userId = req.user.USER_ID;

        comUser.select(userId, function (err, results) {
            
            if(err) {
                next(err, req, res);
                reject();
            } else {
                
                let bith = results["BITH"];
                
                if (bith && bith.length == 8) {
                    results["BITH"] = bith.replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");
                }
                
                Object.assign(rParam, results);
                resolver();
            }
            
        });
        
    });
    
    promises.push(promise3);
   
    Promise.all(promises).then(function () {
	   
        res.render('com/uptUserInfo', rParam);
    });
        
});

/** 회원 정보 수정 */
router.post('/uptUserInfo', commUtil.chkLogin, function(req, res, next) {
    
    //비밀번호를 변경하지 않는 경우 삭제
    if (!req.body.USER_PW || req.body.USER_PW == "") {
        delete req.body.USER_PW;
    }
    
    comUser.update(req.body.USER_ID, req.body, function (err, results) {
        
        if (err) {
            next(err, req, res);
        } else {
            res.redirect("/");
        }
    });
});

/** 기본 라우터 */
commUtil.commRoute("com/", router);

module.exports = router;
