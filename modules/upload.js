const multer = require('multer');
const path = require('path');
const commUtil = require(__base + 'modules/commUtil.js');
const sysAttcFile = require(__base + '/model/sys/sysAttcFile.js');
const fs = require("fs");
const mkdirp = require('mkdirp');

module.exports = function (req, res, paramNm, pathNm) {
    var storage = multer.diskStorage({
        
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            
            let uploadPath =  __env.uploadBasePath;
            
            if (pathNm) {
                uploadPath += "/" + pathNm;
            }
            
            if (fs.existsSync(uploadPath) == false) {
                mkdirp.sync(uploadPath);
            }
            
            cb(null, uploadPath);
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {
            
            cb(null, commUtil.getRandom(12, false) + path.extname(file.originalname));
        }
    });

    var upload = multer({ storage: storage }).single(paramNm);
    
    var promise = new Promise(function (resolve, reject) {
        
        upload(req, res, function (err) {
            if (err) {
                err.userMsg = "업로드 중 오류";
                reject(err);
            } else {
                
                sysAttcFile.insertLocal(req.file, function(err, results) {
        
                    if(err) {
                        err.userMsg = "업로드 중 오류";
                        reject(err);
                    } else {
                        
                        req.file["ATTC_FILE_SEQ"] = results.insertId;
                        
                        resolve(req.file);
                    }

                });
            }
        });
    });
    
    return promise;
};