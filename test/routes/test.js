const passport = require('passport');
const express = require('express');
const router = express.Router();
const ds = require(__base + 'modules/datasource');

router.get('/', function(req, res, next) {
    
    res.render('test');
    
});


router.get('/chkDb', function(req, res, next) {

    var ret;
    
    ds.query("SELECT '1', ?, ? ", ['foo', 'bar'], function(err, rows, fields) {
        if (!err) {
            ret = {'result' : 'OK', 'message' : ""};
        }

        else {
            ret = {'result' : 'FAIL', 'message' : err};
        }
        
        ret['info'] = ds.getInfo();
       
        res.render('chkDb', ret);

    });
});
    
    
router.get('/tables', function(req, res, next) {

    var ret;
    
    ds.query("SHOW TABLES", null, function(err, rows, fields) {
        if (!err) {
            ret = {'result' : rows, 'message' : '' };
        }

        else {
            ret = {'result' : 'FAIL', 'message' : err};
        }
        
        ret['info'] = ds.getInfo();
       
        res.render('tables', ret);

    });
    
    
});

router.get('/insertTest', function(req, res, next) {

    var ret;
    
    var data = [];

    for (var idx = 0; idx < 100000 ; idx++) {
        data.push({"col2" : "test" + idx});
    }
    
    ds.insert("test", data, function(err, results, fields) {
        
        
        if (!err) {
            ret = {'result' : 'OK', 'message' : JSON.stringify(results) };
        }

        else {
            ret = {'result' : 'FAIL', 'message' : err };
        }
        
        res.render("insertTest", ret);

    });
    
    
});

router.get('/updateTest', function(req, res, next) {

    var ret;
    
    var params = {'col2' : 'eiojfijdf'};
    var where = {'col1' : 1};

    ds.update("test", params, where, function(err, results, fields) {
        
        
        if (!err) {
            ret = {'result' : 'OK', 'message' : JSON.stringify(results) };
        }

        else {
            ret = {'result' : 'FAIL', 'message' : err };
        }
        
        res.render("updateTest", ret);

    });
    
    
});

router.get('/ws', function(req, res, next) {

    res.render("websocket");
    
    
});

router.ws('/ws', function(ws, req) {
    
    ws.on('open', function(data) {
        ws.send('connected..');
    });
    
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});

router.get('/login', function(req, res, next) {

    res.render("loginTest");
    
    
});

router.post('/login.do', passport.authenticate('local', {
    
    failureRedirect: '/test/login'
}), function(req, res) {
    console.log("로그인 성공");
    res.redirect('/test/login');
});

router.get('/bootstrap', function(req, res, next) {

    res.render("bootstrap");
    
    
});

module.exports = router;