module.exports = function (req, res) {
    var deferred = Q.defer();
    var storage = multer.diskStorage({
        
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            cb(null, imagePath);
        },

        // 서버에 저장할 파일 명
        fileInfo: function (req, file, cb) {
            
            file.uploadedFile = {
                name: req.params.filename,
                ext: file.mimetype.split('/')[1]
            };
            
            cb(null, file);
        }
    });

    var upload = multer({ storage: storage }).single('file');
    
    upload(req, res, function (err) {
        if (err) deferred.reject();
        else deferred.resolve(req.file.uploadedFile);
    });
    
    return deferred.promise;
};