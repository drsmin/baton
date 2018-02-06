/** SVC_SEL_MOV 테이블 관련 사용자 객체 */
const datasource = require(__base + '/modules/datasource.js');
const commUtil = require(__base + "/modules/commUtil.js");
const tblNm = "판매 동영상";

/** 리스트 조회 */
module.exports.selectList = function(where, orderby, cb) {
    
    let sql = "SELECT SVC_SEQ, SVC_MOV_SEQ, REPR_YN, ATTC_FILE_SEQ, REG_USER_ID, REG_DTTM, UPT_USER_ID, UPT_DTTM FROM SVC_SEL_MOV WHERE 1=1 ";
    
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
module.exports.select = function(svcSeq, svcMovSeq, cb) {
    
    datasource.query("SELECT SVC_SEQ, SVC_MOV_SEQ, REPR_YN, ATTC_FILE_SEQ, REG_USER_ID, REG_DTTM, UPT_USER_ID, UPT_DTTM FROM SVC_SEL_MOV WHERE SVC_SEQ = ? AND SVC_MOV_SEQ = ? ", [svcSeq, svcMovSeq], function(err, results, fields) {
        
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
        dbData["SVC_MOV_SEQ"] = data["SVC_MOV_SEQ"];
        dbData["REPR_YN"] = data["REPR_YN"];
        dbData["ATTC_FILE_SEQ"]  = data["ATTC_FILE_SEQ"];
        dbData["REG_USER_ID"]  = data["REG_USER_ID"];
        dbData["UPT_USER_ID"]  = data["UPT_USER_ID"];
    }
    
    datasource.insert("SVC_SEL_MOV", dbData, function(err, results, fields) {
        
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
    if (data["SVC_MOV_SEQ"]) dbData["SVC_MOV_SEQ"] = data["SVC_MOV_SEQ"];
    if (data["REPR_YN"]) dbData["REPR_YN"] = data["REPR_YN"];
    if (data["ATTC_FILE_SEQ"]) dbData["GODS_UPRC"]  = data["ATTC_FILE_SEQ"];
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
    
    datasource.delete("SVC_SEL_MOV", where, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);            
        }
    });
};