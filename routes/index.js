const express = require('express');
const fs = require('fs');
const router = express.Router();
const sysAttcFile = require(__base + '/model/sys/sysAttcFile.js');

/** 메인 화면 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Baton 2.0' });
});

/** 파일 보기 */
router.get("/fileView/:fileAttcSeq", function(req, res, next) {
    
    let fileAttcSeq = req.params.fileAttcSeq;
    
    sysAttcFile.select(fileAttcSeq, function(err, result) {
        
        if (err) {
            res.send("");
        } else {
            
            if(null == result) {
                res.send("");
            } else {
            
                res.setHeader("content-type", result["MIME_TYPE"]);
                fs.createReadStream(result["FILE_PATH"]).pipe(res);
            }
        }
        
    });
});

/** 이미지 보기 */
router.get("/imgView/:fileAttcSeq", function(req, res, next) {
    
    let fileAttcSeq = req.params.fileAttcSeq;
    
    sysAttcFile.select(fileAttcSeq, function(err, result) {
        
        if (err) {
            res.send("");
        } else {
            
            if(null == result) {
                res.send("");
            } else if (result["MIME_TYPE"].indexOf("image") == 0) {
            
                res.setHeader("content-type", result["MIME_TYPE"]);
                fs.createReadStream(result["FILE_PATH"]).pipe(res);
            } else {
                res.send("");
            }
        }
        
    });
});

module.exports = router;
