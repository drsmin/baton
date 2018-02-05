/** SVC_SEL_GODS 테이블 관련 사용자 객체 */
const datasource = require(__base + '/modules/datasource.js');
const commUtil = require(__base + "/modules/commUtil.js");
const tblNm = "판매 상품";

/** 리스트 조회 */
module.exports.selectList = function(where, orderby, cb) {
    
    let sql = "SELECT SVC_SEQ, GODS_SEQ, GODS_NM, GODS_UPRC, GODS_DTL, REG_USER_ID, REG_DTTM, UPT_USER_ID, UPT_DTTM  FROM SVC_SEL_GODS WHERE 1=1 ";
    
    let sParam = [];
    
    if(where) {
        
        for (let key in where) {
            sql += "AND " + key + " = ?";
            sParam.push(where[key]);
        }

    }
    
    if (orderby) {
        sql += " " + orderby ;
    }
    
    datasource.query(sql, sParam, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);
        }
    });
};

/** 단건 조회 */
module.exports.select = function(svcSeq, godsSeq, cb) {
    
    datasource.query("SELECT SVC_SEQ, GODS_SEQ, GODS_NM, GODS_UPRC, GODS_DTL, REG_USER_ID, REG_DTTM, UPT_USER_ID, UPT_DTTM  FROM SVC_SEL_GODS WHERE SVC_SEQ = ? AND GODS_SEQ = ? ", [svcSeq, godsSeq], function(err, results, fields) {
        
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
    
    if (commUtil.isArray(data) == true) {
        
        dbData = data;
        
    } else {
        dbData["SVC_SEQ"] = data["SVC_SEQ"];
        dbData["GODS_SEQ"] = data["GODS_SEQ"];
        dbData["GODS_NM"] = data["GODS_NM"];
        dbData["GODS_UPRC"]  = data["GODS_UPRC"];
        dbData["GODS_DTL"]  = data["GODS_DTL"];
        dbData["REG_USER_ID"]  = data["REG_USER_ID"];
        dbData["UPT_USER_ID"]  = data["UPT_USER_ID"];
    }
    
    datasource.insert("SVC_SEL_GODS", dbData, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 등록 중 오류 발생";
            cb(err);
        }
        
        cb(null, results, fields);
    });
};

/** 수정 */
module.exports.update = function(data, where, cb) {
    
    let dbData = {};
    if (data["SVC_SEQ"]) dbData["SVC_SEQ"] = data["SVC_SEQ"];
    if (data["GODS_SEQ"]) dbData["GODS_SEQ"] = data["GODS_SEQ"];
    if (data["GODS_NM"]) dbData["GODS_NM"] = data["GODS_NM"];
    if (data["GODS_UPRC"]) dbData["GODS_UPRC"]  = data["GODS_UPRC"];
    if (data["GODS_DTL"]) dbData["GODS_DTL"]  = data["GODS_DTL"];
    if (data["UPT_USER_ID"]) dbData["UPT_USER_ID"]  = data["UPT_USER_ID"];
    
    datasource.update("SVC_SEL_GODS", dbData, where, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 수정 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);
        }
    });
};

/** 삭제 */
module.exports.delete = function(where, cb) {
    
    datasource.delete("SVC_SEL_GODS", where, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);            
        }
    });
};