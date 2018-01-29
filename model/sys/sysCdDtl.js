/** SYS_CD_DTL 테이블 관련 사용자 객체 */
const datasource = require(__base + '/modules/datasource.js');

/** 코드 리스트 조회 */
module.exports.selectList = function(cdGrp, cb) {
    
    datasource.query("SELECT CD_GRP, CD_VAL, CD_NM, DSP_SEQ, USE_YN FROM SYS_CD_DTL WHERE CD_GRP = ? ORDER BY DSP_SEQ ASC", [cdGrp], function(err, results, fields) {
        
        if(err) {
            cb("코드 정보 조회 중 오류 발생");
        }
        
        cb(null, results, fields);
    });
};

/** 코드 그룹 단건 조회 */
module.exports.select = function(cdGrp, cdVal, cb) {
    
    datasource.query("SELECT CD_GRP, CD_VAL, CD_NM, DSP_SEQ, USE_YN FROM SYS_CD_DTL WHERE CD_GRP = ? AND CD_VAL = ?", [cdGrp, cdVal], function(err, results, fields) {
        
        if(err) {
            cb("코드 그룹 정보 조회 중 오류 발생");
        }
        
        cb(null, results, fields);
    });
};

/** 코드 상세세 등록 */
module.exports.insert = function(data, cb) {
    
    let dbData = {};
    dbData["CD_GRP"]  = data["CD_GRP"];
    dbData["CD_VAL"]  = data["CD_VAL"];
    dbData["CD_NM"]   = data["CD_NM"];
    dbData["DSP_SEQ"] = data["DSP_SEQ"];
    dbData["USE_YN"]  = data["USE_YN"];
    
    datasource.insert("SYS_CD_DTL", dbData, function(err, results, fields) {
        
        if(err) {
            cb("코드 상세 등록 중 오류 발생");
        }
        
        cb(null, results, fields);
    });
};

/** 코드 상세 수정 */
module.exports.update = function(data, where, cb) {
    
    let dbData = {};
    dbData["CD_GRP"]  = data["CD_GRP"];
    dbData["CD_VAL"]  = data["CD_VAL"];
    dbData["CD_NM"]   = data["CD_NM"];
    dbData["DSP_SEQ"] = data["DSP_SEQ"];
    dbData["USE_YN"]  = data["USE_YN"];
    
    datasource.update("SYS_CD_DTL", dbData, where, function(err, results, fields) {
        
        if(err) {
            cb("코드 상세 수정 중 오류 발생");
        }
        
        cb(null, results, fields);
    });
};

/** 코드 상세 수정 */
module.exports.delete = function(where, cb) {
    
    datasource.delete("SYS_CD_DTL", where, function(err, results, fields) {
        
        if(err) {
            cb("코드 상세 수정 중 오류 발생");
        }
        
        cb(null, results, fields);
    });
};