/** COM_USER 테이블 관련 사용자 객체 */
const datasource = require(global.__base + '/modules/datasource.js');
const tblNm = "사용자 정보";

/** 로그인 */
module.exports.selectLogin = function(userId, userPw, cb) {
    
    datasource.query("SELECT * FROM COM_USER WHERE USER_ID = ? AND USER_PW = PASSWORD(?) AND SNS_DIV_CD = '10'", [userId, userPw], function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);
        }
    });
};

/** Facebook 로그인 */
module.exports.selectLoginFB = function(userId, cb) {
    
    datasource.query("SELECT * FROM COM_USER WHERE USER_ID = ? AND SNS_DIV_CD = 'FB'", [userId], function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);            
        }
    });
  
};

/** Google 로그인 */
module.exports.selectLoginGG = function(userId, cb) {
    
    datasource.query("SELECT * FROM COM_USER WHERE USER_ID = ? AND SNS_DIV_CD = 'GG'", [userId], function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 정보 조회 중 오류 발생";
            cb(err);
        }
        
        cb(null, results, fields);
    });
  
};

/** 회원 가입 처리 */
module.exports.insert = function(data, cb) {
    
    let sql = "";
    sql += "INSERT INTO COM_USER (";
    sql += "USER_ID, USER_PW, USER_ROLE_CD, SNS_DIV_CD, EMAL_ADDR, USER_NM, CPHN_NO, NATI_CD, LNGG_CD, LIVE_AREA, BITH, USER_DIV_CD, CORP_NM, BIZ_REG_NO";
    sql += ") VALUES (";
    sql += "?, PASSWORD(?), ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?";
    sql += ")";
    
    let dbData = [];
    dbData.push(data["USER_ID"]);
    dbData.push(data["USER_PW"]);
    dbData.push("10"); //USER_ROLE_CD
    dbData.push(data["SNS_DIV_CD"]);
    dbData.push(data["EMAL_ADDR"]);
    dbData.push(data["USER_NM"]);
    dbData.push(data["CPHN_NO"]);
    dbData.push(data["NATI_CD"]);
    dbData.push(data["LNGG_CD"]);
    dbData.push(data["LIVE_AREA"]);
    dbData.push(data["PRFL_FILE_SEQ"]);
    
    if (data["BITH"]) {
        dbData.push(data["BITH"].replace(/\-/gi, ""));
    } else {
        dbData.push("");
    }

    dbData.push(data["USER_DIV_CD"]);
    dbData.push(data["CORP_NM"]);
    dbData.push(data["BIZ_REG_NO"]);
    
    datasource.query(sql, dbData, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 등록 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);            
        }
        

    });
  
};

/** ID 중복 체크 */
module.exports.chkDupUserId = function(userId) {
    
    var promise = new Promise(function (resolve, reject) {

        datasource.query("SELECT COUNT(1) AS CNT FROM COM_USER WHERE USER_ID = ?", [userId], function(err, results, fields) {
            
            if(err) {
                err.userMsg = tblNm + " 조회 중 오류 발생";
                reject(err);
                
            } else {
            
                let chkRet = false;
                
                if (results.length == 0) {
                    chkRet = true;
                } else {
                    if (results[0]["CNT"] <= 0) {
                        chkRet = true;
                    }
                }
            
                resolve(chkRet);
            }

        });
    });
    
    return promise;
};

/** 이메일 중복 체크 */
module.exports.chkDupEmalAddr = function(emalAddr, userId) {
    
    let sql = "SELECT COUNT(1) AS CNT FROM COM_USER WHERE EMAL_ADDR = ?";
    let sParam = [];
    sParam.push(emalAddr);
    
    if (userId) {
        sql += " AND USER_ID <> ?";
        sParam.push(userId);
    }
    
    var promise = new Promise(function (resolve, reject) {

        datasource.query(sql, sParam, function(err, results, fields) {
            
            if(err) {
                err.userMsg = tblNm + " 조회 중 오류 발생";
                reject(err);
                
            } else {
            
                let chkRet = false;
                
                if (results.length == 0) {
                    chkRet = true;
                } else {
                    if (results[0]["CNT"] <= 0) {
                        chkRet = true;
                    }
                }
            
                resolve(chkRet);
            }

        });
    });
    
    return promise;
};

/** 회원 정보 조회 */
module.exports.select = function(userId, cb) {
    
    datasource.query("SELECT * FROM COM_USER WHERE USER_ID = ? ", [userId], function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 조회 중 오류 발생";
            cb(err);
        } else {
            if (results && results.length >= 1) {
                cb(null, results[0], fields);
            } else {
                cb(null, {}, null);
            }
        }
    });
};

/** 회원 정보 수정 */
module.exports.update = function(userId, data, cb) {
    
    let dbData = {};
    
    if(data["EMAL_ADDR"]) dbData["EMAL_ADDR"] = data["EMAL_ADDR"];
    if(data["CPHN_NO"]) dbData["CPHN_NO"] = data["CPHN_NO"];
    if(data["USER_NM"]) dbData["USER_NM"] = data["USER_NM"];
    if(data["USER_PW"]) dbData["USER_PW"] = data["USER_PW"];
    if(data["NATI_CD"]) dbData["NATI_CD"] = data["NATI_CD"];
    if(data["LNGG_CD"]) dbData["LNGG_CD"] = data["LNGG_CD"];
    if(data["LIVE_AREA"]) dbData["LIVE_AREA"] = data["LIVE_AREA"];
    if(data["BITH"]) dbData["BITH"] = data["BITH"];
    if(data["PRFL_FILE_SEQ"]) dbData["PRFL_FILE_SEQ"] = data["PRFL_FILE_SEQ"];
    if(data["USER_DIV_CD"]) dbData["USER_DIV_CD"] = data["USER_DIV_CD"];
    if(data["CORP_NM"]) dbData["CORP_NM"] = data["CORP_NM"];
    if(data["BIZ_REG_NO"]) dbData["BIZ_REG_NO"] = data["BIZ_REG_NO"];
    if(data["UPT_USER_ID"]) dbData["UPT_USER_ID"] = data["UPT_USER_ID"];
    
    if (dbData["BITH"]) {
        dbData["BITH"] = dbData["BITH"].replace(/\-/gi, "");
    }
    
    let sql = "UPDATE COM_USER SET ";
    
    let idx = 0;
    let sParam = [];
    
    for (let key in dbData) {
        
        let val = dbData[key];
        
        if (idx != 0) {
            sql += ", ";
        }
        
        sql += " " + key + " = ";
        
        if ("USER_PW" == key) {
            sql += " PASSWORD(?) ";
        } else {
            sql += " ? ";
        }
        
        sParam.push(val);
        
        idx ++;
    }
    
    sql += " WHERE USER_ID = ? ";
    sParam.push(userId);
    
    datasource.query(sql, sParam, function(err, results, fields) {
        
        if(err) {
            err.userMsg = tblNm + " 갱신 중 오류 발생";
            cb(err);
        } else {
            cb(null, results, fields);
        }
    });
};