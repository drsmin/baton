const express = require('express');
const passport = require('passport');
const commUtil = require(global.__base + "/modules/commUtil.js");
const router = express.Router();

/** 매 메인 */
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

//// 판매 상세
router.get('/selDtl', function(req, res, next) {
    
    console.log("selTitle %s", req.query.selTitle);
    
    res.render("sel/selDtl", {"selTitle" : req.query.selTitle});
});

/** 기본 라우터 */
commUtil.commRoute("sel/", router);

module.exports = router;
