const express = require('express');
const passport = require('passport');
const commUtil = require(global.__base + "/modules/commUtil.js");
const router = express.Router();

//// 판매 메인
router.get('/selMst', function(req, res, next) {
    
    console.log("cat %s", req.query.cat);
    
    res.render("sel/selMst", {"cat" : req.query.cat});
});

//// 판매 상세
router.get('/selDtl', function(req, res, next) {
    
    console.log("selTitle %s", req.query.selTitle);
    
    res.render("sel/selDtl", {"selTitle" : req.query.selTitle});
});

//// 기본 라우터
commUtil.commRoute("sel/", router);

module.exports = router;
