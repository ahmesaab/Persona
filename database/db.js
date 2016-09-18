/**
 * Created by Saab on 9/13/2016.
 */

var mysql =  require('mysql');

var pool =  mysql.createPool({
    host : "localhost",
    user : "root",
    password: "admin123",
    database: "personadb"
});

//pool.id = Math.random()*1000;

module.exports = {
    get:function(callback){
        //pool.id = Math.random()*1000;
        //console.log(pool.id);
        pool.getConnection(function(err, connection){
            callback(err,connection);
        });
    }
};

