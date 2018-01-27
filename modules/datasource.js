const mysql    = require('mysql');
const dbconfig = require(__base + 'config/database');
let conn;

/** 데이터베이스 설정 */
module.exports.getInfo = function() {
    return dbconfig;
};

/** 연결 초기화 */
module.exports.init = function() {
    if (!conn) {
        
        console.log("Database Connection Init...");
        conn = mysql.createPool(dbconfig);
    }
};

/** Query수행 */
module.exports.query = function(sql, param, callback) {
    this.init();
    
    if (!sql) throw new Error("SQL문장은 필수 입니다.");
    if (!param) param = [];
    
    console.log("= EXECUTE QUERY =======================");
    console.log("SQL : " + sql);
    console.log("PARAM : " + JSON.stringify(param));

    conn.query(sql, param, function(err, results, fields) {
        
        if (process.env.NODE_ENV == 'dev') {
            console.log("RESULT : " + JSON.stringify(results));
        }

        if (err) {
            console.log("ERROR : " + err);
        }

        console.log("=======================================");

        callback(err, results, fields);
    });
};

/** Insert문 수행 */
module.exports.insert = function (tableNm, params, callback) {
    
    if (!tableNm) throw new Error("Table명은 필수 입니다.");
    if (!params) throw new Error("파라메터는 필수 입니다.");
    
    var param;
    var pIsArr = false;
    
    if (params.constructor === Array) {
        param = params[0];
        pIsArr = true;
    } else {
        param = params;
    }
    
    var sParam = [];
    var sql = "INSERT INTO ?? ";
    
    sParam.push(tableNm);
    
    sql += "(";
    
    var idx = 0;
    
    for (var key in param) {
        if (idx != 0) {
            sql += ", ";
        }
        
        sql += key;
        
        idx++;
    }
    
    sql += ") VALUES ";
    
    sql += "(";
    
    idx = 0;
    
    for (var key in param) {
        if (idx != 0) {
            sql += ", ";
        }
        
        sql += "?";
        sParam.push(param[key]);
        
        idx++;
    }
    
    sql += ")";
    
    if (pIsArr == true) {
        for (var jdx = 1, _max = params.length ; jdx < _max ; jdx ++) {
            
            sql += ", (";
    
            param = params[jdx];
            idx = 0;
            
            for (var key in param) {
                if (idx != 0) {
                    sql += ", ";
                }
                
                sql += "?";
                sParam.push(param[key]);
                
                idx++;
            }
            
            sql += ")";
        }
    }
    
    this.init();
    
    var sSql;
    var ssParam;
    var maxSqlCnt = 300;
    var maxParamCnt = 30;
    
    if (sql.length > maxSqlCnt) {
        sSql = sql.substring(0, maxSqlCnt) + "...(최대 표시 글자 : " + maxSqlCnt + ")";
    } else {
        sSql = sql;
    }
    
    var isMoreParam = false;
    
    if (sParam.length > maxParamCnt) {
        ssParam = sParam.slice(1, maxParamCnt);
        isMoreParam = true;
    } else {
        ssParam = sParam;
    }
        
    console.log("= EXECUTE INSERT =======================");
    console.log("TABLE : " + tableNm);
    console.log("SQL : " + sSql);
    console.log("PARAM : " + JSON.stringify(ssParam) + (isMoreParam ? "...(최대 표시 갯수 : " + maxParamCnt + ")" : ""));

    conn.query(sql, sParam, function(err, results, fields) {
        
        if (!err) {
            console.log("RESULT : " + JSON.stringify(results));
        }
        
        if (err) {
            console.log("ERROR : " + err);
        }

        console.log("=======================================");

        if (callback) {
            
            callback(err, results, fields);
        }
    });
};

/** update문 수행 */
module.exports.update = function (tableNm, params, where, callback) {
    
    if (!tableNm) throw new Error("Table명은 필수 입니다.");
    if (!params) throw new Error("파라메터는 필수 입니다.");
    if (!where) throw new Error("Where 조건은 필수 입니다.");
    
    var sParam = [];
    var sql = "UPDATE ?? SET ";
    
    sParam.push(tableNm);
    
    var idx = 0;
    
    for (var key in params) {
        if (idx != 0) {
            sql += ", ";
        }
        
        sql += key + " = ?";
        sParam.push(params[key]);
        
        idx++;
    }
    
    sql += " WHERE ";
    
    idx = 0;
    
    for (let key in where) {
        if (idx != 0) {
            sql += " AND ";
        }
        
        sql += key + " = ?";
        sParam.push(where[key]);
        
        idx++;
    }
    
    this.init();
    
    var sSql;
    var ssParam;
    var maxSqlCnt = 300;
    var maxParamCnt = 30;
    
    if (sql.length > maxSqlCnt) {
        sSql = sql.substring(0, maxSqlCnt) + "...(최대 표시 글자 : " + maxSqlCnt + ")";
    } else {
        sSql = sql;
    }
    
    var isMoreParam = false;
    
    if (sParam.length > maxParamCnt) {
        ssParam = sParam.slice(1, maxParamCnt);
        isMoreParam = true;
    } else {
        ssParam = sParam;
    }
        
    console.log("= EXECUTE UPDATE =======================");
    console.log("TABLE : " + tableNm);
    console.log("SQL : " + sSql);
    console.log("PARAM : " + JSON.stringify(ssParam) + (isMoreParam ? "...(최대 표시 갯수 : " + maxParamCnt + ")" : ""));

    conn.query(sql, sParam, function(err, results, fields) {
        
        if (!err) {
            console.log("RESULT : " + JSON.stringify(results));
        }
        
        if (err) {
            console.log("ERROR : " + err);
        }

        console.log("=======================================");

        if (callback) {
            
            callback(err, results, fields);
        }
    });
};

/** delete문 수행 */
module.exports.delete = function (tableNm, where, callback) {
    
    if (!tableNm) throw new Error("Table명은 필수 입니다.");
    if (!where) throw new Error("Where 조건은 필수 입니다.");
    
    var sParam = [];
    var sql = "DELETE FROM ?? WHERE ";
    
    sParam.push(tableNm);
    
    idx = 0;
    
    for (let key in where) {
        if (idx != 0) {
            sql += " AND ";
        }
        
        sql += key + " = ?";
        sParam.push(where[key]);
        
        idx++;
    }
    
    this.init();
    
    var sSql;
    var ssParam;
    var maxSqlCnt = 300;
    var maxParamCnt = 30;
    
    if (sql.length > maxSqlCnt) {
        sSql = sql.substring(0, maxSqlCnt) + "...(최대 표시 글자 : " + maxSqlCnt + ")";
    } else {
        sSql = sql;
    }
    
    var isMoreParam = false;
    
    if (sParam.length > maxParamCnt) {
        ssParam = sParam.slice(1, maxParamCnt);
        isMoreParam = true;
    } else {
        ssParam = sParam;
    }
        
    console.log("= EXECUTE DELETE =======================");
    console.log("TABLE : " + tableNm);
    console.log("SQL : " + sSql);
    console.log("PARAM : " + JSON.stringify(ssParam) + (isMoreParam ? "...(최대 표시 갯수 : " + maxParamCnt + ")" : ""));

    conn.query(sql, sParam, function(err, results, fields) {
        
        if (!err) {
            console.log("RESULT : " + JSON.stringify(results));
        }
        
        if (err) {
            console.log("ERROR : " + err);
        }

        console.log("=======================================");

        if (callback) {
            
            callback(err, results, fields);
        }
    });
};