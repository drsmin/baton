/** SVC_SEL_MST 테이블 관련 사용자 객체 */
const datasource = require(__base + '/modules/datasource.js');
const tblNm = "판매 마스터";

/** 리스트 조회 */
module.exports.selectList = function(where, pageInfo, orderby, cb) {
    
    let sql = "SELECT SVC_SEQ, SEL_USER_ID, SVC_STAT_CD, SVC_TITL, CAT_CD, SVC_TYPE, SVC_DTL, SVC_AS, SVC_REQ_DTL, RJCT_CTNT, REG_USER_ID, REG_DTTM, UPT_USER_ID, UPT_DTTM  FROM SVC_SEL_MST WHERE 1=1 ";
    
    let sParam = [];
    
    if(where) {
        
        for (let key in where) {
            sql += "AND " + key + " = ?";
            sParam.push(where[key]);
        }

    }
    
    if (orderby) {
        sql += " " + orderby;
    }
    
    if (pageInfo) {
        sql = "SELECT * FROM (" + sql;
        sql += ") A LIMIT ?, ? ";
        let page = pageInfo["PAGE"];
        let cnt = pageInfo["CNT"];
        
        sParam.push((page - 1) * cnt);
        sParam.push(cnt);
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
module.exports.select = function(svcSeq, cb) {
    
    datasource.query("SELECT SVC_SEQ, SEL_USER_ID, SVC_STAT_CD, SVC_TITL, CAT_CD, SVC_TYPE, SVC_DTL, SVC_AS, SVC_REQ_DTL, RJCT_CTNT, REG_USER_ID, REG_DTTM, UPT_USER_ID, UPT_DTTM  FROM SVC_SEL_MST WHERE SVC_SEQ = ? ", [svcSeq], function(err, results, fields) {
        
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
    dbData["SEL_USER_ID"] = data["SEL_USER_ID"];
    dbData["SVC_STAT_CD"] = data["SVC_STAT_CD"];
    dbData["SVC_TITL"]  = data["SVC_TITL"];
    dbData["CAT_CD"]  = data["CAT_CD"];
    dbData["SVC_TYPE"]  = data["SVC_TYPE"];
    dbData["SVC_DTL"]  = data["SVC_DTL"];
    dbData["SVC_AS"]  = data["SVC_AS"];
    dbData["SVC_REQ_DTL"]  = data["SVC_REQ_DTL"];
    dbData["RJCT_CTNT"]  = data["RJCT_CTNT"];
    dbData["REG_USER_ID"]  = data["REG_USER_ID"];
    dbData["UPT_USER_ID"]  = data["UPT_USER_ID"];
    
    datasource.insert("SVC_SEL_MST", dbData, function(err, results, fields) {
        
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
    if (data["SEL_USER_ID"]) dbData["SEL_USER_ID"] = data["SEL_USER_ID"];
    if (data["SVC_STAT_CD"]) dbData["SVC_STAT_CD"] = data["SVC_STAT_CD"];
    if (data["SVC_TITL"]) dbData["SVC_TITL"]  = data["SVC_TITL"];
    if (data["CAT_CD"]) dbData["CAT_CD"]  = data["CAT_CD"];
    if (data["SVC_TYPE"]) dbData["SVC_TYPE"]  = data["SVC_TYPE"];
    if (data["SVC_DTL"]) dbData["SVC_DTL"]  = data["SVC_DTL"];
    if (data["SVC_AS"]) dbData["SVC_AS"]  = data["SVC_AS"];
    if (data["SVC_REQ_DTL"]) dbData["SVC_REQ_DTL"]  = data["SVC_REQ_DTL"];
    if (data["RJCT_CTNT"]) dbData["RJCT_CTNT"]  = data["RJCT_CTNT"];
    if (data["UPT_USER_ID"]) dbData["UPT_USER_ID"]  = data["UPT_USER_ID"];
    
    datasource.update("SVC_SEL_MST", dbData, where, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 수정 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);            
        }
    });
};

/** 건수 조회 */
module.exports.selectCnt = function(where, cb) {
    
    let sql = "SELECT COUNT(1) AS CNT FROM SVC_SEL_MST WHERE 1=1 ";
    
    let sParam = [];
    
    if(where) {
        
        for (let key in where) {
            sql += "AND " + key + " = ?";
            sParam.push(where[key]);
        }

    }
    
    datasource.query(sql, sParam, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 건수 조회 중 오류 발생";
            cb(err);
        } else {
            let cnt = 0;
            
            if (results || results.length > 0) {
                cnt = results[0]["CNT"];
            }
            
            cb(null, cnt);
        }
    });
};

/** 리스트 조회 판매 마스터 */
module.exports.selectListMst = function(catCd, where, pageInfo, orderby, cb) {
    
    let sql = "";

    sql += " SELECT A.SVC_SEQ ";
    sql += "      , A.SVC_TITL ";
    sql += "      , (SELECT ATTC_FILE_SEQ FROM SVC_SEL_IMG B WHERE B.SVC_SEQ = A.SVC_SEQ AND B.SVC_IMG_SEQ = 1) AS ATTC_FILE_SEQ ";
    sql += "      , B.USER_ID ";
    sql += "      , B.USER_NM ";
    sql += "      , B.PRFL_FILE_SEQ ";
    sql += "      , (SELECT CD_NM FROM SYS_CD_DTL C WHERE C.CD_GRP = 'LNGG_CD' AND C.CD_VAL = B.LNGG_CD) AS LNGG_NM ";
    sql += " FROM   SVC_SEL_MST A ";
    sql += " JOIN   COM_USER B ";
    sql += " ON     A.SEL_USER_ID = B.USER_ID ";
    sql += " WHERE  A.CAT_CD = ? ";
    
    let sParam = [];
    
    sParam.push(catCd);
    
    if(where) {
        
        for (let key in where) {
            sql += "AND " + key + " = ?";
            sParam.push(where[key]);
        }
    }
    
    if (orderby) {
        sql += " " + orderby;
    }
    
    if (pageInfo) {
        sql = "SELECT * FROM (" + sql;
        sql += ") A LIMIT ?, ? ";
        let page = pageInfo["PAGE"];
        let cnt = pageInfo["CNT"];
        
        sParam.push((page - 1) * cnt);
        sParam.push(cnt);
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

/** 건수 조회 */
module.exports.selectMstCnt = function(catCd, where, cb) {
    
    let sql = "";

    sql += " SELECT COUNT(1) AS CNT ";
    sql += " FROM   SVC_SEL_MST A ";
    sql += " JOIN   COM_USER B ";
    sql += " ON     A.SEL_USER_ID = B.USER_ID ";
    sql += " WHERE  A.CAT_CD = ? ";
    
    let sParam = [];
    
    sParam.push(catCd);
    
    if(where) {
        
        for (let key in where) {
            sql += "AND " + key + " = ?";
            sParam.push(where[key]);
        }
    }
    
    datasource.query(sql, sParam, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 건수 조회 중 오류 발생";
            cb(err);
        } else {
            let cnt = 0;
            
            if (results || results.length > 0) {
                cnt = results[0]["CNT"];
            }
            
            cb(null, cnt);
        }
    });
};