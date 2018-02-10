const express = require('express');
const passport = require('passport');
const commUtil = require(__base + "/modules/commUtil.js");
const router = express.Router();
const svcSelMst = require(__base + "/model/svc/svcSelMst.js");
const svcSelGods = require(__base + "/model/svc/svcSelGods.js");
const svcSelImg = require(__base + "/model/svc/svcSelImg.js");
const svcSelMov = require(__base + "/model/svc/svcSelMov.js");

/** 판매 메인 */
router.get('/selMst/:cat', function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    
    let catCd = req.params.cat;
    
    //페이지
    let page = req.query.page || 1;
    
    //페이지당 건수
    let pCnt = 8;
    
    //조건
    let where = {};
    
    //정렬 순서
    let order = req.query.order || "10";
    let orderStr = "";
    
    if ("10" == order) {
        orderStr = " ORDER BY A.REG_DTTM DESC ";
    }
    
    rParam["page"] = page;
    rParam["pCnt"] = pCnt;
    rParam["order"] = order;
    
    let promise1 = commUtil.getCdList("CAT_CD").then(function (results) {
       
        res.locals.catCd = results;
       
    });
    
    promises.push(promise1);
    
    let promise2 = commUtil.getCd("CAT_CD", catCd).then(function (results) {
       
        rParam["cat"] = {"catCd" : results["CD_VAL"], "catNm" : results["CD_NM"]};
       
    });
    
    promises.push(promise2);
    
    let promise3 = new Promise(function (resolver, reject) {
        
        svcSelMst.selectListMst(catCd, where, {"PAGE" : page, "CNT" : pCnt}, orderStr, function (err, results) {
            if (err) {
                next(err, req, res);
                reject();
            } else {
                rParam["list"] = results;
                resolver();
            }
        });
        
    });
    
    promises.push(promise3);
    
    let promise4 = new Promise(function (resolver, reject) {
        
        svcSelMst.selectMstCnt(catCd, where, function (err, cnt) {
            if (err) {
                next(err, req, res);
                reject();
            } else {
                rParam["totCnt"] = cnt;
                resolver();
            }
        });
        
    });
    
    promises.push(promise4);
    
    Promise.all(promises).then(function () {
        
        res.render("sel/selMst", rParam);
	   
    });
    
});

/** 판매 상세 */
router.get('/selDtl/:svcSeq', function(req, res, next) {
    
    let svcSeq = req.params.svcSeq;
    
    let rParam = {};

    let promises = [];
    
    let promise1 = getSvcMst(req.params.svcSeq);
    
    promises.push(promise1);
        
    promise1.then(function (result) {
        
        rParam = Object.assign(rParam, result);
    });
    
    let promise2 = new Promise(function (resolve, reject) {
        
        svcSelGods.selectList({"SVC_SEQ" : svcSeq }, " ORDER BY SVC_SEQ, GODS_SEQ ", function (err, results) {
            
            if (err) {
                //reject(err);
                next(err, req, res);
                
            } else {
                rParam["list"] = results;
                resolve({});
            }
            
        });
        
    });
    
    promises.push(promise2);
    
    let promise3 = new Promise(function (resolver, reject) {
        svcSelImg.selectList({"SVC_SEQ" : svcSeq}, null, function (err, results) {
            
            if (err) {
                next(err, req, res);
            } else {
                rParam["list2"] = results;
                resolver();
            }
            
        });
    });
    
    promises.push(promise3);
    
    let promise4 = new Promise(function (resolver, reject) {
        svcSelMov.selectList({"SVC_SEQ" : svcSeq}, null, function (err, results) {
            
            if (err) {
                next(err, req, res);
            } else {
                rParam["list3"] = results;
                resolver();
            }
            
        });
    });
    
    promises.push(promise4);
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selDtl', rParam);
	   
    });
    
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
        rParam = Object.assign(rParam, result);
    });
    
    let promise3 = new Promise(function (resolve, reject) {
        
        svcSelGods.selectList({"SVC_SEQ" : req.params.svcSeq }, " ORDER BY SVC_SEQ, GODS_SEQ ", function (err, results) {
            
            if (err) {
                //reject(err);
                next(err, req, res);
                
            } else {
                rParam["list"] = results;
                resolve({});
            }
            
        });
        
    });
    
    promises.push(promise3);
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg2', rParam);
	   
    });
});

