const express = require('express');
const passport = require('passport');
const commUtil = require(global.__base + "/modules/commUtil.js");
const router = express.Router();

/** 결제 메인 */
router.get('/payMst', function(req, res, next) {
    
    console.log("prodNo %s", req.query.prodNo);
    
    res.render("pay/payMst", {"prodNo" : req.query.prodNo});
});

/** 기본 라우터 */
commUtil.commRoute("pay/", router);

module.exports = router;
