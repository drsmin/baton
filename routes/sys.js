const express  = require('express');
const commUtil = require(global.__base + "/modules/commUtil.js");
const router   = express.Router();
const sysCdGrp = require(global.__base + '/model/sys/sysCdGrp.js');
const sysCdDtl = require(global.__base + '/model/sys/sysCdDtl.js');
const upload = require(__base + 'modules/upload.js');

/** 코드 관리 */
router.get('/cdMngt', commUtil.chkAdmin, function(req, res, next) {
    
    if (!req.query.CD_GRP) {
        throw new Error('인수 [코드 그룹] 이 없습니다');
    }
    
    let cdGrp = req.query.CD_GRP;
    
    sysCdDtl.selectList(cdGrp, function(err, results, fields) {
        
        if (err) {
            //throw new Error(err);
            return next(err, req, res);
        }
        
        res.render("sys/cdMngt", {"CD_GRP" :  cdGrp, "list" : results});
        
    });

});

/** 코드 상세 등록/수정 */
router.get('/cdDtl', commUtil.chkAdmin, function(req, res, next) {

    if (!req.query.procDiv) {
        throw new Error('인수 [처리 구분] 이 없습니다');
    }
    
    if (!req.query.CD_GRP) {
        throw new Error('인수 [코드 그룹] 이 없습니다');
    }
    
    let procDiv = req.query.procDiv;
    let cdGrp  = req.query.CD_GRP;

    if ("C" == procDiv) {
        
        res.render("sys/cdDtl", {"procDiv" : procDiv, "CD_GRP" : cdGrp, "item" : {}});
        
    } else if ("U" == procDiv) {
    
        if (!req.query.CD_VAL) {
            throw new Error('인수 [코드 값] 이 없습니다');
        }
        
        let cdVal = req.query.CD_VAL;
    
        sysCdDtl.select(cdGrp, cdVal, function(err, results, fields) {
            
            if (err) {
                //throw new Error(err);
                return next(err, req, res);
            }
            
            if (results.length <= 0) {
                throw new Error(cdGrp + " 코드 데이터가 존재 하지 않습니다");
            }
            
            res.render("sys/cdDtl", {"procDiv" : procDiv, "CD_GRP" : cdGrp, "item" : results[0]});
            
        });
    } else if ("D" == procDiv) {
        
        let where = {};
        where["CD_GRP"] = req.query.CD_GRP;
        where["CD_VAL"] = req.query.CD_VAL;
        
        sysCdDtl.delete(where, function(err, results, fields) {
            
            if (err) {
                //throw new Error(err);
                return next(err, req, res);
            }
            
            res.redirect("/sys/cdMngt?CD_GRP=" + req.query.CD_GRP );
            
        });
    }

});

/** 코드 상세 등록/수정 처리 */
router.post('/cdDtl', commUtil.chkAdmin, function(req, res, next) {

    if (!req.body.procDiv) {
        throw new Error('인수 [처리 구분] 이 없습니다');
    }
    
    let procDiv = req.query.procDiv;

    //Validation
    if (!req.body.O_CD_GRP) {
        throw new Error('필수 항목 [코드 그룹] 이 없습니다');
    }
    
    req.body["CD_GRP"] = req.body.O_CD_GRP;
    
    if ("C" == procDiv) {
        
        sysCdDtl.insert(req.body, function(err, results, fields) {
            
            if (err) {
                //throw new Error(err);
                return next(err, req, res);
            }
            
            res.redirect("/sys/cdMngt?CD_GRP=" + req.body.O_CD_GRP );
            
        });
        
    } else if ("U" == procDiv) {
    
        let where = {};
        where["CD_GRP"] = req.body.O_CD_GRP;
        where["CD_VAL"] = req.body.O_CD_VAL;
    
        sysCdDtl.update(req.body, where, function(err, results, fields) {
            
            if (err) {
                //throw new Error(err);
                return next(err, req, res);
            }
            
            res.redirect("/sys/cdMngt?CD_GRP=" + req.body.O_CD_GRP );
            
        });
    }

});

