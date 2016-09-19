/**
 * Created by Mostafa on 9/12/2016.
 */
/*var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'address_book'
});
var app = express();

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
});


connection.query('SELECT * FROM employees',function(err,rows){
    if(err) throw err;
    console.log('Data received from Db:\n');
    console.log(rows);
});*/

var express   =    require("express");
var mysql     =    require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'honey',
    debug    :  false
});

function map(rows,callback) {
    var m = rows[0];
    console.log("map");
    rows = [m];
    callback(rows);
}

module.exports.handle_database = function(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from employees",function(err,rows){
            connection.release();
            if(!err) {
                mapUsers(rows,function(userList){

                    res.json(userList);

                });

            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
        });
    });
};



