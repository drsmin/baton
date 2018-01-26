//TC_USER 테이블 관련 사용자 객체
const datasource = require(global.__base + '/modules/datasource.js');

module.exports.selectLogin = function(userId, userPw, cb) {
    
    datasource.query("SELECT * FROM COM_USER WHERE USER_ID = ? AND USER_PW = PASSWORD(?)", [userId, userPw], function(err, results, fields) {
        
        if(err) {
            cb("사용자 정보 조회 중 오류 발생");
        }
        
        cb(null, results, fields);
    });
  
};
