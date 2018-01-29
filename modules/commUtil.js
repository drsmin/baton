const sysCdDtl = require(global.__base + '/model/sys/sysCdDtl.js');
const randomstring = require("randomstring");

/** 기본 라우트 설정 */
module.exports.commRoute = function(basePath, router) {
    router.all('/:pass1', function(req, res, next) {
        
        console.log("pass1 %s", req.params.pass1);
        
        res.render(basePath + req.params.pass1);
    });
    
    router.all('/:pass1/:pass2', function(req, res, next) {
        
        console.log("pass1 %s pass2 %s", req.params.pass1, req.params.pass2);
        
        res.render(basePath + req.params.pass1 + "/" + req.params.pass2);
    });
};

/** 공통 코드 조회 defferd 패턴 */
module.exports.getCdList = function(cdGrp, callback) {
    
    var promise = new Promise(function (resolve, reject) {

        sysCdDtl.selectList(cdGrp, function (err, results, fields) {
            
            if (err) {
                reject(err);
            }
            
            console.log(cdGrp + " / " + JSON.stringify(results));
            
            resolve(results);
        });
    });
    
    return promise;
}

/** 로그인 여부 확인 middleware */
module.exports.chkLogin = function (req, res, next) {
    if (res.locals.__isLogin) {
        return next();
    }

    req.flash("__msg", "로그인 후 사용 가능합니다");
    res.redirect('/com/login');
};

/** 관리자 여부 확인 middleware */
module.exports.chkAdmin = function (req, res, next) {
    if (res.locals.__isAdmin) {
        return next();
    }
    
    req.flash("__msg", "관리자만 사용 가능합니다");
    res.redirect('/');
};

/** 랜덤 문자/숫자 */
module.exports.getRandom = function(length, isNumber) {
    
    if(!length) {
        length = 8;
    }
    
    let rType = "alphanumeric";
    
    if (isNumber) {
        rType = "numeric";
    }
    
    return randomstring.generate({
          length: length,
          charset: rType
        });
}