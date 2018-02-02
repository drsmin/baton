/** COM_USER 테이블 관련 사용자 객체 */
const datasource = require(global.__base + '/modules/datasource.js');

/** 로그인 */
module.exports.selectLogin = function(userId, userPw, cb) {
    
    datasource.query("SELECT * FROM COM_USER WHERE USER_ID = ? AND USER_PW = PASSWORD(?)", [userId, userPw], function(err, results, fields) {
        
        if(err) {
            cb("사용자 정보 조회 중 오류 발생");
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
    dbData.push("10"); //SNS_DIV_CD
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
            cb(err);
            return;
        }
        
        cb(null, results, fields);
    });
  
};

/** 이메일 중복 체크 */
module.exports.chkDupEmalAddr = function(emalAddr) {
    
    var promise = new Promise(function (resolve, reject) {

        datasource.query("SELECT COUNT(1) AS CNT FROM COM_USER WHERE EMAL_ADDR = ?", [emalAddr], function(err, results, fields) {
            
            if(err) {
                if (err) {
                    reject("사용자 정보 조회 중 오류 발생");
                }
            }
            
            let chkRet = false;
            
            if (results.length == 0) {
                chkRet = true;
            } else {
                if (results[0]["CNT"] <= 0) {
                    chkRet = true;
                }
            }
        
            resolve(chkRet);
        });
    });
    
    return promise;
};
