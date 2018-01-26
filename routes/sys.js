const express = require('express');
const commUtil = require(global.__base + "/modules/commUtil.js");
const router = express.Router();

/** 코드 관리 */
const cdMngt = function(req, res, next) {
    res.render("sys/cdMngt");
    
}

router.get('/cdMngt', cdMngt);
router.post('/cdMngt', cdMngt);

/** 기본 라우터 */
commUtil.commRoute("sys/", router);

module.exports = router;
