/** SYS_CD_GRP 테이블 관련 사용자 객체 */
const datasource = require(__base + '/modules/datasource.js');
const tblNm = "코드 그룹";

/** 리스트 조회 */
module.exports.selectList = function(cb) {
    
    datasource.query("SELECT CD_GRP, CD_GRP_NM, HIGH_GRP FROM SYS_CD_GRP", function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);
        }
    });
};

/** 단건 조회 */
module.exports.select = function(cdGrp, cb) {
    
    datasource.query("SELECT CD_GRP, CD_GRP_NM, HIGH_GRP FROM SYS_CD_GRP WHERE CD_GRP = ? ", [cdGrp], function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);            
        }
    });
};

/** 등록 */
module.exports.insert = function(data, cb) {
    
    let dbData = {};
    dbData["CD_GRP"]    = data["CD_GRP"];
    dbData["CD_GRP_NM"] = data["CD_GRP_NM"];
    dbData["HIGH_GRP"]  = data["HIGH_GRP"];
    
    datasource.insert("SYS_CD_GRP", dbData, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 등록 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);
        }

    });
};

/** 수정 */
module.exports.update = function(data, where, cb) {
    
    let dbData = {};
    dbData["CD_GRP"]    = data["CD_GRP"];
    dbData["CD_GRP_NM"] = data["CD_GRP_NM"];
    dbData["HIGH_GRP"]  = data["HIGH_GRP"];
    
    datasource.update("SYS_CD_GRP", dbData, where, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 수정 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);            
        }
    });
};