/** 판매등록3 */
router.get('/selReg3/:svcSeq', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    
    let promise2 = getSvcMst(req.params.svcSeq);
        
    promises.push(promise2);
        
    promise2.then(function (result) {
        rParam = result;
    });
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg3', rParam);
	   
    });
});

/** 판매등록4 */
router.get('/selReg4/:svcSeq', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    let svcSeq = req.params.svcSeq;
    
    let promise2 = getSvcMst(req.params.svcSeq);
    
    promises.push(promise2);
        
    promise2.then(function (result) {
        
        rParam = Object.assign(rParam, result);
    });
    
    let promise3 = new Promise(function (resolver, reject) {
        svcSelImg.selectList({"SVC_SEQ" : svcSeq}, null, function (err, results) {
            
            if (err) {
                next(err, req, res);
            } else {
                rParam["list"] = results;
                resolver();
            }
            
        });
    });
    
    promises.push(promise3);
    
    let promise4 = new Promise(function (resolver, reject) {
        svcSelMov.selectList({"SVC_SEQ" : svcSeq}, null, function (err, results) {
            
            if (err) {
                next(err, req, res);
            } else {
                rParam["list2"] = results;
                resolver();
            }
            
        });
    });
    
    promises.push(promise4);
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg4', rParam);
	   
    });
});

/** 판매등록5 */
router.get('/selReg5/:svcSeq', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    let svcSeq = req.params.svcSeq;
    
    let promise2 = getSvcMst(req.params.svcSeq);
    
    promises.push(promise2);
        
    promise2.then(function (result) {
        
        rParam = Object.assign(rParam, result);
    });
    
    Promise.all(promises).then(function () {
        
        res.render('sel/selReg5', rParam);
	   
    });
});

/** 판매등록2 Post */
router.post('/selReg2', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    
    req.body.SEL_USER_ID = req.user["USER_ID"];
    req.body["SVC_STAT_CD"] = "10"; //서비스 상태 코드 '임시저장'
    commUtil.setUserInfo(req.body, req.user);
    
    //서비스 순번이 있는경우 Update
    if(req.body.SVC_SEQ) {
        svcSelMst.update(req.body, {"SVC_SEQ" : req.body.SVC_SEQ}, function (err, results) {
            
            if (err) {
                next(err, req, res);
            } else {
                res.redirect("/sel/selReg2/" + req.body.SVC_SEQ);
            }
            
        });
        
    } else {
        //없는 경우 Insert
        svcSelMst.insert(req.body, function (err, results) {
            
            if (err) {
                next(err, req, res);
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
    
    let svcSeq = req.body.SVC_SEQ;
    
    //commUtil.setUserInfo(req.body, req.user);
    
    console.log(req.body);
    
    //기존 상품정보 삭제 후 재등록
    let promise2 = new Promise(function (resolver, reject) {
        
        svcSelGods.delete({"SVC_SEQ" : svcSeq}, function (err, results) {
            
            if (err) {
                //reject(err);
                next(err, req, res);
            } else {
                
                let godsNms = req.body.GODS_NM;
                let godsUprcs = req.body.GODS_UPRC;
                let godsDtls = req.body.GODS_DTL;
                
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
                        next(err, req, res);
                    } else {
                        resolver({});
                    }
                    
                });
            }
            
        });
        
    });
    
    promises.push(promise2);
    
    Promise.all(promises).then(function () {
        
        res.redirect("/sel/selReg3/" + svcSeq);
	   
    });
});

/** 판매등록4 Post */
router.post('/selReg4', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    let svcSeq = req.body.SVC_SEQ;
    
    commUtil.setUserInfo(req.body, req.user);
    
    svcSelMst.update(req.body, {"SVC_SEQ" : svcSeq}, function (err, results) {
        
        if (err) {
            next(err, req, res);
        } else {
            res.redirect("/sel/selReg4/" + svcSeq);
        }
        
    });
});