/** 코드 그룹 관리 */
router.get('/cdGrpMngt', commUtil.chkAdmin, function(req, res, next) {

    sysCdGrp.selectList(function(err, results, fields) {
        
        if (err) {
            //throw new Error(err);
            return next(err, req, res);
        }
        
        res.render("sys/cdGrpMngt", {"list" : results});
        
    });
});

/** 코드 그룹 등록/수정 */
router.get('/cdGrpDtl', commUtil.chkAdmin, function(req, res, next) {

    if (!req.query.procDiv) {
        throw new Error('인수 [처리 구분] 이 없습니다');
    }
    
    let procDiv = req.query.procDiv;

    if ("C" == procDiv) {
        res.render("sys/cdGrpDtl", {"procDiv" : procDiv, "item" : {}});
    } else if ("U" == procDiv) {
    
        if (!req.query.CD_GRP) {
            throw new Error('인수 [코드 그룹] 이 없습니다');
        }
        
        let cdGrp = req.query.CD_GRP;
    
        sysCdGrp.select(cdGrp, function(err, results, fields) {
            
            if (err) {
                //throw new Error(err);
                return next(err, req, res);
            }
            
            if (results.length <= 0) {
                throw new Error(cdGrp + " 코드 그룹 데이터가 존재 하지 않습니다");
            }
            
            res.render("sys/cdGrpDtl", {"procDiv" : procDiv, "item" : results[0]});
            
        });
    }

});

/** 코드그룹 등록/수정 처리 */
router.post('/cdGrpDtl', commUtil.chkAdmin, function(req, res, next) {

    if (!req.body.procDiv) {
        throw new Error('인수 [처리 구분] 이 없습니다');
    }
    
    let procDiv = req.query.procDiv;

    //Validation
    if (!req.body.CD_GRP) {
        throw new Error('필수 항목 [코드 그룹] 이 없습니다');
    }
    
    if (!req.body.CD_GRP_NM) {
        throw new Error('필수 항목 [코드 그룹명] 이 없습니다');
    }

    if ("C" == procDiv) {
        
        sysCdGrp.insert(req.body, function(err, results, fields) {
            
            if (err) {
                //throw new Error(err);
                return next(err, req, res);
            }
            
            res.redirect("/sys/cdGrpMngt");
            
        });
        
    } else if ("U" == procDiv) {
    
        let where = {};
        where["CD_GRP"] = req.body.O_CD_GRP;
    
        sysCdGrp.update(req.body, where, function(err, results, fields) {
            
            if (err) {
                //throw new Error(err);
                return next(err, req, res);
            }
            
            res.redirect("/sys/cdGrpMngt");
            
        });
    }

});

/** 이미지 등록 팝업 */
router.get('/pop/regImgPop/:div/:width/:height', function(req, res, next) {
    
    res.render("sys/pop/regImgPop", {"div" : req.params.div, "ratio" : req.params.width + "/" + req.params.height});
    
});

/** 이미지 등록 팝업 */
router.post('/pop/regImgPop', function(req, res, next) {

    upload(req, res, "croppedImage", "img").then(function (file) {
        
        res.send(file["ATTC_FILE_SEQ"] + "");
    });
});

/** 동영상 등록 팝업 */
router.get('/pop/regMovPop/:div', function(req, res, next) {
    
    res.render("sys/pop/regMovPop", {"div" : req.params.div});
    
});

/** 동영상 등록 팝업 */
router.post('/pop/regMovPop/:div', function(req, res, next) {
    
    upload(req, res, "file", "mov").then(function (file) {
        
        res.render("sys/pop/regMovPop", {"div" : req.params.div, "attcFileSeq" : file["ATTC_FILE_SEQ"]});
    });
});


/** 기본 라우터 */
commUtil.commRoute("sys/", router);

module.exports = router;
