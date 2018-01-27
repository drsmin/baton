const sysCdDtl = require(global.__base + '/model/sys/sysCdDtl.js');

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

/** 공통 코드 조회 */
module.exports.getCdList = function(cdGrp, callback) {
    
    sysCdDtl.selectList(cdGrp, function (err, results, fields) {
        
        if (err) {
            callback(err);
        }
        
        console.log(cdGrp + " / " + JSON.stringify(results));
        
        callback(null, results);
    });
}