/** 판매등록5 Post */
router.post('/selReg5', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    
    let svcSeq = req.body.SVC_SEQ;
    
    commUtil.setUserInfo(req.body, req.user);
    
    //기존 이미지 삭제 후 재등록
    let promise2 = new Promise(function (resolver, reject) {
        
        svcSelImg.delete({"SVC_SEQ" : svcSeq}, function (err, results) {
            
            if (err) {
                //reject(err);
                next(err, req, res);
            } else {
                
                let attcFileSeqs = req.body.ATTC_FILE_SEQ;
                
                if (!attcFileSeqs) { return resolver(); };
                
                let isArray = commUtil.isArray(attcFileSeqs);
                
                let data = null;
                
                if (isArray) {
                    
                    data = [];
                    
                    for (let idx = 0, _max = attcFileSeqs.length ; idx < _max ; idx ++) {
                        
                        let attcFileSeq = attcFileSeqs[idx];
                        
                        let row = {"SVC_SEQ" : svcSeq, "ATTC_FILE_SEQ" : attcFileSeq};
                        row["SVC_IMG_SEQ"] = idx + 1;
                        
                        commUtil.setUserInfo(row, req.user);
                        
                        data.push(row);
                    }
                } else {
                    
                    data = { "SVC_SEQ" : svcSeq, "SVC_IMG_SEQ" : 1, "ATTC_FILE_SEQ" : attcFileSeqs };
                    
                    commUtil.setUserInfo(data, req.user);
                }
                
                svcSelImg.insert(data, function (err, results) {
                    
                    if(err) {
                        //reject(err);
                        next(err, req, res);
                    } else {
                        resolver({});
                    }
                    
                });
            }
            
        });
        
    });
    
    promises.push(promise2);
    
    //기존 동영상 삭제 후 재등록
    let promise3 = new Promise(function (resolver, reject) {
        
        svcSelMov.delete({"SVC_SEQ" : svcSeq}, function (err, results) {
            
            if (err) {
                //reject(err);
                next(err, req, res);
            } else {
                
                let attcFileSeqs = req.body.ATTC_FILE_SEQ2;
                
                if (!attcFileSeqs) { return resolver(); }
                
                let isArray = commUtil.isArray(attcFileSeqs);
                
                let data = null;
                
                if (isArray) {
                    
                    data = [];
                    
                    for (let idx = 0, _max = attcFileSeqs.length ; idx < _max ; idx ++) {
                        
                        let attcFileSeq = attcFileSeqs[idx];
                        
                        let row = {"SVC_SEQ" : svcSeq, "ATTC_FILE_SEQ" : attcFileSeq};
                        row["SVC_MOV_SEQ"] = idx + 1;
                        
                        commUtil.setUserInfo(row, req.user);
                        
                        data.push(row);
                    }
                } else {
                    
                    data = { "SVC_SEQ" : svcSeq, "SVC_MOV_SEQ" : 1, "ATTC_FILE_SEQ" : attcFileSeqs };
                    
                    commUtil.setUserInfo(data, req.user);
                }
                
                svcSelMov.insert(data, function (err, results) {
                    
                    if(err) {
                        //reject(err);
                        next(err, req, res);
                    } else {
                        resolver({});
                    }
                    
                });
            }
            
        });
        
    });
    
    promises.push(promise3);
    
    
    Promise.all(promises).then(function () {
        res.redirect("/sel/selReg5/" + svcSeq);
    });
        
});

/** 판매등록5 Post */
router.post('/selRegOk', commUtil.chkLogin, function(req, res, next) {
    
    let promises = [];
    
    let rParam = {};
    let svcSeq = req.body.SVC_SEQ;
    
    commUtil.setUserInfo(req.body, req.user);
    req.body["SVC_STAT_CD"] = "20"; //서비스 상태코드 '작성완료'
    
    svcSelMst.update(req.body, {"SVC_SEQ" : svcSeq}, function (err, results) {
        
        if (err) {
            next(err, req, res);
        } else {
            res.redirect("/sel/selRegOk");
        }
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
