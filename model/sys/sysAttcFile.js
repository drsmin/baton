/** SYS_ATTC_FILE 테이블 관련 사용자 객체 */
const datasource = require(__base + '/modules/datasource.js');

/** 첨부 파일 조회 */
module.exports.select = function(attcFileSeq, cb) {
    
    datasource.query("SELECT ATTC_FILE_SEQ, STRG_TYPE_CD, FILE_NM, FILE_PATH, FILE_ORI_NM, FILE_SIZE, MIME_TYPE FROM SYS_ATTC_FILE WHERE ATTC_FILE_SEQ = ?", [attcFileSeq], function(err, results, fields) {
        
        if(err) {
            cb("첨부 파일 등록 중 오류 발생");
        } else {
            
            if (results.length > 0) {
                cb(null, results[0], fields);
            } else {
                cb(null, null, null);
            }
        }
    });
};

/** 첨부 파일 등록 */
module.exports.insertLocal = function(data, cb) {
    
    let dbData = {};
    dbData["FILE_NM"]  = data["filename"];
    dbData["STRG_TYPE_CD"]  = "10"; //local 저장소
    dbData["FILE_PATH"]  = data["path"];
    dbData["FILE_ORI_NM"]   = data["originalname"];
    dbData["FILE_SIZE"] = data["size"];
    dbData["MIME_TYPE"]  = data["mimetype"];
    
    datasource.insert("SYS_ATTC_FILE", dbData, function(err, results, fields) {
        
        if(err) {
            cb("첨부 파일 등록 중 오류 발생");
        } else {
        
            cb(null, results, fields);
        }

    });
};