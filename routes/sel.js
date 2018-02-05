const express = require('express');
const passport = require('passport');
const commUtil = require(__base + "/modules/commUtil.js");
const router = express.Router();
const svcSelMst = require(__base + "/model/svc/svcSelMst.js");
const svcSelGods = require(__base + "/model/svc/svcSelGods.js");

/** 판매 메인 */
router.get('/selMst', function(req, res, next) {
    
    console.log("cat %s", req.query.cat);
    
    let promise1 = commUtil.getCdList("CAT_CD").then(function (results) {
       
        res.locals.catCd = results;
       
    });
    
    let cat;
    
    let promis2 = commUtil.getCd("CAT_CD", req.query.cat).then(function (results) {
       
        cat = {"catCd" : results["CD_VAL"], "catNm" : results["CD_NM"]};
       
    });
    
    Promise.all([promise1, promis2]).then(function () {
        
        res.render("sel/selMst", {"cat" : cat});
	   
    });
    
    
});

/** 판매 상세 */
router.get('/selDtl', function(req, res, next) {
    
    console.log("selTitle %s", req.query.selTitle);
    
    res.render("sel/selDtl", {"selTitle" : req.query.selTitle});
});

/** 판매등록1 */
router.get('/selReg1', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let promise1 = commUtil.getCdList("CAT_CD").then(function (results) {
       
        res.locals.catCd = results;
       
    });
    
    promises.push(promise1);

    let rParam = {};
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg1', rParam);
	   
    });
});

/** 판매등록1 */
router.get('/selReg1/:svcSeq', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let promise1 = commUtil.getCdList("CAT_CD").then(function (results) {
       
        res.locals.catCd = results;
       
    });
    
    promises.push(promise1);

    let rParam = {};
    
    let promise2 = getSvcMst(req.params.svcSeq);
        
    promises.push(promise2);
    
    promise2.then(function (result) {
        rParam = result;
    });
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg1', rParam);
	   
    });
});

/** 판매등록2 */
router.get('/selReg2/:svcSeq', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    
    let promise2 = getSvcMst(req.params.svcSeq);
        
    promises.push(promise2);
        
    promise2.then(function (result) {
        rParam = result;
    });
    
    let promise3 = new Promise(function (resolve, reject) {
        
        svcSelGods.selectList({"SVC_SEQ" : req.params.svcSeq }, " ORDER BY SVC_SEQ, GODS_SEQ ", function (err, results) {
            
            if (err) {
                //reject(err);
                return next(err, req, res);
                
            } else {
                rParam["list"] = results;
                resolve();
            }
            
        });
        
    });
    
    promises.push(promise3);
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg2', rParam);
	   
    });
});

/** 판매등록2 Post */
router.post('/selReg2', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    
    req.body.SEL_USER_ID = req.user["USER_ID"];
    commUtil.setUserInfo(req.body, req.user);
    
    //서비스 순번이 있는경우 Update
    if(req.body.SVC_SEQ) {
        svcSelMst.update(req.body, {"SVC_SEQ" : req.body.SVC_SEQ}, function (err, results) {
            
            if (err) {
                return next(err, req, res);
            } else {
                res.redirect("/sel/selReg2/" + req.body.SVC_SEQ);
            }
            
        });
        
    } else {
        //없는 경우 Insert
        svcSelMst.insert(req.body, function (err, results) {
            
            if (err) {
                return next(err, req, res);
            } else {
                res.redirect("/sel/selReg2/" + results.insertId);
            }
            
        });
        
    }
});

/** 판매등록3 Post */
router.post('/selReg3', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    
    //commUtil.setUserInfo(req.body, req.user);
    
    console.log(req.body);
    
    //기존 상품정보 삭제 후 재등록
    let promise2 = new Promise(function (resolver, reject) {
        
        svcSelGods.delete({"SVC_SEQ" : req.body.SVC_SEQ}, function (err, results) {
            
            if (err) {
                //reject(err);
                return next(err, req, res);
            } else {
                
                let godsNms = req.body.GODS_NM;
                let godsUprcs = req.body.GODS_UPRC;
                let godsDtls = req.body.GODS_DTL;
                let svcSeq = req.body.SVC_SEQ;
                
                let isArray = commUtil.isArray(godsNms);
                
                let data = null;
                
                if (isArray) {
                    
                    data = [];
                    
                    for (let idx = 0, _max = godsNms.length ; idx < _max ; idx ++) {
                        
                        let godsNm = godsNms[idx];
                        let godsUprc = godsUprcs[idx];
                        let godsDtl = godsDtls[idx];
                        
                        let row = {"SVC_SEQ" : svcSeq, "GODS_NM" : godsNm, "GODS_UPRC" : godsUprc, "GODS_DTL" : godsDtl};
                        row["GODS_SEQ"] = idx + 1;
                        
                        commUtil.setUserInfo(row, req.user);
                        
                        data.push(row);
                    }
                } else {
                    
                    data = { "SVC_SEQ" : svcSeq, "GODS_SEQ" : 1, "GODS_NM" : godsNms, "GODS_UPRC" : godsUprcs, "GODS_DTL" : godsDtls };
                    
                    commUtil.setUserInfo(data, req.user);
                }
                
                svcSelGods.insert(data, function (err, results) {
                    
                    if(err) {
                        //reject(err);
                        return next(err, req, res);
                    } else {
                        resolver({});
                    }
                    
                });
            }
            
        });
        
    });
    
    promises.push(promise2);
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg3', rParam);
	   
    });
});

function getSvcMst(svcSeq) {
    
    let promise =  new Promise(function (resolve, reject) {
            
        svcSelMst.select(svcSeq, function (err, results, fields) {
            
            if (err) {
                //reject(err);
                return next(err, req, res);
            }
            
            if (results && results.length >= 1) {
                
                resolve(results[0]);
            } else {
                resolve({});
            }
    
        })
    });
    
    return promise;

}

/** 기본 라우터 */
commUtil.commRoute("sel/", router);

module.exports = router;
