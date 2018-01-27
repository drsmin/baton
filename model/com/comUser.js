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
    
    let dbData = {};
    dbData["USER_ID"] = data["USER_ID"];
    dbData["USER_PW"] = data["USER_PW"];
    dbData["USER_ROLE_CD"] = "10";
    dbData["SNS_DIV_CD"] = "10";
    dbData["EMAL_ADDR"] = data["EMAL_ADDR"];
    dbData["USER_NM"] = data["USER_NM"];
    dbData["CPHN_NO"] = data["CPHN_NO"];
    dbData["NATI_CD"] = data["NATI_CD"];
    dbData["LNGG_CD"] = data["LNGG_CD"];
    dbData["LIVE_AREA"] = data["LIVE_AREA"];
    
    if (data["BITH"]) {
        dbData["BITH"] = data["BITH"].replace(/\-/gi, "");
    }

    dbData["USER_DIV_CD"] = data["USER_DIV_CD"];
    dbData["BIZ_REG_NO"] = data["BIZ_REG_NO"];
    
    datasource.insert("COM_USER", dbData, function(err, results, fields) {
        
        if(err) {
            cb("사용자 정보 등록 중 오류 발생");
        }
        
        cb(null, results, fields);
    });
  
};
