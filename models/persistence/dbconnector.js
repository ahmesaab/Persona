/**
 * Created by Mostafa on 9/12/2016.
 */


var mysql     =    require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'admin123',
    database : 'personadb',
    debug    :  false
});

module.exports = {
    get:function(callback){
        pool.getConnection(function(err, connection){
            callback(err,connection);
        });
    }
};
